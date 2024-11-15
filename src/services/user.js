// services/user.js
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase"; // Asegúrate de que este archivo exporta tu instancia de Firestore

/**
 * Obtiene el perfil del usuario desde Firestore.
 * @param {string} userId - UID del usuario.
 * @returns {Promise<Object>} - Datos del perfil del usuario.
 */
export async function getUserProfile(userId) {
  try {
    const userDoc = doc(db, "users", userId);
    const docSnapshot = await getDoc(userDoc);

    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      throw new Error("El perfil del usuario no existe.");
    }
  } catch (error) {
    console.error("[getUserProfile] Error al obtener el perfil:", error);
    throw error;
  }
}
