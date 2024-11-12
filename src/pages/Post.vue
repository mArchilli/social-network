<template>
  <div v-if="post" class="container mx-auto p-6 space-y-10 bg-gray-50 rounded-lg shadow-lg">
    <!-- Post Header -->
    <div class="text-center">
      <ButtonBack class="text-gray-700"><router-link to="/posts">Volver</router-link></ButtonBack>
      <MainH1 class="text-4xl font-bold">{{ post.title }}</MainH1>
      <p class="text-gray-500 mt-2">{{ formatDate(post.created_at) }} por <LinkUser @click="verUsuario(post.user_id)">{{ post.email }}</LinkUser></p>
      <div class="flex justify-center mt-4 space-x-4">
        <DeleteButton 
          v-if="currentUser && currentUser.id === post.user_id" 
          @click="showModal = true" 
          class="bg-red-600 text-white px-3 py-2 rounded-md"
        >
          Eliminar Post
        </DeleteButton>
      </div>
    </div>

    <!-- Post Content -->
    <div class="prose lg:prose-lg mx-auto">
      <p>{{ post.content }}</p>
      <img v-if="post.image_url" :src="post.image_url" :alt="post.title" class="rounded-lg shadow-md mt-4">
    </div>

    <!-- Divider -->
    <Divider />

    <!-- Comments Section -->
    <section class="bg-white p-6 rounded-lg shadow-md">
      <MainH2>Deja un comentario</MainH2>
      <TextAreaComment 
        v-model="newComment" 
        placeholder="Escribe tu comentario aquí..." 
        @input="updateCharacterCount"
      />
      <!-- Mostrar el conteo de caracteres -->
      <p class="text-sm text-gray-500 mt-2">Caracteres restantes: {{ remainingCharacters }} / {{ maxCharacters }}</p>
      <div class="flex justify-end mt-2">
        <Button :isProcessing="isProcessing" @click="submitComment">Enviar</Button>
      </div>

      <!-- Comments List -->
      <div v-if="comments.length" class="mt-8 space-y-6">
        <MainH2>Comentarios</MainH2>
        <div v-for="(comment, index) in comments" :key="index" class="bg-gray-100 p-4 rounded-lg shadow-md">
          <p>{{ comment.text }}</p>
          <p class="text-sm text-gray-500 mt-1">{{ formatDate(post.created_at) }} - <LinkUser @click="verUsuario(comment.user_id)">{{ comment.email }}</LinkUser></p>
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

  <!-- Loading/Error State -->
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
import Comment from '../components/Comment.vue';
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
    ButtonBack,
    Divider,
    Comment,
    Spinner,
    Modal,
    DeleteButton
  },
  props: {
    postId: {
      type: String,
      required: true
    }
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
      commentToDelete: null,
      maxCharacters: 300, // Máximo de caracteres para el comentario
      remainingCharacters: 300 // Caracteres restantes
    };
  },
  methods: {
    verUsuario(userId) {
      this.$router.push({ path: `/usuario/${userId}`, params: { userId: userId } });
    },
    async submitComment() {
      if (!this.isProcessing && this.newComment.trim().length > 0) {
        this.isProcessing = true;
        try {
          const user = this.currentUser;
          if (user && user.id) {
            await addCommentToPost(this.postId, {
              user_id: user.id,
              text: this.newComment
            });
            this.newComment = '';
            this.loadComments();
            this.remainingCharacters = this.maxCharacters; // Restablecer contador
          } else {
            console.error("No se pudo obtener el ID del usuario actual.");
          }
        } catch (error) {
          console.error("Error al enviar el comentario:", error);
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
        console.error("Error al cargar los comentarios:", error);
      }
    },
    async getUserEmail(userId) {
      try {
        return await getUserEmail(userId);
      } catch (error) {
        console.error("Error al obtener el correo electrónico del usuario:", error);
        return null;
      }
    },
    async confirmDeletePost() {
      try {
        await deletePost(this.postId);
        this.$router.push('/posts');
      } catch (error) {
        console.error("Error al eliminar el post:", error);
      } finally {
        this.showModal = false;
      }
    },
    confirmDeleteComment(index) {
      this.commentToDelete = index;
      this.showCommentModal = true;
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
    async deleteComment() {
      try {
        const comment = this.comments[this.commentToDelete];
        await deleteComment(this.postId, comment.id);
        this.comments.splice(this.commentToDelete, 1);
      } catch (error) {
        console.error("Error al eliminar el comentario:", error);
      } finally {
        this.showCommentModal = false;
      }
    },
    updateCharacterCount() {
      this.remainingCharacters = this.maxCharacters - this.newComment.length;
    }
  },
  async created() {
    try {
      this.currentUser = currentUser();
      // Intentamos obtener el post
      this.post = await getPost(this.postId);
      
      // Si el post no se encuentra, redirigimos al usuario a la página 404
      if (!this.post) {
        this.$router.push({ name: 'NotFound' });
      } else {
        this.loading = false;
        this.loadComments();
      }
    } catch (error) {
      this.loading = false;
      this.errorMessage = "El post no pudo ser encontrado.";
      // Si ocurre un error al obtener el post, redirigimos a la página 404
      this.$router.push({ name: 'NotFound' });
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
.prose p {
  color: #333;
}
</style>
