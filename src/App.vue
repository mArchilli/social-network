<script>
import Home from './pages/Home.vue';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';
import { logout, subscribeToAuth } from './services/auth';

export default {
  name: 'App',
  components: { Home },
  data() {
    return {
      menuActive: false,
      authUser: {
        id: null,
        email: null,
      }
    };
  },
  methods: {
    /**
     * Alterna el estado de visibilidad del menú.
     * 
     * Invierte el valor de `menuActive` entre `true` y `false`
     * permitiendo mostrar u ocultar el menú en dispositivos móviles.
     */
    toggleMenu() {
      this.menuActive = !this.menuActive;
    },

    /**
     * Maneja el proceso de cierre de sesión del usuario.
     * 
     * Llama a la función `logout` para cerrar la sesión del usuario y redirige 
     * a la página de inicio de sesión utilizando el router de Vue.
     */
    handleLogout(){
      logout();
      this.$router.push({
        path: '/iniciar-sesion',
      })
    }
  },
  mounted() {
    // Pedimos ser informados del estado de autenticación del usuario.
    subscribeToAuth(newUserData => this.authUser = newUserData);
  }
}
</script>

<template>
  <div class="grid h-screen grid-rows-layout montserrat">
    <nav class="flex items-center justify-between h-16 p-6 text-white bg-black lg:px-10">

      <p class="font-bold">
        LibraLink
      </p>

      <button @click="toggleMenu" class="block lg:hidden">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>

      <!-- Menu Desktop -->
      <ul class="flex-row hidden py-2 space-x-4 text-white bg-black lg:flex">
        <template v-if="authUser.id === null">
          <li><router-link to="/iniciar-sesion">Iniciar Sesión</router-link></li>
          <li><router-link to="/registro">Registro</router-link></li>
        </template>
        <template v-else>
          <li><router-link to="/posts">Feed</router-link></li>
          <li><router-link to="/perfil">Mi Perfil</router-link></li>
          <li>
            <form action="#" @submit.prevent="handleLogout">
              <button type="submit">{{ authUser.email }} (Cerrar Sesión)</button>
            </form>
          </li>
        </template>
      </ul>

    </nav>

    <!-- Menu mobile -->
    <ul v-if="menuActive" class="lg:hidden absolute top-[55px] w-full pb-4 text-white bg-black space-y-3 pl-6">
      <template v-if="authUser.id === null">
        <li><router-link to="/iniciar-sesion">Iniciar Sesión</router-link></li>
        <li><router-link to="/registro">Registro</router-link></li>
      </template>
      <template v-else>
        <li><router-link to="/posts">Feed</router-link></li>
        <li><router-link to="/perfil">Mi Perfil</router-link></li>
        <li>
          <form action="#" @submit.prevent="handleLogout">
            <button type="submit">{{ authUser.email }} (Cerrar Sesión)</button>
          </form>
        </li>
      </template>
    </ul>

    <main class="container max-w-5xl p-10 mx-auto">
      <router-view />
    </main>

    <footer class="flex flex-col md:flex-row md:space-x-10 items-center justify-center text-white h-footer bg-black">
      <p>Copyright &copy; LibraLink 2024</p>
      <p>Desarrollado por Archilli Matias</p>
    </footer>

  </div>
</template>
