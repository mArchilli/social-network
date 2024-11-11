import {
    doc,
    getDoc,
    setDoc
  } from "firebase/firestore";
  import { db } from "./firebase";

  /**
   * Traer los datos del usuario por el id.
   *
   * @param {string} id
   * @returns {Promise}
   */
  export async function getUserProfileById(id) {
    const refUser = doc(db, `users/${id}`);

    const userDoc = await getDoc(refUser);

    return {
      id: userDoc.id,
      email: userDoc.data().email,
      nombre: userDoc.data().nombre,
    };
  }


/**
 * Crea un nuevo perfil de usuario en Firestore.
 * @param {string} id - El ID del usuario.
 * @param {Object} data - Los datos del perfil de usuario a almacenar.
 * @returns {Promise<void>} Una promesa que se resuelve cuando se ha creado el perfil de usuario con éxito.
 */
export async function createUserProfile(id, data){
  const refUser = doc(db, `users/${id}`);

  await setDoc(refUser, data);
}
