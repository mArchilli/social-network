<script>
import MainH1 from '../components/MainH1.vue';
import MainH2 from '../components/MainH2.vue';
import Button from '../components/Button.vue';
import ButtonSecondary from '../components/ButtonSecondary.vue';
import { register } from '../services/auth';
import imagenLogin from '@/assets/images/login/libros-login.jpg';
import Divider from '../components/Divider.vue';

export default {
  name: 'Register',
  components: { MainH1, MainH2, Button, ButtonSecondary, Divider },
  data() {
    return {
      user: {
        email: '',
        password: ''
      },
      imagenSrc: imagenLogin,
      loading: false,
      errorMessage: '' 
    };
  },
  methods: {
    async handleSubmit() {
      if (!this.loading) {
        this.loading = true;
        this.errorMessage = ''; 
        try {
          await register(this.user.email, this.user.password);
          this.$router.push({
            path: '/posts'
          });
        } catch (error) {
          console.error("Error al registrar el usuario: ", error);
          this.errorMessage = 'Error al crear la cuenta. Por favor, inténtalo de nuevo.'; 
        } finally {
          this.loading = false;
        }
      }
    }
  }
};
</script>

<template>
  <div class="flex flex-col md:flex-row items-center">
    <!-- Imagen de fondo solo visible en Desktop -->
    <div class="hidden lg:block lg:w-1/2 h-full">
      <img :src="imagenSrc" class="w-full h-full object-cover rounded-lg" alt="Imagen de LibraLink Registro">
    </div>

    <!-- Sección de Registro -->
    <div class="w-full lg:w-1/2 px-6 md:px-12 lg:px-24 py-10 md:py-14 flex flex-col justify-center bg-white shadow-lg rounded-lg lg:mb-0 mb-6">
      <MainH1 class="text-center text-3xl font-bold text-gray-800">Crear Cuenta</MainH1>
      <MainH2 class="text-center mt-2 text-gray-500">Registrate para disfrutar de nuestra red social</MainH2>

      <form action="#" class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="mb-5">
          <label for="email" class="block mb-2 text-gray-700 font-medium">Email</label>
          <input 
            type="email" 
            id="email" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 shadow-sm" 
            v-model="user.email" 
            :disabled="loading">
        </div>

        <div class="mb-5">
          <label for="password" class="block mb-2 text-gray-700 font-medium">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 shadow-sm" 
            v-model="user.password" 
            :disabled="loading">
        </div>

        <div class="mb-5">
          <input id="terms" type="checkbox" class="form-checkbox h-5 w-5" required/>
          <label for="terms" class="ml-2 text-gray-700">Acepto los términos y condiciones</label>
        </div>

        <Divider />

        <div v-if="errorMessage" class="text-center text-red-600 mb-4">
          {{ errorMessage }}
        </div>

        <Button type="submit" class="w-full py-2 mt-5 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition duration-200" :isProcessing="loading">
          Crear cuenta
        </Button>

        <router-link to="/iniciar-sesion">
          <ButtonSecondary class="w-full py-2 mt-5 bg-gray-500 text-black rounded-lg shadow hover:bg-gray-200 transition duration-200">
            Volver
          </ButtonSecondary>
        </router-link>
      </form>
    </div>
  </div>
</template>


<style scoped>
.error-message {
  color: red;
}
</style>

