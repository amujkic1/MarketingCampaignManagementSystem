import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPAkXLCP0tNYnFYxck0NLzUXmHah_ItDs",
  authDomain: "mcms-bb018.firebaseapp.com",
  projectId: "mcms-bb018",
  storageBucket: "mcms-bb018.appspot.com",
  messagingSenderId: "215302202155",
  appId: "1:215302202155:web:2e36d0822a9a1736965b6e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);