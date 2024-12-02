<template>
  <div 
    v-if="post" 
    class="mx-auto px-4 sm:px-6 md:px-8 py-6 bg-gray-50 rounded-lg shadow-lg 
           w-full max-w-none md:max-w-2xl lg:max-w-3xl"
  >
    <!-- Post Header -->
    <div class="text-left">


      <div class="flex flex-row justify-between items-center mt-4 space-y-0 space-x-4">
        <!-- Botón de Volver -->
        <ButtonBack class="text-gray-700">
          <router-link to="/posts">Volver</router-link>
        </ButtonBack>

        <!-- Botón de Eliminar Post -->
        <DeleteButton 
          v-if="currentUser && currentUser.id === post.user_id" 
          @click="showModal = true" 
          class="bg-red-600 text-white p-2 rounded-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <title>Eliminar post</title>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7L12 14L5 7M12 10V3M12 3L15 6M12 3L9 6M3 6H21M19 6V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V6"></path>
          </svg>
        </DeleteButton>
      </div>


      <MainH1 class="text-2xl sm:text-4xl font-bold pt-2">{{ post.title }}</MainH1>
      <p class="text-gray-400 mt-2 text-sm sm:text-base">
        {{ formatDate(post.created_at) }} por 
        <LinkUser @click="verUsuario(post.user_id)">{{ post.email }}</LinkUser>
      </p>
      
    </div>

    <!-- Post Content -->
    <div class="prose lg:prose-lg mx-auto">
      <p>{{ post.content }}</p>
      <img 
        v-if="post.image_url" 
        :src="post.image_url" 
        :alt="post.title" 
        class="rounded-lg shadow-md mt-4 cursor-pointer w-full"
        @click="openPreview"
      />
    </div>

    <!-- Modal de Previsualización de Imagen -->
    <div 
  v-if="showPreview" 
  class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div>
    <button 
      class="absolute top-5 right-5 text-white hover:text-gray-500" 
      @click="closePreview">
      ✖
    </button>
    <img 
      :src="post.image_url" 
      alt="Previsualización de la foto" 
      class="max-w-[90%] max-h-[80vh] mx-auto rounded" />
  </div>
</div>

    <!-- Divider -->
    <Divider />

    <!-- Comments Section -->
    <section class="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <MainH2>Deja un comentario</MainH2>
      <TextAreaComment 
        v-model="newComment" 
        placeholder="Escribe tu comentario aquí..." 
        @input="updateCharacterCount"
      />
      <p class="text-sm text-gray-500 mt-2">Caracteres restantes: {{ remainingCharacters }} / {{ maxCharacters }}</p>
      <div class="flex justify-end mt-2">
        <Button :isProcessing="isProcessing" @click="submitComment">Enviar</Button>
      </div>

      <div v-if="comments.length" class="mt-8 space-y-6">
        <MainH2>Comentarios</MainH2>
        <div v-for="(comment, index) in comments" :key="index" class="bg-gray-100 p-4 rounded-lg shadow-md">
          <p>{{ comment.text }}</p>
          <p class="text-sm text-gray-500 mt-1">
            {{ formatDate(comment.created_at) }} - 
            <LinkUser @click="verUsuario(comment.user_id)">{{ comment.email }}</LinkUser>
          </p>
          <div v-if="currentUser && currentUser.id === comment.user_id" class="text-right">
            <DeleteButton @click="confirmDeleteComment(index)">Eliminar</DeleteButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Modals -->
    <Modal 
      :show="showModal" 
      title="Confirmar eliminación" 
      message="¿Estás seguro de que deseas eliminar este post?" 
      @close="showModal = false" 
      @confirm="confirmDeletePost" 
    />
    <Modal 
      :show="showCommentModal" 
      title="Confirmar eliminación de comentario" 
      message="¿Estás seguro de que deseas eliminar este comentario?" 
      @close="showCommentModal = false" 
      @confirm="deleteComment" 
    />
  </div>

  <div v-else class="text-center p-10">
    <Spinner v-if="loading" />
    <p v-else class="text-red-500">{{ errorMessage }}</p>
  </div>
</template>


<script>
import MainH1 from '../components/MainH1.vue';
import MainH2 from '../components/MainH2.vue';
import LinkUser from '../components/LinkUser.vue';
import TextAreaComment from '../components/TextAreaComment.vue';
import Button from '../components/Button.vue';
import DeleteButton from '../components/DeleteButton.vue';
import ButtonBack from '../components/ButtonBack.vue';
import Divider from '../components/Divider.vue';
import Spinner from '../components/Spinner.vue';
import Modal from '../components/Modal.vue';
import { getPost, addCommentToPost, getCommentsForPost, getUserEmail, deletePost, deleteComment } from '../services/post';
import { currentUser } from '../services/auth';

export default {
  name: 'Post',
  components: {
    MainH1,
    MainH2,
    LinkUser,
    TextAreaComment,
    Button,
    DeleteButton,
    ButtonBack,
    Divider,
    Spinner,
    Modal,
  },
  props: {
    postId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      post: null,
      comments: [],
      loading: true,
      errorMessage: '',
      newComment: '',
      isProcessing: false,
      currentUser: null,
      showModal: false,
      showCommentModal: false,
      showPreview: false,
      maxCharacters: 300,
      remainingCharacters: 300,
    };
  },
  methods: {
    verUsuario(userId) {
      this.$router.push(`/usuario/${userId}`);
    },
    async submitComment() {
      if (!this.isProcessing && this.newComment.trim().length > 0) {
        this.isProcessing = true;
        try {
          const user = this.currentUser;
          if (user && user.id) {
            await addCommentToPost(this.postId, {
              user_id: user.id,
              text: this.newComment,
            });
            this.newComment = '';
            this.loadComments();
            this.remainingCharacters = this.maxCharacters;
          }
        } catch (error) {
          console.error(error);
        } finally {
          this.isProcessing = false;
        }
      }
    },
    async loadComments() {
      try {
        this.comments = await getCommentsForPost(this.postId);
        for (let comment of this.comments) {
          comment.email = await this.getUserEmail(comment.user_id);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getUserEmail(userId) {
      return getUserEmail(userId).catch(() => null);
    },
    async confirmDeletePost() {
      try {
        await deletePost(this.postId);
        this.$router.push('/posts');
      } catch (error) {
        console.error(error);
      } finally {
        this.showModal = false;
      }
    },
    confirmDeleteComment(index) {
      this.commentToDelete = index;
      this.showCommentModal = true;
    },
    async deleteComment() {
      try {
        const comment = this.comments[this.commentToDelete];
        await deleteComment(this.postId, comment.id);
        this.comments.splice(this.commentToDelete, 1);
      } catch (error) {
        console.error(error);
      } finally {
        this.showCommentModal = false;
      }
    },
    formatDate(date) {
      return new Intl.DateTimeFormat('es', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(date));
    },
    updateCharacterCount() {
      this.remainingCharacters = this.maxCharacters - this.newComment.length;
    },
    openPreview() {
      this.showPreview = true;
    },
    closePreview() {
      this.showPreview = false;
    },
  },
  async created() {
    try {
      this.currentUser = currentUser();
      this.post = await getPost(this.postId);
      if (!this.post) this.$router.push({ name: 'NotFound' });
      this.loading = false;
      this.loadComments();
    } catch (error) {
      this.loading = false;
      this.errorMessage = 'El post no pudo ser encontrado.';
      this.$router.push({ name: 'NotFound' });
    }
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
