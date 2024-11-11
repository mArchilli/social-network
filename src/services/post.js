import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  doc,
  getDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Obtiene una lista de todos los posts en la colección "posts" de Firestore.
 * @returns {Array} Un array de objetos con cada post.
 */

export async function postList() {
  const refPosts = collection(db, "posts");
  const q = query(refPosts, orderBy("created_at", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    user_id: doc.data().user_id,
    title: doc.data().title,
    email: doc.data().email,
    content: doc.data().content,
    created_at: doc.data().created_at.toDate(),
    image_url: doc.data().image_url,
    comments: doc.data().comments
  }));
}

/**
 * Obtiene un post específico de la colección "posts" en Firestore según su ID.
 * @param {string} postId El ID único del post que se desea obtener
 * @returns {Object} Un objeto que representa el post encontrado
 */
export async function getPost(postId) {
  const posts = await postList();
  const post = posts.find((post) => post.id === postId);

  return post;
}

/**
 * Obtiene los posts de la colección "posts" en Firestore según el ID de un usuario.
 * @param {string} userId El ID único del usuario que se desea obtener los posts
 * @returns {Object} Un objeto que representa el post encontrado
 */
export async function getPostsByUser(userId) {
  const posts = await postList();
  const userPosts = posts.filter((post) => post.user_id === userId);

  return userPosts;
}

/**
 * Graba un nuevo post.
 *
 * @param {Object} data Los datos del post a grabar.
 * @returns {Promise<string>} La ID del post creado.
 */
export async function savePost(data) {
  // Agregar el post a la colección "posts"
  const postRef = await addDoc(collection(db, "posts"), {
    ...data,
    created_at: serverTimestamp(),
    comments: [] // Inicializar la lista de comentarios como un array vacío
  });

  // Devolver la ID del post creado
  return postRef.id;
}


/**
 * Agrega un comentario a un post.
 *
 * @param {string} postId La ID del post al que se agregará el comentario.
 * @param {Object} commentData Los datos del comentario a agregar.
 * @returns {Promise<void>}
 */
export async function addCommentToPost(postId, commentData) {
  // Agregar el comentario a la subcolección "comments" del post
  await addDoc(collection(doc(db, "posts", postId), "comments"), {
    ...commentData,
    created_at: serverTimestamp()
  });
}

/**
 * Obtiene los comentarios de un post específico de la colección "comments" en Firestore.
 * @param {string} postId El ID único del post del cual se desean obtener los comentarios
 * @returns {Array} Un array de objetos con cada comentario del post
 */
export async function getCommentsForPost(postId) {
  const commentsRef = collection(doc(db, "posts", postId), "comments");
  const q = query(commentsRef, orderBy("created_at", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    user_id: doc.data().user_id,
    text: doc.data().text,
    created_at: doc.data().created_at.toDate(),
  }));
}

/**
 * Obtiene el correo electrónico de un usuario dado su ID.
 * @param {string} userId El ID único del usuario
 * @returns {string} El correo electrónico del usuario
 */
export async function getUserEmail(userId) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data().email;
    } else {
      throw new Error("No se encontró ningún usuario con el ID proporcionado.");
    }
  } catch (error) {
    console.error("Error al obtener el correo electrónico del usuario:", error);
    throw error; // Lanzar el error para que pueda ser manejado en el componente que llame a esta función
  }
}

/**
 * Elimina un post específico de la colección "posts" en Firestore según su ID.
 * @param {string} postId El ID único del post que se desea eliminar
 * @returns {Promise<void>}
 */
export async function deletePost(postId) {
  const postRef = doc(db, "posts", postId);
  await deleteDoc(postRef);
}

/**
 * Elimina un comentario específico de la subcolección "comments" en Firestore según su ID.
 * @param {string} postId El ID único del post que contiene el comentario
 * @param {string} commentId El ID único del comentario que se desea eliminar
 * @returns {Promise<void>}
 */
export async function deleteComment(postId, commentId) {
  const commentRef = doc(db, "posts", postId, "comments", commentId);
  await deleteDoc(commentRef);
}