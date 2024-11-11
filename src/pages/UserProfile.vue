<script>
import MainH1 from '../components/MainH1.vue';
import MainH2 from '../components/MainH2.vue';
import Button from '../components/Button.vue';
import Skeleton from '../components/Skeleton.vue';
import LinkUser from '../components/LinkUser.vue';
import { getUserProfileById } from '../services/user_profile';
import { getPostsByUser } from '../services/post';
import { getAuth } from "firebase/auth";

export default {
  name: 'UserProfile',
  components: { MainH1, MainH2, Button, LinkUser, Skeleton },
  data() {
    return {
      user: {
        id: null,
        email: null,
        nombre: null,
      },
      posts: [],
      loading: true,
      errorMessage: ''
    };
  },
  async mounted() {
    try {
      // Datos de perfil de usuario. Sacamos el id del usuario desde la URL.
      this.user = await getUserProfileById(this.$route.params.id);

      // Obtener los posteos del usuario
      this.posts = await getPostsByUser(this.user.id);

      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.errorMessage = 'No se pudieron cargar los datos del usuario o sus posts';
    }
  },
  methods: {
    verUsuario(userId) {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser && currentUser.uid === userId) {
        this.$router.push({ path: '/perfil' });
      } else {
        this.$router.push({ path: `/usuario/${userId}`, params: { userId: userId } });
      }
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
  }
}
</script>

<template>
    <div>
      <MainH1>Perfil de usuario {{ user.email }}</MainH1>
      <p>{{ user.nombre }}</p>
  
      <div>
        <MainH2 class="mt-10">Posteos:</MainH2>
      </div>
      <div v-if="loading">
        <div v-for="n in 3" :key="n" class="mb-8">
          <Skeleton></Skeleton>
        </div>
      </div>
      <div v-else-if="errorMessage">{{ errorMessage }}</div>
      <div v-else>
        <div v-for="post in posts" :key="post.id">
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
        </div>
      </div>
    </div>
  </template>