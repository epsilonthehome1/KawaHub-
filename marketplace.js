import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const productsContainer = document.getElementById("productsContainer");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

let allProducts = [];

// Load products from Firestore
async function loadProducts() {

  try {

    const productsQuery = query(
      collection(db, "products"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(productsQuery);

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


// Display products
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

    const productCard = document.createElement("div");

    productCard.className = "product-card";

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

        <h2>${product.productName}</h2>

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


// Search products
function searchProducts() {

  const searchTerm = searchInput.value
    .trim()
    .toLowerCase();

  if (searchTerm === "") {

    displayProducts(allProducts);

    return;

  }

  const filteredProducts = allProducts.filter((product) => {

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


// Search button
searchButton.addEventListener("click", searchProducts);


// Search using Enter key
searchInput.addEventListener("keydown", (event) => {

  if (event.key === "Enter") {

    searchProducts();

  }

});


// Start
loadProducts();
