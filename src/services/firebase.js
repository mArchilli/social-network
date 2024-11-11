// Importamos Firebase
import { initializeApp } from "firebase/app";
// Importamos Firestore
import { getFirestore } from "firebase/firestore";
// Importamos Auth
import { getAuth } from "firebase/auth";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyApJ-PCfBUUvh9OvdqZ6MFzDLfBfeEcgCQ",
    authDomain: "libra-link-bb94c.firebaseapp.com",
    projectId: "libra-link-bb94c",
    storageBucket: "libra-link-bb94c.appspot.com",
    messagingSenderId: "60036069257",
    appId: "1:60036069257:web:d8c0de2f1142baae2c1358"
  };

// Inicializamos Firebase.
const app = initializeApp(firebaseConfig);

// Conectamos a Firestore.
export const db = getFirestore(app);

// Acceso a Auth
export const auth = getAuth(app);

export const storage = getStorage(app);
export { ref, uploadBytes, getDownloadURL };
