import { createRouter, createWebHashHistory } from "vue-router";
import Posts from "../pages/Posts.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Profile from "../pages/Profile.vue";
import CreateProfile from "../pages/CreateProfile.vue";
import CreatePost from "../pages/CreatePost.vue";
import UserProfile from "../pages/UserProfile.vue";
import PasswordReset from "../pages/PasswordReset.vue";
import Post from "../pages/Post.vue"; 
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Definimos las rutas de la aplicación
const routes = [
  { path: "/", component: Login },
  { path: "/posts", component: Posts, meta: { requiresAuth: true } },
  { path: "/iniciar-sesion", component: Login },
  { path: "/registro", component: Register },
  { path: "/perfil", component: Profile, meta: { requiresAuth: true } },
  { path: "/posts/:postId", name: "Post", component: Post, props: true, meta: { requiresAuth: true } },
  { path: "/crear-post", component: CreatePost, meta: { requiresAuth: true } },
  { path: "/usuario/:id", component: UserProfile, meta: { requiresAuth: true } },
  { path: "/crear-perfil", component: CreateProfile, meta: { requiresAuth: true } },
  { path: "/update-password", component: PasswordReset, meta: { requiresAuth: true } },
];

// Creamos la instancia del router
const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

// Inicializamos el estado de usuario autenticado
let authUser = { id: null, email: null };

// Escuchamos los cambios en el estado de autenticación de Firebase
onAuthStateChanged(getAuth(), (user) => {
  if (user) {
    authUser = { id: user.uid, email: user.email };
  } else {
    authUser = { id: null, email: null };
  }
});

// Definimos la lógica de protección de rutas en `beforeEach`
router.beforeEach((to, from, next) => {
  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth && !authUser.id) {
    // Redirigir a iniciar sesión si no está autenticado
    next({ path: '/iniciar-sesion' });
  } else if ((to.path === '/iniciar-sesion' || to.path === '/registro') && authUser.id) {
    // Si el usuario está autenticado, redirigir al perfil desde las rutas de inicio de sesión o registro
    next({ path: '/perfil' });
  } else {
    // Continuar con la navegación normalmente
    next();
  }
});

export default router;
