import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBNV8k3tkgP0m0jAwct5Nk03uBCrM_RSkQ",
  authDomain: "kawahub.firebaseapp.com",
  projectId: "kawahub",
  storageBucket: "kawahub.firebasestorage.app",
  messagingSenderId: "231433018244",
  appId: "1:231433018244:web:682ea51aea88d00d8fdbd1",
  measurementId: "G-8BQ1YFP326"
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
