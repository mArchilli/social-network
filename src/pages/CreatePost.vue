<script>
import MainH1 from '../components/MainH1.vue';
import { savePost } from '../services/post';
import { subscribeToAuth } from "../services/auth";
import { storage, ref, uploadBytes, getDownloadURL } from '../services/firebase';
import ButtonBack from '../components/ButtonBack.vue';
import Button from '../components/Button.vue';
import TextAreaComment from '../components/TextAreaComment.vue';

export default {
  name: 'CreatePost',
  components: { MainH1, ButtonBack, Button, TextAreaComment },
  data() {
    return {
      newPost: {
        title: '',
        content: '',
        image: null
      },
      sendingPost: false,
      posts: [],
      postsLoaded: false,
      authUser: {
        id: null,
        email: null,
      },
      unsubscribeFromAuth: () => {},
      errorMessage: ''
    };
  },
  methods: {
    handleImageChange(event) {
      const file = event.target.files[0];
      this.newPost.image = file;
    },
    async submitPost() {
      this.sendingPost = true;
      this.errorMessage = ''; 

      try {
        let imageUrl = null;
        if (this.newPost.image) {
          const storageRef = ref(storage, `imagenes/${this.newPost.image.name}`);
          await uploadBytes(storageRef, this.newPost.image);
          imageUrl = await getDownloadURL(storageRef);
        }

        await savePost({
          user_id: this.authUser.id,
          email: this.authUser.email,
          title: this.newPost.title,
          content: this.newPost.content,
          image_url: imageUrl
        });

        this.newPost.title = "";
        this.newPost.content = "";
        this.newPost.image = null;
        this.$router.push({ 
          path: '/posts', 
          query: { successMessage: 'Post creado exitosamente.' }
        }); 
      } catch (error) {
        console.error("Error al crear el post: ", error);
        this.errorMessage = 'Error al crear el post. Por favor, inténtalo de nuevo.';
      } finally {
        this.sendingPost = false;
      }
    }
  },
  mounted() {
    this.unsubscribeFromAuth = subscribeToAuth(newUserData => this.authUser = newUserData);
  },
  unmounted(){
    this.unsubscribeFromAuth();
  }
}
</script>

<template>
  <div>
    <div class="mb-3">
      <ButtonBack><router-link to="/posts">Volver</router-link></ButtonBack>
    </div>
    <MainH1 class="text-3xl mb-6">Nuevo post</MainH1>
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <form @submit.prevent="submitPost">
        <div class="mb-4">
          <label for="title" class="block text-gray-700 text-sm font-bold mb-2">Título:</label>
          <input class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                 id="title" type="text" placeholder="Ingresa el título" v-model="newPost.title" required>
        </div>
        <div class="mb-4">
          <label for="image" class="block text-gray-700 text-sm font-bold mb-2">Imagen:</label>
          <input type="file" id="image" @change="handleImageChange" accept="image/*" 
                 class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>
        <div class="mb-6">
          <label for="content" class="block text-gray-700 text-sm font-bold mb-2">Contenido:</label>
          <TextAreaComment aria-placeholder="Escribe aquí" v-model="newPost.content" />
        </div>
        <Button :isProcessing="sendingPost" type="submit" class="w-full">
          {{ sendingPost ? 'Publicando...' : 'Publicar' }}
        </Button>
      </form>
    </div>
    <div v-if="errorMessage" class="text-center text-red-600">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.error-message {
  color: red;
}
</style>
