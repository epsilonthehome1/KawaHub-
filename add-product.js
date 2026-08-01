import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const productForm = document.getElementById("productForm");

let currentUser = null;

onAuthStateChanged(auth, (user) => {

    if (!user) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

});

productForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        await addDoc(collection(db, "products"), {

            ownerId: currentUser.uid,

            productName: document.getElementById("productName").value,

            price: Number(document.getElementById("price").value),

            category: document.getElementById("category").value,

            description: document.getElementById("description").value,

            image: "",

            createdAt: serverTimestamp()

        });

        alert("🎉 Product posted successfully!");

        productForm.reset();

    } catch (error) {

        console.error(error);

        alert(error.code + "\n" + error.message);

    }

});
