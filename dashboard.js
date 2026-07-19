import { auth } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Check if user is logged in
onAuthStateChanged(auth, (user) => {

    if (!user) {

        // User is not logged in
        window.location.href = "login.html";

    } else {

        // Show user's email
        const userEmail = document.getElementById("userEmail");

        if (userEmail) {
            userEmail.textContent = user.email;
        }

    }

});

// Logout button
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        await signOut(auth);

        window.location.href = "login.html";

    });

}
