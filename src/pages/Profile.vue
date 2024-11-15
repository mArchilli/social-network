<template>
  <div class="p-10">
    <!-- Mensaje de éxito -->
    <div 
      v-if="successMessage" 
      class="success-message mb-4 p-4 text-center bg-green-500 rounded">
      {{ successMessage }}
    </div>

    <!-- Título y botón para cambiar clave -->
    <div class="flex flex-row mb-6 items-center">
      <div class="w-full sm:w-3/4">
        <MainH1 class="text-center sm:text-left hidden">Mi Perfil</MainH1>
        <ButtonBack class="text-gray-700 py-5">
          <router-link to="/posts">Volver</router-link>
        </ButtonBack>
      </div>
      <div class="w-full sm:text-right px-0 mx-0">
        <Button>
          <router-link to="/update-password">Cambiar clave</router-link>
        </Button>
      </div>
    </div>    

    <!-- Estado de carga o error -->
    <div v-if="loading" class="mt-6">
      <Skeleton v-for="n in 3" :key="n" />
    </div>
    <div v-else-if="errorMessage" class="text-red-500 text-center">
      {{ errorMessage }}
    </div>

    <!-- Información del perfil -->
    <div v-else>
      <section v-if="profile" class="mb-10">
  <MainH2 class="text-center text-2xl font-semibold mb-6 hidden">Información de mi perfil</MainH2> 

  <div class="flex items-center justify-center space-x-6 p-6 border rounded-lg shadow-md bg-white">
    
    <!-- Imagen del usuario -->
    <div class="w-24 h-24 md:w-32 md:h-32">
      <img 
        v-if="profile.image_url" 
        :src="profile.image_url" 
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
      <p v-if="profile.nombre" class="text-sm text-black mt-2"><strong>{{ profile.nombre }}</strong></p>
      <p v-if="profile.biografia" class="text-sm text-gray-700 mt-2">{{ profile.biografia }}</p>
      <!-- <p v-if="profile.genero" class="text-sm text-gray-700 mt-2"><strong>Género:</strong> {{ profile.genero }}</p> -->
    </div>
  </div>
</section>


      <Divider />

      <!-- Lista de posteos -->
      <section v-if="posts.length > 0">
        <MainH2 class="pt-5">Mis posteos</MainH2>
        <div class="grid grid-cols-1 gap-8">
          <div 
            v-for="post in posts" 
            :key="post.id" 
            class="max-w-md mx-auto border rounded-lg shadow-lg overflow-hidden">
            <img 
              v-if="post.image_url" 
              :src="post.image_url" 
              :alt="post.title" 
              class="w-full object-cover" />
            <div class="p-4">
              <h3 class="text-xl font-bold">{{ post.title }}</h3>
              <p class="text-gray-500">{{ formatDate(post.created_at) }}</p>
              <p class="my-2">{{ truncateContent(post.content) }}</p>
              <Button @click="verPost(post.id)" class="w-full">Ver más</Button>
            </div>
          </div>
        </div>
      </section>

      <!-- Mensaje si no hay posteos -->
      <section v-else class="text-center space-y-5">
        <p class="pt-10">No tienes posteos aún.</p>
        <Button>
          <router-link to="/crear-post">Crear nuevo post</router-link>
        </Button>
      </section>
    </div>

    <!-- Modal de previsualización de imagen -->
    <div 
      v-if="showPreview" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class=" rounded shadow-lg">
        <button 
          class="absolute top-4 right-4 text-gray-500 hover:text-black" 
          @click="closePreview">
          ✖
        </button>
        <img 
          :src="profile.image_url" 
          alt="Previsualización de la foto" 
          class="max-w-[90%] max-h-[80vh] mx-auto rounded" />
      </div>
    </div>
  </div>
</template>

<script>
import MainH1 from "../components/MainH1.vue";
import MainH2 from "../components/MainH2.vue";
import Button from "../components/Button.vue";
import Skeleton from "../components/Skeleton.vue";
import Divider from "../components/Divider.vue";
import ButtonBack from '../components/ButtonBack.vue';
import { getPostsByUser } from "../services/post";
import { getUserProfile } from "../services/user";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  name: "Profile",
  components: { MainH1, MainH2, Button, Skeleton, Divider, ButtonBack },
  data() {
    return {
      profile: null,
      posts: [],
      loading: true,
      errorMessage: "",
      successMessage: this.$route.query.successMessage || "",
      showPreview: false, // Control del modal
    };
  },
  async created() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          this.profile = await getUserProfile(user.uid);
          this.posts = await getPostsByUser(user.uid);
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.errorMessage = "No se pudieron cargar los datos del usuario.";
        }
      } else {
        this.loading = false;
        this.errorMessage = "No se ha iniciado sesión.";
      }
    });

    if (this.successMessage) {
      setTimeout(() => (this.successMessage = ""), 3000);
    }
  },
  methods: {
    verPost(postId) {
      this.$router.push(`/posts/${postId}`);
    },
    formatDate(date) {
      return new Date(date).toLocaleString("es-ES");
    },
    truncateContent(content) {
      return content.length > 300 ? `${content.substring(0, 300)}...` : content;
    },
    openPreview() {
      this.showPreview = true;
    },
    closePreview() {
      this.showPreview = false;
    },
  },
};
</script>

<style scoped>
.success-message {
  @apply p-4 bg-green-500 text-white rounded;
}
</style>
