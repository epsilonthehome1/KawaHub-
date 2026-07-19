// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNV8k3tkgP0m0jAwct5Nk03uBCrM_RSkQ",
  authDomain: "kawahub.firebaseapp.com",
  projectId: "kawahub",
  storageBucket: "kawahub.firebasestorage.app",
  messagingSenderId: "231433018244",
  appId: "1:231433018244:web:682ea51aea88d00d8fdbd1",
  measurementId: "G-8BQ1YFP326"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
