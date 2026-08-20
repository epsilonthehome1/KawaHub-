import { auth, db, storage } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";


const productsContainer =
  document.getElementById("productsContainer");

const searchInput =
  document.getElementById("searchInput");

const searchButton =
  document.getElementById("searchButton");

const sellProductButton =
  document.getElementById("sellProductButton");

const productFormSection =
  document.getElementById("productFormSection");

const marketplaceProductForm =
  document.getElementById("marketplaceProductForm");

const cancelProductButton =
  document.getElementById("cancelProductButton");

const marketProductImage =
  document.getElementById("marketProductImage");


let allProducts = [];

let currentUser = null;


// ==========================================
// AUTHENTICATION
// ==========================================

onAuthStateChanged(auth, (user) => {

  currentUser = user;

});


// ==========================================
// SELL PRODUCT BUTTON
// ==========================================

sellProductButton.addEventListener("click", () => {

  if (!currentUser) {

    alert("🔐 Please login to sell a product.");

    window.location.href = "login.html";

    return;
  }

  productFormSection.style.display = "block";

  productFormSection.scrollIntoView({
    behavior: "smooth"
  });

});


// ==========================================
// CANCEL PRODUCT FORM
// ==========================================

cancelProductButton.addEventListener("click", () => {

  productFormSection.style.display = "none";

  marketplaceProductForm.reset();

});


// ==========================================
// POST PRODUCT
// ==========================================

marketplaceProductForm.addEventListener("submit", async (e) => {

  e.preventDefault();


  if (!currentUser) {

    alert("🔐 Please login before posting a product.");

    window.location.href = "login.html";

    return;

  }


  const productName =
    document.getElementById("marketProductName").value.trim();

  const price =
    Number(document.getElementById("marketProductPrice").value);

  const category =
    document.getElementById("marketProductCategory").value;

  const description =
    document.getElementById("marketProductDescription").value.trim();

  const imageFile =
    marketProductImage.files[0];


  if (!productName || !price || !category || !description) {

    alert("⚠️ Please complete all required fields.");

    return;

  }


  try {

    // Disable button while uploading

    const submitButton =
      marketplaceProductForm.querySelector("button[type='submit']");

    submitButton.disabled = true;

    submitButton.textContent = "⏳ Posting...";


    // ======================================
    // UPLOAD IMAGE
    // ======================================

    let imageURL = "";


    if (imageFile) {

      const imagePath =
        `products/${currentUser.uid}/${Date.now()}-${imageFile.name}`;

      const imageRef =
        ref(storage, imagePath);


      await uploadBytes(imageRef, imageFile);


      imageURL =
        await getDownloadURL(imageRef);

    }


    // ======================================
    // SAVE PRODUCT TO FIRESTORE
    // ======================================

    await addDoc(collection(db, "products"), {

      ownerId: currentUser.uid,

      sellerEmail: currentUser.email,

      productName: productName,

      price: price,

      category: category,

      description: description,

      image: imageURL,

      createdAt: serverTimestamp()

    });


    alert("🎉 Product posted successfully!");


    // Reset form

    marketplaceProductForm.reset();

    productFormSection.style.display = "none";


    // Reload marketplace

    await loadProducts();


  } catch (error) {

    console.error("Product upload error:", error);

    alert(
      "❌ Product could not be posted.\n\n" +
      error.code +
      "\n\n" +
      error.message
    );


  } finally {

    const submitButton =
      marketplaceProductForm.querySelector("button[type='submit']");

    submitButton.disabled = false;

    submitButton.textContent = "🚀 Post Product";

  }

});


// ==========================================
// LOAD PRODUCTS
// ==========================================

async function loadProducts() {

  try {

    const productsQuery = query(
      collection(db, "products"),
      orderBy("createdAt", "desc")
    );


    const querySnapshot =
      await getDocs(productsQuery);


    allProducts = [];


    querySnapshot.forEach((doc) => {

      allProducts.push({

        id: doc.id,

        ...doc.data()

      });

    });


    displayProducts(allProducts);


  } catch (error) {

    console.error(error);


    productsContainer.innerHTML = `

      <p class="error-message">

        ❌ Unable to load products.

      </p>

    `;

  }

}


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts(products) {

  productsContainer.innerHTML = "";


  if (products.length === 0) {

    productsContainer.innerHTML = `

      <p class="empty-message">

        🔍 No products found.

      </p>

    `;

    return;

  }


  products.forEach((product) => {

    const productCard =
      document.createElement("div");


    productCard.className =
      "product-card";


    productCard.innerHTML = `

      <div class="product-image">

        ${
          product.image

            ? `<img
                src="${product.image}"
                alt="${product.productName}">
              `

            : `<span>📦</span>`
        }

      </div>


      <div class="product-info">

        <h2>
          ${product.productName}
        </h2>


        <p class="product-price">

          MK ${Number(product.price).toLocaleString()}

        </p>


        <p class="product-category">

          🏷️ ${product.category}

        </p>


        <p class="product-description">

          ${product.description}

        </p>

      </div>

    `;


    productsContainer.appendChild(productCard);

  });

}


// ==========================================
// SEARCH PRODUCTS
// ==========================================

function searchProducts() {

  const searchTerm =
    searchInput.value.trim().toLowerCase();


  if (searchTerm === "") {

    displayProducts(allProducts);

    return;

  }


  const filteredProducts =
    allProducts.filter((product) => {


      const productName =
        product.productName?.toLowerCase() || "";


      const category =
        product.category?.toLowerCase() || "";


      const description =
        product.description?.toLowerCase() || "";


      return (

        productName.includes(searchTerm) ||

        category.includes(searchTerm) ||

        description.includes(searchTerm)

      );

    });


  displayProducts(filteredProducts);

}


// ==========================================
// SEARCH BUTTON
// ==========================================

searchButton.addEventListener(
  "click",
  searchProducts
);


// ==========================================
// ENTER KEY SEARCH
// ==========================================

searchInput.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Enter") {

      searchProducts();

    }

  }
);


// ==========================================
// START MARKETPLACE
// ==========================================

loadProducts();
