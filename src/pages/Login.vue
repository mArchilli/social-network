<script>
import MainH1 from '../components/MainH1.vue';
import MainH2 from '../components/MainH2.vue';
import Button from '../components/Button.vue';
import ButtonSecondary from '../components/ButtonSecondary.vue';
import { login } from '../services/auth';
import imagenLogin from '@/assets/images/login/libros-login.jpg';
import Divider from '../components/Divider.vue';

export default {
  name: 'Login',
  components: { MainH1, MainH2, Button, ButtonSecondary, Divider },
  data() {
    return {
      user: {
        email: '',
        password: ''
      },
      imagenSrc: imagenLogin,
      isProcessing: false,
      errorMessage: '' 
    };
  },
  methods: {
    async handleSubmit() {
      if (!this.isProcessing) {
        this.isProcessing = true;
        this.errorMessage = ''; 
        try {
          await login(this.user.email, this.user.password);
          this.$router.push({
            path: '/perfil',
          });
        } catch (error) {
          this.errorMessage = 'Error al iniciar sesión. Por favor, revisa tus credenciales e intenta nuevamente.';
        } finally {
          this.isProcessing = false;
        }
      }
    }
  }
};
</script>

<template>
  <div class="h-full flex flex-col lg:flex-row items-center">

    <!-- Sección de Login -->
    <div class="w-full max-w-2xl px-6 md:px-12 lg:px-24 py-10 md:py-24 flex flex-col justify-center bg-white shadow-lg rounded-lg mx-auto">
      <MainH1 class="text-center text-3xl font-bold text-gray-800">Iniciar sesión</MainH1>
      <MainH2 class="text-center mt-2 text-gray-500">Bienvenido a LibraLink</MainH2>

      <form action="#" class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="mb-5">
          <label for="email" class="block mb-2 text-gray-700 font-medium">Email</label>
          <input
            type="email"
            id="email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 shadow-sm"
            v-model="user.email"
            :disabled="isProcessing">
        </div>

        <div class="mb-5">
          <label for="password" class="block mb-2 text-gray-700 font-medium">Contraseña</label>
          <input
            type="password"
            id="password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 shadow-sm"
            v-model="user.password"
            :disabled="isProcessing">
        </div>

        <div v-if="errorMessage" class="text-center text-red-600 mb-4">
          {{ errorMessage }}
        </div>

        <Divider />

        <Button type="submit" class="w-full py-2 mt-5 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition duration-200" :isProcessing="isProcessing">
          Iniciar sesión
        </Button>

        <router-link to="/registro">
          <ButtonSecondary class="w-full py-2 mt-5 bg-gray-500 text-black rounded-lg shadow hover:bg-gray-200 transition duration-200">
            Registrarse
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
