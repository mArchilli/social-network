<script>
import MainH1 from '../components/MainH1.vue';
//import { saveUser } from '../services/user_profile';
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
    handleImageChange(event) {
      const file = event.target.files[0];
      this.userData.image = file;
    },
    async handleSubmit() {
      this.sendingProfile = true;
      let imageUrl = null;

      try {
        if (this.userData.image) {
          const StorageRef = ref(storage, `profile_images/${this.userData.image.name}`);
          await uploadBytes(StorageRef, this.userData.image);
          imageUrl = await getDownloadURL(StorageRef);
        }

        await saveUser({
          user_id: this.authUser.id,
          email: this.authUser.email,
          nombre: this.userData.nombre,
          biografia: this.userData.biografia,
          genero: this.userData.genero,
          image_url: imageUrl
        });

        this.userData.nombre = '';
        this.userData.email = '';
        this.userData.biografia = '';
        this.userData.genero = '';
        this.userData.image = null;

        this.$router.push({ path: '/posts' }); 
      } catch (error) {
        console.error("Error al guardar el perfil: ", error);
      } finally {
        this.sendingProfile = false;
      }
    }
  },
  mounted() {
    this.unsubscribeFromAuth = subscribeToAuth(newUserData => this.authUser = newUserData);
  },
  unmounted(){
    this.unsubscribeFromAuth();
  }
};
</script>


<template>
    <div>
      <MainH1>Crear Perfil</MainH1>
      <form @submit.prevent="handleSubmit">

        <div class="flex flex-col md:flex-row mb-3">
          <div class="w-full md:w-2/4 mx-1">
            <label for="nombre">Nombre de Usuario:</label>
            <input v-model="userData.nombre" id="nombre" required class="w-full border border-gray-300 rounded disabled:bg-gray-100"/>
          </div>
          <div class="w-full md:w-2/4 mx-1">
            <label for="genero">Género:</label>
            <div class="">
              <select v-model="userData.genero" id="genero" class="w-full py-1 border border-gray-300 rounded disabled:bg-gray-100">
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="other">Otro</option>
              </select>
            </div>  
            
          </div>
        </div>

        <div class="mb-3">
            <label for="image" class="block mb-2">Imagen:</label>
            <input type="file" id="image" @change="handleImageChange" accept="image/*">
        </div>

        <div class="mb-3">
          <label for="biografia">Biografía:</label>

          <TextAreaComment v-model="userData.biografia" id="biografia" ></TextAreaComment>
        </div>

        <Button type="submit" :disabled="sendingProfile">
          Guardar Informacion
        </Button>
      </form>
    </div>
  </template>