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
  <div class="p-10">
    <MainH1>Crear Perfil</MainH1>
    <form @submit.prevent="handleSubmit">

      <!-- Nombre y Género -->
      <div class="flex flex-col md:flex-row mb-3">
        <div class="w-full md:w-2/4 mx-1">
          <label for="nombre">Nombre de Usuario:</label>
          <input v-model="userData.nombre" id="nombre" required class="w-full border border-gray-300 rounded disabled:bg-gray-100"/>
        </div>
        <div class="w-full md:w-2/4 mx-1">
          <label for="genero">Género:</label>
          <div>
            <select v-model="userData.genero" id="genero" class="w-full py-1 border border-gray-300 rounded disabled:bg-gray-100">
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="other">Otro</option>
            </select>
          </div>  
        </div>
      </div>

      <!-- Carga de Imagen -->
      <div class="mb-3">
        <label for="image" class="block mb-2">Imagen:</label>
        <input type="file" id="image" @change="handleImageChange" accept="image/*">
      </div>

      <!-- Biografía -->
      <div class="mb-3">
        <label for="biografia">Biografía:</label>
        <TextAreaComment v-model="userData.biografia" id="biografia"></TextAreaComment>
      </div>

      <!-- Botón de envío -->
      <Button type="submit" :disabled="sendingProfile">
        Guardar Información
      </Button>
    </form>
  </div>
</template>
