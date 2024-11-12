<script>
import MainH1 from '../components/MainH1.vue';
import MainH2 from '../components/MainH2.vue';
import Button from '../components/Button.vue';
import Skeleton from '../components/Skeleton.vue';
import LinkUser from '../components/LinkUser.vue';
import Divider from '../components/Divider.vue';
import { getUserProfileById } from '../services/user_profile';
import { getPostsByUser } from '../services/post';
import { getAuth } from "firebase/auth";

export default {
  name: 'UserProfile',
  components: { MainH1, MainH2, Button, LinkUser, Skeleton, Divider },
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
    <!-- Encabezado de perfil -->
    <div class="flex items-center justify-between">
      <div>
        <MainH1>Perfil de {{ user.email }}</MainH1>
      </div>
    </div>

    <!-- Descripción del usuario -->
    <div class="my-4">
      <p>{{ user.nombre }}</p>
    </div>

    <div class="w-full mb-10">
      <Divider></Divider>
    </div>

    <!-- Carga de posteos -->
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
        <MainH2 class="mt-10">Posteos</MainH2>
        <div class="grid grid-cols-1 gap-8">
          <div v-for="post in posts" :key="post.id" class="max-w-[470px] w-full border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200 mx-auto">
            
            <!-- Post Image -->
            <div class="relative">
              <img 
                v-if="post.image_url" 
                :src="post.image_url" 
                :alt="post.title" 
                class="w-full object-cover rounded-t-lg transition-transform duration-200 transform hover:scale-105"
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
              <p class="text-gray-700 mb-6 leading-relaxed line-clamp-3">
                {{ post.content }}
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
