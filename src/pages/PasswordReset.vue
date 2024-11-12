<script>
import { auth } from '../services/firebase';
import { changeUserPassword } from '../services/auth';
import MainH1 from '../components/MainH1.vue';
import MainH2 from '../components/MainH2.vue';
import ButtonBack from '../components/ButtonBack.vue';
import Button from '../components/Button.vue';

export default {
  name: 'ResetPassword',
  components: { MainH1, MainH2, ButtonBack, Button },
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      loading: false,
      errorMessage: '',
      successMessage: ''
    };
  },
  methods: {
    async updateUserPassword() {
      if (this.loading) return;

      if (!this.newPassword || !this.confirmPassword) {
        this.errorMessage = 'Por favor, complete todos los campos.';
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden.';
        return;
      }

      const user = auth.currentUser;
      if (user) {
        try {
          this.loading = true;
          this.errorMessage = '';
          await changeUserPassword(user, this.newPassword);
          console.log('Clave actualizada correctamente');
          this.newPassword = '';
          this.confirmPassword = '';
          this.successMessage = 'Contraseña actualizada correctamente.'; // Establecemos el mensaje de éxito
          setTimeout(() => {
            this.$router.push({ path: '/perfil', query: { successMessage: this.successMessage } });
          }, 2000); // Redirigir después de 2 segundos
        } catch (error) {
          console.error('Error al actualizar la clave:', error);
          this.errorMessage = 'Error al actualizar la contraseña. Por favor, inténtalo de nuevo.';
        } finally {
          this.loading = false;
        }
      }
    }
  }
};
</script>

<template>
  <div class="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
    <ButtonBack class="text-gray-500 hover:text-gray-700">
      <router-link to="/perfil">Volver</router-link>
    </ButtonBack>
    
    <MainH1 class="text-3xl font-semibold text-center text-gray-800 my-6">Cambiar Contraseña</MainH1>

    <MainH2 class="text-xl font-medium text-gray-700 mb-4">Ingrese su nueva contraseña</MainH2>

    <div class="mb-4">
      <input 
        type="password" 
        v-model="newPassword" 
        placeholder="Nueva Contraseña" 
        class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      >
    </div>

    <div class="mb-4">
      <input 
        type="password" 
        v-model="confirmPassword" 
        placeholder="Confirmar Contraseña" 
        class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      >
    </div>

    <div v-if="errorMessage" class="text-red-600 mb-4 p-2 bg-red-100 rounded-md">
      {{ errorMessage }}
    </div>

    <div v-if="successMessage" class="text-green-600 mb-4 p-2 bg-green-100 rounded-md">
      {{ successMessage }}
    </div>

    <Button :isProcessing="loading" @click="updateUserPassword" class="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
      {{ loading ? 'Actualizando...' : 'Actualizar Contraseña' }}
    </Button>
  </div>
</template>

<style scoped>
.success-message {
  @apply text-white bg-green-500 rounded;
}
</style>
