import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAxhMM0ppFRuCZYSITl1X4OEj24BIwYQcA",
  authDomain: "auth-pepvagas.firebaseapp.com",
  projectId: "auth-pepvagas",
  storageBucket: "auth-pepvagas.appspot.com",
  messagingSenderId: "421649749104",
  appId: "1:421649749104:web:921554ef18e98b666010b5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);