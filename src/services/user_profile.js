import {
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Trae los datos del perfil de usuario desde Firestore por el ID.
 *
 * @param {string} id - El ID del usuario.
 * @returns {Promise<Object>} Un objeto con los datos del perfil del usuario.
 */
export async function getUserProfileById(id) {
  const refUser = doc(db, `users/${id}`);
  const userDoc = await getDoc(refUser);

  if (userDoc.exists()) {
    return {
      id: userDoc.id,
      email: userDoc.data().email,
      nombre: userDoc.data().nombre,
      biografia: userDoc.data().biografia || "",
      genero: userDoc.data().genero || "",
      image_url: userDoc.data().image_url || null
    };
  } else {
    console.log("No se encontró el perfil del usuario.");
    return null;
  }
}

/**
 * Crea o actualiza un perfil de usuario en Firestore.
 *
 * @param {string} id - El ID del usuario.
 * @param {Object} data - Los datos del perfil de usuario a almacenar.
 * @returns {Promise<void>} Una promesa que se resuelve cuando se ha creado o actualizado el perfil de usuario con éxito.
 */
export async function createUserProfile(id, data) {
  const refUser = doc(db, `users/${id}`);
  await setDoc(refUser, data);
}

/**
 * Guarda el perfil del usuario en Firestore, creando uno nuevo o actualizando el existente.
 * 
 * @param {Object} userProfileData - Datos del perfil de usuario a guardar.
 * @param {string} userProfileData.user_id - ID del usuario.
 * @param {string} userProfileData.email - Email del usuario.
 * @param {string} userProfileData.nombre - Nombre del usuario.
 * @param {string} userProfileData.biografia - Biografía del usuario.
 * @param {string} userProfileData.genero - Género del usuario.
 * @param {string|null} userProfileData.image_url - URL de la imagen del usuario, si existe.
 * @returns {Promise<void>} Una promesa que se resuelve cuando los datos se han guardado exitosamente.
 */
export async function saveUser(userProfileData) {
  const { user_id, email, nombre, biografia, genero, image_url } = userProfileData;

  // Datos a guardar en Firestore
  const data = {
    email,
    nombre,
    biografia,
    genero,
    image_url: image_url || null  // Usa null si no hay imagen
  };

  // Llamamos a createUserProfile para crear o actualizar el perfil
  await createUserProfile(user_id, data);
}
