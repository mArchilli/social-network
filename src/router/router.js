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
import { subscribeToAuth } from "../services/auth";

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

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

let authUser = {
  id: null,
  email: null,
}

subscribeToAuth(newUserData => authUser = newUserData);

// Limitamos posts (prueba. TODO: completar otras rutas.
router.beforeEach((to, from) =>{
  if(authUser.id === null && to.meta.requiresAuth){
    return  {
      path: '/iniciar-sesion',
    };
  }
})

export default router;
