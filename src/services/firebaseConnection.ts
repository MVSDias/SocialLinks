
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCE_cIlUf68-Eya9aDIBgN66oUSAL04iXY",
  authDomain: "reactlinks-5fda9.firebaseapp.com",
  projectId: "reactlinks-5fda9",
  storageBucket: "reactlinks-5fda9.firebasestorage.app",
  messagingSenderId: "235068422762",
  appId: "1:235068422762:web:f98e94b37e1d39902c6813"
};

// Inicializo 0 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);// quando acessar db é pq estou acessando o banco firestore

export {auth, db}; // exporto para qualquer arquivo importar tanto a autenticação quanto o banco de dados