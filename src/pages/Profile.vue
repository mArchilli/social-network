<script>
import MainH1 from '../components/MainH1.vue';
import MainH2 from '../components/MainH2.vue';
import Button from '../components/Button.vue';
import Skeleton from '../components/Skeleton.vue';
import LinkUser from '../components/LinkUser.vue';
import { getPostsByUser } from '../services/post';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  name: 'Profile',
  components: { MainH1, MainH2, Button, LinkUser, Skeleton },
  data() {
    return {
      posts: [],
      loading: true,
      errorMessage: '',
      successMessage: this.$route.query.successMessage || '' // Obtener mensaje de éxito de la query
    };
  },
  async created() {
    const auth = getAuth();

    // Escuchar los cambios en el estado de autenticación
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userId = user.uid;
          this.posts = await getPostsByUser(userId);
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.errorMessage = 'No se pudieron cargar los posts del usuario';
        }
      } else {
        this.loading = false;
        this.errorMessage = 'No se ha iniciado sesión';
      }
    });

    // Ocultar el mensaje de éxito después de 3 segundos
    if (this.successMessage) {
      setTimeout(() => {
        this.successMessage = '';
      }, 3000); // 3000 ms = 3 segundos
    }
  },
  methods: {
    verUsuario(userId) {
      this.$router.push({ path: `/usuario/${userId}`, params: { userId: userId } });
    },
    verPost(postId) {
      this.$router.push({ path: `/posts/${postId}`, params: { postId: postId } });
    },
    formatDate(date) {
      return Intl.DateTimeFormat('es', {
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit',
      }).format(date);
    },
    truncateContent(content) {
      const maxLength = 300;
      if (content.length > maxLength) {
        return content.substring(0, maxLength) + '...';
      } else {
        return content;
      }
    },
  }
};
</script>

<template>
  <div>
    <!-- Mostrar mensaje de éxito si existe -->
    <div v-if="successMessage" class="success-message mb-4 p-4 text-center text-white bg-green-500 rounded">
      {{ successMessage }}
    </div>

    <!-- Encabezado del perfil -->
    <div class="flex items-center justify-between">
      <div>
        <MainH1>Mi Perfil</MainH1>
      </div>
      <div>
        <Button><router-link to="/update-password">Cambiar clave</router-link></Button>
      </div>
    </div>

    <!-- Carga de posts -->
    <div v-if="loading">
      <div v-for="post in 3" :key="post.id" class="mb-8">
        <Skeleton></Skeleton>
      </div>
    </div>

    <!-- Mensaje de error -->
    <div v-else-if="errorMessage">{{ errorMessage }}</div>

    <!-- Contenido del perfil -->
    <div v-else>
      <div v-if="posts.length > 0">

        <!-- Lista de posteos -->
        <MainH2 class="mt-10">Mis posteos</MainH2>
        <div v-for="post in posts" :key="post.id">
          <div class="flex flex-col mb-10 md:flex-row">
            <div class="w-full md:w-2/4">
              <MainH2>{{ post.title }}</MainH2>
              <LinkUser @click="verUsuario(post.user_id)"> {{ post.email }}</LinkUser>
              <p class="mx-2">{{ truncateContent(post.content) }}</p>

              <!-- Contenedor de la imagen para dispositivos móviles -->
              <div class="image-container md:hidden">
                <img v-if="post.image_url" class="rounded w-full my-5" :alt="post.title" :src="post.image_url">
              </div>

              <Button @click="verPost(post.id)" class="w-full md:mt-36 md:w-1/4">Ver más</Button>
              <div class="mt-3">
                <p class="text-gray-600">{{ formatDate(post.created_at) }}</p>
              </div>
            </div>
            <div class="hidden w-full md:w-2/4 md:block">
              <!-- Renderizar imagen solo en dispositivos de pantalla grande -->
              <img v-if="post.image_url" class="rounded h-72" :alt="post.title" :src="post.image_url">
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje si el usuario no tiene posteos -->
      <div v-else>
        <p class="py-4">No tienes posteos aún.</p>
        <Button><router-link to="/crear-post">Crear nuevo post</router-link></Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.success-message {
  @apply text-white bg-green-500 rounded;
}

.image-container {
  max-width: 100%; 
  overflow: hidden; 
}

.image-container img {
  width: 100%; 
  height: auto;
}
</style>