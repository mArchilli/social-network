<script>
import MainH1 from '../components/MainH1.vue';
import MainH2 from '../components/MainH2.vue';
import Button from '../components/Button.vue';
import Skeleton from '../components/Skeleton.vue';
import LinkUser from '../components/LinkUser.vue';
import Divider from '../components/Divider.vue';
import { postList } from '../services/post';
import { getAuth } from "firebase/auth";

export default {
  name: 'Posts',
  components: {
    MainH1,
    MainH2,
    Button,
    LinkUser,
    Divider,
    Skeleton
  },
  data() {
    return {
      posts: [],
      loading: true,
      errorMessage: '',
      successMessage: this.$route.query.successMessage || '' // Obtener mensaje de éxito de la query
    };
  },
  methods: {
    formatDate(date) {
      return Intl.DateTimeFormat('es', {
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit',
      }).format(date);
    },
    verPost(postId) {
      this.$router.push({ name: 'Post', params: { postId: postId } });
    },
    verUsuario(userId) {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      // console.log("CurrentUser: ", currentUser)
      // console.log("CurrentUser: ", currentUser.uid)

      // Asegúrate de que userId y currentUser.uid sean del mismo tipo de dato (string)
      if (currentUser && currentUser.uid === String(userId)) {
        this.$router.push({ path: '/perfil' });
      } else {
        this.$router.push({ name: 'UserProfile', params: { id: userId } });
      }
    }
  },

  async created() {
    try {
      this.posts = await postList();
      this.loading = false;
      // console.log("Posts obtenidos:", this.posts);
    } catch (error) {
      this.loading = false;
      this.errorMessage = "Hubo un error al cargar las publicaciones. Por favor, inténtalo de nuevo más tarde.";
      // console.error("Error al obtener los posts:", error);
    }
  },

  computed: {
    truncatedPosts() {
      const maxLength = 300;
      return this.posts.map(post => {
        if (post.content.length > maxLength) {
          return {
            ...post,
            content: post.content.substring(0, maxLength) + '...'
          };
        } else {
          return post;
        }
      });
    },
  },
};
</script>

<template>
  <div class="p-10">
    <div class="flex flex-col sm:flex-row ">
      <div class="w-full sm:w-3/4">
        <MainH1 class="text-center sm:text-left">Inicio</MainH1>
      </div>
      <div class="w-full sm:text-right">
        <Button class="w-full sm:w-auto"><router-link to="/crear-post">Nuevo post</router-link></Button>
      </div>
    </div>

    <div class="w-full mb-10">
      <Divider></Divider>
    </div>

    <!-- Mostrar mensaje de éxito si existe -->
    <div v-if="successMessage" class="success-message mb-4 p-4 text-center text-white bg-green-500 rounded">
      {{ successMessage }}
    </div>

    <div v-if="loading">
      <div v-for="n in 3" :key="n" class="mb-8">
        <Skeleton></Skeleton>
      </div>
    </div>

    <!-- Mostrar los posts si ya están cargados -->
    <div v-else-if="posts.length > 0">
      <div class="grid grid-cols-1 gap-8">
        <div 
          v-for="post in posts" 
          :key="post.id" 
          class="max-w-[470px] w-full border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200 mx-auto flex flex-col justify-between"
        >
          <!-- Imagen del Post -->
          <div class="relative">
            <img 
              v-if="post.image_url" 
              :src="post.image_url" 
              :alt="post.title" 
              class="w-full object-cover rounded-t-lg transition-transform duration-200 transform hover:scale-105"
            >
          </div>

          <!-- Contenido del Post -->
          <div class="p-6 flex flex-col">
            <!-- Título y Datos del Usuario -->
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

            <!-- Texto del Post -->
            <p class="text-gray-700 mb-6 leading-relaxed line-clamp-3">
              {{ (post.content) }}
            </p>

            <!-- Botón para ver más -->
            <div class="mt-auto">
              <Button @click="verPost(post.id)" class="w-full text-white transition-transform duration-200 transform hover:scale-105">
                Ver más
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje si no hay posts -->
    <div v-else>
      <p class="py-4">No tienes posteos aún.</p>
      <Button><router-link to="/crear-post">Crear nuevo post</router-link></Button>
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
