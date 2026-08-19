import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const productsContainer = document.getElementById("productsContainer");

async function loadProducts() {

  try {

    const productsQuery = query(
      collection(db, "products"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(productsQuery);

    productsContainer.innerHTML = "";

    if (querySnapshot.empty) {

      productsContainer.innerHTML = `
        <p class="empty-message">
          🛍️ No products have been posted yet.
        </p>
      `;

      return;
    }

    querySnapshot.forEach((doc) => {

      const product = doc.data();

      const productCard = document.createElement("div");

      productCard.className = "product-card";

      productCard.innerHTML = `

        <div class="product-image">

          ${
            product.image
              ? `<img src="${product.image}" alt="${product.productName}">`
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

  } catch (error) {

    console.error(error);

    productsContainer.innerHTML = `
      <p class="error-message">
        ❌ Unable to load products.
      </p>
    `;

  }

}

loadProducts();
