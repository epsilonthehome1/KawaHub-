import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const profileForm = document.getElementById("profileForm");

onAuthStateChanged(auth, async (user) => {

  if (!user) {

    window.location.href = "login.html";
    return;

  }

  const userRef = doc(db, "users", user.uid);

  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {

    const data = userSnap.data();

    document.getElementById("businessName").value = data.businessName || "";

    document.getElementById("country").value = data.country || "";

    document.getElementById("bio").value = data.bio || "";

  }

  profileForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    await updateDoc(userRef, {

      businessName: document.getElementById("businessName").value,

      country: document.getElementById("country").value,

      bio: document.getElementById("bio").value

    });

    alert("✅ Profile updated successfully!");

  });

});
