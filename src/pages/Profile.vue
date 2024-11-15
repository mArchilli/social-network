<script>
import MainH1 from '../components/MainH1.vue';
import MainH2 from '../components/MainH2.vue';
import Button from '../components/Button.vue';
import Skeleton from '../components/Skeleton.vue';
import LinkUser from '../components/LinkUser.vue';
import Divider from '../components/Divider.vue';
import { getPostsByUser } from '../services/post';
import { getUserProfile } from '../services/user';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  name: 'Profile',
  components: { MainH1, MainH2, Button, LinkUser, Skeleton, Divider },
  data() {
    return {
      profile: null, // Datos del perfil del usuario
      posts: [], // Publicaciones del usuario
      loading: true,
      errorMessage: '',
      successMessage: this.$route.query.successMessage || '', // Mensaje de éxito
    };
  },
  async created() {
    const auth = getAuth();

    // Escuchar los cambios en el estado de autenticación
    onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userId = user.uid;

      // Obtener el perfil del usuario
      const userProfile = await getUserProfile(userId);
      console.log("Datos del perfil del usuario:", userProfile); // Mostrar en consola
      this.profile = userProfile;

      // Obtener los posts del usuario
      const userPosts = await getPostsByUser(userId);
      console.log("Publicaciones del usuario:", userPosts); // Mostrar en consola
      this.posts = userPosts;

      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.errorMessage = 'No se pudieron cargar los datos del usuario.';
      console.error("Error al cargar los datos del usuario:", error);
    }
  } else {
    this.loading = false;
    this.errorMessage = 'No se ha iniciado sesión.';
  }
});


    // Ocultar el mensaje de éxito después de 3 segundos
    if (this.successMessage) {
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
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
      return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
    },
  },
};
</script>

<template>
  <div>
    <!-- Mensaje de éxito -->
    <div v-if="successMessage" class="success-message mb-4 p-4 text-center text-white bg-green-500 rounded">
      {{ successMessage }}
    </div>

    <!-- Título y botón para cambiar clave -->
    <div class="flex flex-col sm:flex-row">
      <div class="w-full sm:w-3/4">
        <MainH1 class="text-center sm:text-left">Mi Perfil</MainH1>
      </div>
      <div class="w-full sm:text-right">
        <Button class="w-full sm:w-auto"><router-link to="/update-password">Cambiar clave</router-link></Button>
      </div>
    </div>

    <div class="w-full mb-10">
      <Divider></Divider>
    </div>

    <!-- Carga o error -->
    <div v-if="loading">
      <div v-for="n in 3" :key="n" class="mb-8">
        <Skeleton></Skeleton>
      </div>
    </div>
    <div v-else-if="errorMessage">{{ errorMessage }}</div>

    <!-- Información del perfil -->
    <div v-else>
      <div v-if="profile" class="mb-10">
        <MainH2 class="text-center sm:text-left">Información de mi perfil</MainH2>
        <div class="p-4 border rounded-lg shadow-md bg-gray-100 flex items-center space-x-4">
  <!-- Imagen del usuario -->
  <div class="w-20 h-20">
    <img
      v-if="profile.image_url"
      :src="profile.image_url"
      alt="Foto de perfil"
      class="w-full h-full object-cover rounded-full border-2 border-gray-300 shadow-sm"
    />
    <div
      v-else
      class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 rounded-full border-2 border-gray-300 shadow-sm"
    >
      Sin foto
    </div>
  </div>

  <!-- Información del usuario -->
  <div>
    <p><strong>Email:</strong> {{ profile.email }}</p>
    <p v-if="profile.nombre"><strong>Nombre:</strong> {{ profile.nombre }}</p>
    <p v-if="profile.biografia"><strong>Biografía:</strong> {{ profile.biografia }}</p>
    <p v-if="profile.genero"><strong>Género:</strong> {{ profile.genero }}</p>
    <p v-if="profile.createdAt">
      <strong>Miembro desde:</strong> {{ formatDate(profile.createdAt.toDate()) }}
    </p>
  </div>
</div>

      </div>

      <!-- Lista de posteos -->
      <div v-if="posts.length > 0">
        <MainH2 class="text-center sm:text-left">Mis posteos</MainH2>
        <div class="grid grid-cols-1 gap-8">
          <div
            v-for="post in posts"
            :key="post.id"
            class="max-w-[470px] w-full border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200 mx-auto"
          >
            <!-- Imagen del post -->
            <div class="relative">
              <img
                v-if="post.image_url"
                :src="post.image_url"
                :alt="post.title"
                class="w-full object-cover rounded-t-lg transition-transform duration-200 transform hover:scale-105"
              >
            </div>
            <!-- Contenido del post -->
            <div class="p-6 flex flex-col">
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
              <p class="text-gray-700 mb-6 leading-relaxed">{{ truncateContent(post.content) }}</p>
              <div class="mt-auto">
                <Button @click="verPost(post.id)" class="w-full text-white transition-transform duration-200 transform hover:scale-105">
                  Ver más
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje si no hay posteos -->
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
