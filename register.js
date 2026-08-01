import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("❌ Passwords do not match.");
    return;
  }

  try {

    // Create Authentication account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    console.log("Authentication successful!");

    // Save user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      firstName: firstName,
      lastName: lastName,
      email: email,
      country: "Malawi",
      businessName: "",
      bio: "",
      profileImage: "",
      joinedAt: new Date().toISOString()
    });

    console.log("Profile saved to Firestore!");

    alert("🎉 Account created successfully!");

    window.location.href = "dashboard.html";

  } catch (error) {

    console.error(error);

    alert(
      "Registration failed.\n\n" +
      "Error Code: " + error.code +
      "\n\n" +
      error.message
    );

  }

});
