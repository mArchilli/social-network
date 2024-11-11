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
      this.$router.push({ path: `/posts/${postId}`, params: { postId: postId } });
    },
    verUsuario(userId) {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      console.log("CurrentUser: ", currentUser)
      console.log("CurrentUser: ", currentUser.uid)

      // Asegúrate de que userId y currentUser.uid sean del mismo tipo de dato (string)
      if (currentUser && currentUser.uid === String(userId)) {
        this.$router.push({ path: '/perfil' });
      } else {
        this.$router.push({ path: `/usuario/${userId}`, params: { userId: userId } });
      }
    }
  },

  async created() {
    try {
      this.posts = await postList();
      this.loading = false;
      console.log("Posts obtenidos:", this.posts);
    } catch (error) {
      this.loading = false;
      this.errorMessage = "Hubo un error al cargar las publicaciones. Por favor, inténtalo de nuevo más tarde.";
      console.error("Error al obtener los posts:", error);
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
  <div>
    <div class="flex flex-col mb-10 sm:flex-row">
      <div class="w-full sm:w-3/4">
        <MainH1>Feed</MainH1>
      </div>
      <div class="w-full sm:w-1/4">
        <Button class="mb-4"><router-link to="/crear-post">Crear nuevo post</router-link></Button>
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
      <div v-for="post in 5" :key="post.id" class="mb-8">
        <Skeleton></Skeleton>
      </div>
    </div>

    <div v-else>
      <div v-for="post in truncatedPosts" :key="post.id">
        <div class="flex flex-col mb-10 md:flex-row">
          <div class="w-full md:w-2/4">
            <MainH2>{{ post.title }}</MainH2>
            <LinkUser @click="verUsuario(post.user_id)"> {{ post.email }}</LinkUser>
            <p class="mr-2">{{ post.content }}</p>
            
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

        <div class="w-full mb-10">
            <Divider></Divider>
        </div>
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
