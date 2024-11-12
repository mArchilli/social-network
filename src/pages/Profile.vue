<script>
import MainH1 from '../components/MainH1.vue';
import MainH2 from '../components/MainH2.vue';
import Button from '../components/Button.vue';
import Skeleton from '../components/Skeleton.vue';
import LinkUser from '../components/LinkUser.vue';
import Divider from '../components/Divider.vue';
import { getPostsByUser } from '../services/post';
import { getAuth, onAuthStateChanged } from "firebase/auth";


export default {
  name: 'Profile',
  components: { MainH1, MainH2, Button, LinkUser, Skeleton, Divider },
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

    <div class="w-full mb-10">
      <Divider></Divider>
    </div>

    <!-- Carga de posts -->
    <div v-if="loading">
      <div v-for="n in 3" :key="n" class="mb-8">
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
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div v-for="post in posts" :key="post.id" class="max-w-[470px] w-full border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200 mx-auto">
            
            <!-- Post Image -->
            <div class="relative">
              <img 
                v-if="post.image_url" 
                :src="post.image_url" 
                :alt="post.title" 
                class="w-full h-80 object-cover rounded-t-lg transition-transform duration-200 transform hover:scale-105"
              >
            </div>

            <!-- Post Content -->
            <div class="p-6 flex flex-col">
              <!-- Header: Title and User Information -->
              <div class="mb-4">
                <MainH2 class="text-2xl font-bold mb-1">{{ post.title }}</MainH2>
                <div class="flex items-center text-gray-500 text-sm">
                  <LinkUser @click="verUsuario(post.user_id)" class="mr-2 hover:underline">
                    {{ post.email }}
                  </LinkUser>
                  <span class="text-gray-400">•</span>
                  <span class="ml-2">{{ formatDate(post.created_at) }}</span>
                </div>
              </div>

              <!-- Post Content Text -->
              <p class="text-gray-700 mb-6 leading-relaxed">
                {{ truncateContent(post.content) }}
              </p>

              <!-- Footer with Button -->
              <div class="mt-auto">
                <Button @click="verPost(post.id)" class="w-full text-white transition-transform duration-200 transform hover:scale-105">
                  Ver más
                </Button>
              </div>
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