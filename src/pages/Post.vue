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
      showModal: false, // Estado para controlar la visibilidad de la modal
      showCommentModal: false, // Estado para controlar la visibilidad de la modal para comentarios
      commentToDelete: null // Almacena el índice del comentario a eliminar
    };
  },
  methods: {
    verUsuario(userId) {
      this.$router.push({ path: `/usuario/${userId}`, params: { userId: userId } });
    },
    async submitComment() {
      if (!this.isProcessing) {
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
        this.$router.push('/posts'); // Redirigir a la lista de posts
      } catch (error) {
        console.error("Error al eliminar el post:", error);
      } finally {
        this.showModal = false; // Ocultar la modal después de confirmar
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
        console.error("Error al eliminar el comentario:", error);
      } finally {
        this.showCommentModal = false; // Ocultar la modal después de confirmar
      }
    }
  },
  async created() {
    try {
      this.currentUser = currentUser(); // Obtener el usuario actual
      this.post = await getPost(this.postId);
      this.loading = false;
      this.loadComments();
    } catch (error) {
      this.loading = false;
      this.errorMessage = "El post no pudo ser encontrado.";
    }
  }
};
</script>

<template>
  <div v-if="post">
    <div class="flex items-center justify-between mb-6">
      <ButtonBack><router-link to="/posts">Volver</router-link></ButtonBack>
      <DeleteButton class="bg-red" v-if="currentUser && currentUser.id === post.user_id" @click="showModal = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
          <path fill="#ffffff" d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3zm0 5h2v9H9zm4 0h2v9h-2z"/>
        </svg>
      </DeleteButton>
    </div>
    <div class="flex flex-col md:flex-row">
      <div class="w-full md:w-5/6">
        <MainH1>{{ post.title }}</MainH1>
        <LinkUser class="mb-5" @click="verUsuario(post.user_id)"> {{ post.email }}</LinkUser>
        <p>{{ post.content }}</p>
      </div>
      <div class="w-full md:w-1/5" v-if="post.image_url">
        <img class="w-full mt-4 rounded-lg lg:mt-0" :alt="post.title" :src="post.image_url">
      </div>
    </div>

    <Divider class="mb-5"></Divider>

    <div class="flex flex-col">
      <div class="w-full px-3 mb-5">
        <MainH2>Deja tu comentario</MainH2>
        <TextAreaComment placeholder="Escribe aquí" v-model="newComment"></TextAreaComment>
        <div class="flex justify-end">
          <Button :isProcessing="isProcessing" @click="submitComment">Comentar</Button>
        </div>

      </div>
      <div class="w-full px-3 mb-5" v-if="comments.length > 0">
        <MainH2>Comentarios</MainH2>
        <div v-for="(comment, index) in comments" :key="index" class="">
          <div>
            <Comment>
              <p>{{ comment.text }}</p>
              <p class="mt-2 text-sm text-gray-600">Fecha: {{ comment.created_at.toLocaleDateString() }} Hora: {{
                comment.created_at.toLocaleTimeString() }}</p>
              <p class="text-sm text-gray-600">Usuario: {{ comment.email }}</p>
            </Comment>
          </div>
          <div class="flex justify-end py-4">
            <DeleteButton v-if="currentUser && currentUser.id === comment.user_id" class="ml-2 bg-red"
              @click="confirmDeleteComment(index)">
              Eliminar
            </DeleteButton>
          </div>

        </div>
      </div>
    </div>

    <Modal :show="showModal" title="Confirmar eliminación" message="¿Estás seguro de que deseas eliminar este post?"
      @close="showModal = false" @confirm="confirmDeletePost" />

    <Modal :show="showCommentModal" title="Confirmar eliminación de comentario"
      message="¿Estás seguro de que deseas eliminar este comentario?" @close="showCommentModal = false"
      @confirm="deleteComment" />
  </div>

  <div v-else>
    <Spinner v-if="loading" />
    <p v-else>{{ errorMessage }}</p>
    <!-- <router-link to="/posts">Volver a la página principal</router-link> -->
  </div>
</template>

<style scoped>

</style>
