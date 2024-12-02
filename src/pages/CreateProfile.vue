<script>
import MainH1 from '../components/MainH1.vue';
import { saveUser } from '../services/user_profile';
import { subscribeToAuth } from "../services/auth";
import { storage, ref, uploadBytes, getDownloadURL } from '../services/firebase';
import Button from '../components/Button.vue';
import TextAreaComment from '../components/TextAreaComment.vue';

export default {
  name: 'CreateProfile',
  components: { MainH1, Button, TextAreaComment },
  data() {
    return {
      userData: {
        userId: this.$route.query.userId, // Obtener el userId de la query
        nombre: '',
        email: '',
        biografia: '',
        genero: '',
        image: null
      },
      sendingProfile: false,
      authUser: {
        id: null,
        email: null,
      },
      unsubscribeFromAuth: () => {},
    };
  },
  methods: {
    // Manejo del cambio de imagen
    handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.userData.image = file;
      }
    },

    // Manejo del envío del formulario
    async handleSubmit() {
      this.sendingProfile = true;
      let imageUrl = null;

      try {
        // Si se selecciona una imagen, subimos la imagen a Firebase Storage
        if (this.userData.image) {
          const storageRef = ref(storage, `profile_images/${this.userData.image.name}`);
          await uploadBytes(storageRef, this.userData.image); // Subimos la imagen
          imageUrl = await getDownloadURL(storageRef); // Obtenemos la URL de la imagen subida
        }

        // Guardamos la información del perfil en Firestore
        await saveUser({
          user_id: this.userData.userId, // Usamos el userId recibido
          email: this.authUser.email,
          nombre: this.userData.nombre,
          biografia: this.userData.biografia,
          genero: this.userData.genero,
          image_url: imageUrl // Guardamos la URL de la imagen si existe
        });

        // Limpiamos el formulario
        this.resetForm();

        // Redirigimos al usuario al siguiente paso (por ejemplo, página de posts)
        this.$router.push({ path: '/posts' }); 

      } catch (error) {
        console.error("Error al guardar el perfil: ", error);
      } finally {
        this.sendingProfile = false;
      }
    },

    // Limpiar los datos del formulario después de guardar
    resetForm() {
      this.userData.nombre = '';
      this.userData.email = '';
      this.userData.biografia = '';
      this.userData.genero = '';
      this.userData.image = null;
    }
  },

  mounted() {
    // Suscribirse a los datos de autenticación del usuario
    this.unsubscribeFromAuth = subscribeToAuth(newUserData => {
      this.authUser = newUserData;
    });
  },

  unmounted() {
    // Limpiar la suscripción cuando el componente se desmonte
    this.unsubscribeFromAuth();
  }
};
</script>

<template>
  <div class="flex flex-col md:flex-row items-center">
    <!-- Sección de Perfil -->
    <div class="w-full max-w-2xl px-6 md:px-12 lg:px-24 py-10 md:py-14 flex flex-col justify-center bg-white shadow-lg rounded-lg lg:mb-0 mb-6 mx-auto">
      <MainH1 class="text-center text-3xl font-bold text-gray-800">Crear Perfil</MainH1>
      <MainH2 class="text-center mt-2 text-gray-500">Completa tu perfil para comenzar</MainH2>

      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <!-- Nombre y Género -->
        <div class="flex flex-col md:flex-row mb-5 space-y-4 md:space-y-0">
          <div class="w-full md:w-1/2 mx-1">
            <label for="nombre" class="block mb-2 text-gray-700 font-medium">Nombre de Usuario</label>
            <input 
              v-model="userData.nombre" 
              id="nombre" 
              required 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 shadow-sm"
            />
          </div>
          <div class="w-full md:w-1/2 mx-1">
            <label for="genero" class="block mb-2 text-gray-700 font-medium">Género</label>
            <select 
              v-model="userData.genero" 
              id="genero" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 shadow-sm"
            >
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="other">Otro</option>
            </select>
          </div>
        </div>

        <!-- Carga de Imagen -->
        <div class="mb-5">
          <label for="image" class="block mb-2 text-gray-700 font-medium">Imagen</label>
          <input 
            type="file" 
            id="image" 
            @change="handleImageChange" 
            accept="image/*" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 shadow-sm"
          />
        </div>

        <!-- Biografía -->
        <div class="mb-5">
          <label for="biografia" class="block mb-2 text-gray-700 font-medium">Biografía</label>
          <TextAreaComment 
            v-model="userData.biografia" 
            id="biografia" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 shadow-sm"
          ></TextAreaComment>
        </div>

        <!-- Botón de envío -->
        <div>
          <Button 
            type="submit" 
            class="w-full py-2 mt-5 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition duration-200"
            :isProcessing="sendingProfile"
          >
            Guardar Información
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

