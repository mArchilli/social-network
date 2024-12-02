// Importamos Firebase
import { initializeApp } from "firebase/app";
// Importamos Firestore
import { getFirestore } from "firebase/firestore";
// Importamos Auth
import { getAuth } from "firebase/auth";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

// Inicializamos Firebase.
const app = initializeApp(firebaseConfig);

// Conectamos a Firestore.
export const db = getFirestore(app);

// Acceso a Auth
export const auth = getAuth(app);

export const storage = getStorage(app);
export { ref, uploadBytes, getDownloadURL };
