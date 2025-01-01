import {initializeApp} from "firebase/app"
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyBWZGout77vuPc5m3foqMulMlai3DqgGZk",
    authDomain: "netflix-3021f.firebaseapp.com",
    projectId: "netflix-3021f",
    storageBucket: "netflix-3021f.appspot.com",
    messagingSenderId: "665858557600",
    appId: "1:665858557600:web:a2c3d684cb59fb9d4e2bc5",
    measurementId: "G-4XR4FW8YKN"
  };
  
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;