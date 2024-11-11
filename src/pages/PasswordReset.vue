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
      errorMessage: ''
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
  <div>
    <ButtonBack><router-link to="/perfil">Volver</router-link></ButtonBack>
    <MainH1 class="text-3xl mb-4">Cambiar Contraseña</MainH1>
    <MainH2 class="mb-2">Ingrese su nueva contraseña</MainH2>

    <div class="mb-4">
      <input type="password" v-model="newPassword" placeholder="Nueva Contraseña" class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
    </div>
    <div class="mb-4">
      <input type="password" v-model="confirmPassword" placeholder="Confirmar Contraseña" class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
    </div>
    <div v-if="errorMessage" class="text-red-600 mb-4">{{ errorMessage }}</div>
    <Button :isProcessing="loading" @click="updateUserPassword" class="w-full">
      {{ loading ? 'Actualizando...' : 'Actualizar Contraseña' }}
    </Button>
  </div>
</template>

<style scoped>
.success-message {
  @apply text-white bg-green-500 rounded;
}
</style>
