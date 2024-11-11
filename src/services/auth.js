import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  setPersistence,
  browserSessionPersistence
} from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile } from "./user_profile";

const EMPTY_USER_DATA = {
  id: null,
  email: null,
};

// Configura la persistencia de la sesión
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Persistencia de sesión configurada.");
  })
  .catch((error) => {
    console.error("Error al configurar la persistencia de la sesión: ", error);
  });

// Definimos la variable para los datos del usuario (el "subject" de nuestro observer).
let userData = EMPTY_USER_DATA;

// Definimos la variable para los observers.
let observers = [];

//Utilizamos el LocalStorage como metodo de validacion para saber si el usuario se encuentra autenticado
//Este metodo se ejecuta cada vez que la pagina arranca
if(localStorage.getItem('user') !== null){
  userData = JSON.parse(localStorage.getItem('user'));
}

/**
 * Actualiza el estado del usuario dependiendo de su estado en Firestore Authentication.
 * @param {Object} auth - El objeto de autenticación de Firebase.
 */
onAuthStateChanged(auth, (user) => {
  if (user) {
    setUserData({
      id: user.uid,
      email: user.email,
    });
  } else {
    setUserData(EMPTY_USER_DATA);
  }
  // Update userData.
});

/**
 * Crea una cuenta de usuario, y lo autentica.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<void>}
 */
export async function register(email, password) {
  try {
     // Creando el usuario en el auth
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Usuario creado. ID: ", userCredentials.user.uid);

      // Se crea el perfil de usuario en /users/{idUsuario}
      await createUserProfile(userCredentials.user.uid, {email});
  } catch (error) {
    console.error(
      "[auth.js register] Error al crear una cuenta: ",
      error.code
    );
    throw error;
  }
}

/**
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<void>}
 */
export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      console.log("Usuario autenticado. ID: ", userCredentials.user.uid);
    })
    .catch((error) => {
      console.error("[auth.js login] Error en los datos proporcionados: ", error.code);
      throw error;
    });
}

/**
 *
 * @returns {Promise<void>}
 */
export function logout() {

  //Aprovechamos la funcion logout para eliminar las credenciales generadas en setUserData
  localStorage.removeItem('user');
  return signOut(auth);
}

/*-------------------------------------------------------------------------
| Implementación de Observer para el estado de autenticación
+--------------------------------------------------------------------------*/

/**
 * Suscribe un observer (el callback) para la autenticación.
 * Este callback va a ejecutarse cada vez que el estado cambie, y cuando se
 * suscribe.
 * Retorna una funcion para cancelar la suscripción
 *
 * @param {() => {}} callback
 * @returns {() => void}
 */
export function subscribeToAuth(callback) {
  // Agregamos el callback al stack de observers.
  observers.push(callback);
  // console.log("[auth.js subscribeToAuth] Observer suscrito. El stack actual es: ", observers);

  // Le notificamos los datos actuales.
  notify(callback);

  // Filtramos funciones que no sean callbacks
  return () => {
    observers = observers.filter((obs) => obs !== callback);
    // console.log("[auth.js subscribeToAuth] Observer removido. El stack actual es: ", observers);
  };
}

/**
 * Notifica a un observer de los datos actuales del usuario.
 *
 * @param {() => {}} observer
 */
function notify(observer) {
  observer({ ...userData });
}

/**
 * Notifica a todos los observers.
 *
 * Esta función debe invocarse cada vez que la variable userData cambie.
 */
function notifyAll() {
  observers.forEach((observer) => notify(observer));
}

/**
 * Actualiza los datos del objeto userData y notifica a todos los observers suscritos al cambio
 * @param {{}} newData
 */
function setUserData(newData) {
  userData = {
    ...userData,
    ...newData,
  };

  // Almacenamos en LocalStorage los datos del usuario al momento de autenticarse
  localStorage.setItem('user', JSON.stringify(userData));


  notifyAll();
}

/**
 * Cambia la contraseña del usuario.
 * @param {Object} user - El objeto de usuario de Firebase.
 * @param {string} newPassword - La nueva contraseña del usuario.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la contraseña se ha cambiado con éxito.
 */
export const changeUserPassword = (user, newPassword) => {
  return updatePassword(user, newPassword);
};


/**
 * Retorna el objeto de datos del usuario actual.
 *
 * @returns {{ id: string, email: string } | null} Datos del usuario actual
 */
export const currentUser = () => {
  return { ...userData }; // Devuelve una copia de los datos del usuario para evitar modificaciones no deseadas
}