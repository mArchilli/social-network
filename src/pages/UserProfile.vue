<script>
import MainH1 from '../components/MainH1.vue';
import MainH2 from '../components/MainH2.vue';
import Button from '../components/Button.vue';
import Skeleton from '../components/Skeleton.vue';
import LinkUser from '../components/LinkUser.vue';
import Divider from '../components/Divider.vue';
import ButtonBack from '../components/ButtonBack.vue';
import { getUserProfileById } from '../services/user_profile';
import { getPostsByUser } from '../services/post';
import { getAuth } from "firebase/auth";

export default {
  name: 'UserProfile',
  components: { MainH1, MainH2, Button, LinkUser, Skeleton, Divider, ButtonBack },
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
    // Obtener el ID del usuario desde la ruta
    const userId = this.$route.params.id;
    // console.log("User ID from route:", userId);

    // Obtener datos de perfil de usuario
    this.user = await getUserProfileById(userId);
    // console.log("User data:", this.user);

    // Obtener los posteos del usuario
    this.posts = await getPostsByUser(this.user.id);
    // console.log("User posts:", this.posts);

    this.loading = false;
  } catch (error) {
    this.loading = false;
    this.errorMessage = 'No se pudieron cargar los datos del usuario o sus posts';
    // console.error("Error al cargar datos del usuario o posts:", error);
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
  <div class="p-10">
    <!-- Encabezado de perfil -->
    <div class="flex flex-row mb-6 items-center">
      <div class="w-full sm:w-3/4">
        <MainH1 class="text-center sm:text-left hidden">Mi Perfil</MainH1>
        <ButtonBack class="text-gray-700 py-5">
          <router-link to="/posts">Volver</router-link>
        </ButtonBack>
      </div>
    </div> 

    <section  class="mb-10">
      <MainH1 class="text-center text-2xl font-semibold mb-6 hidden">Información de mi perfil</MainH1> 

      <div class="flex items-center justify-center space-x-6 p-6 border rounded-lg shadow-md bg-white">
        
        <!-- Imagen del usuario -->
        <div class="w-24 h-24 md:w-32 md:h-32">
          <img 
            v-if="user.image_url" 
            :src="user.image_url" 
            alt="Foto de perfil" 
            class="w-full h-full object-cover object-center rounded-full border-4 border-white shadow-lg cursor-pointer"
            @click="openPreview" 
          />
          <div 
            v-else 
            class="w-full h-full flex items-center justify-center bg-gray-300 text-white font-semibold rounded-full border-4 border-white shadow-lg">
            Sin foto
          </div>
        </div>

        <!-- Detalles del perfil -->
        <div class="flex flex-col justify-center">
          <!-- <p class="text-lg font-medium"><strong>Email:</strong> {{ profile.email }}</p> -->
          <p v-if="user.nombre" class="text-sm text-black mt-2"><strong>{{ user.nombre }}</strong></p>
          <p v-if="user.biografia" class="text-sm text-gray-700 mt-2">{{ user.biografia }}</p>
          <!-- <p v-if="profile.genero" class="text-sm text-gray-700 mt-2"><strong>Género:</strong> {{ profile.genero }}</p> -->
        </div>
      </div>
    </section>

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
