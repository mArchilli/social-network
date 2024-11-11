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
  <div class="md:flex">
    <div class="hidden md:block md:w-1/2">
      <img :src="imagenSrc" class="w-full rounded-lg" alt="Imagen de LibraLink Logeo">
    </div>

    <div class="md:w-1/2 flex flex-col justify-stretch px-3">
      <MainH1 class="text-center">Crear Cuenta</MainH1>
      <MainH2 class="text-center mt-3">Registrate para disfrutar de nuestra red social</MainH2>
      <form action="#" class="md:pt-24" @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="email" class="block mb-2">Email</label>
          <input type="email" id="email" class="w-full p-2 border border-gray-300 rounded disabled:bg-gray-100"
            :disabled="loading" v-model="user.email">
        </div>

        <div class="mb-3">
          <label for="password" class="block mb-2">Contraseña</label>
          <input type="password" id="password" class="w-full p-2 border border-gray-300 rounded disabled:bg-gray-100"
            :disabled="loading" v-model="user.password">
          <!-- Mostrar mensaje de error debajo del campo de contraseña -->
          <div v-if="errorMessage" class="error-message mt-2 text-red-600">
            {{ errorMessage }}
          </div>
        </div>
        
        <div class="mb-3">
          <input id="terms" type="checkbox" class="form-checkbox h-5 w-5" required/>
          <label for="terms" class="ml-2 text-gray-700">Acepto los términos y condiciones</label>
        </div>

        <Divider></Divider>

        <Button type="submit" class="w-full border mt-5" :isProcessing="loading">Crear cuenta</Button>
        <router-link to="/iniciar-sesion">
          <ButtonSecondary class="w-full border mt-5">
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

