document.addEventListener("DOMContentLoaded", () => {
  const productContainer = document.getElementById("product-container");
  const sortSelect = document.getElementById("sort-select");
  const categorySelect = document.getElementById("category-select");
  let products = [];
  let filteredProducts = [];

  const getLowestPrice = (product) => {
    const prices = product.prices
      .map((p) => {
        const priceString = p.price[0].replace(",", ".");
        return parseFloat(priceString);
      })
      .filter((p) => !isNaN(p));

    return prices.length > 0 ? Math.min(...prices) : null;
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      let allProducts = await response.json();

      // Filtrar productos sin precio
      products = allProducts.filter(
        (product) => getLowestPrice(product) !== null
      );

      if (products.length === 0) {
        productContainer.innerHTML = "<p>No hay productos disponibles.</p>";
      } else {
        filteredProducts = [...products];
        renderProducts(filteredProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      productContainer.innerHTML =
        "<p>Error al cargar los productos. Por favor, intenta más tarde.</p>";
    }
  };

  const renderProducts = (productsToRender) => {
    if (productsToRender.length === 0) {
      productContainer.innerHTML = "<p>No hay productos disponibles.</p>";
      return;
    }

    productContainer.innerHTML = "";
    productsToRender.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";

      const lowestPrice = getLowestPrice(product);

      const imageLink = document.createElement("a");
      imageLink.href = product.url;
      imageLink.target = "_blank";
      imageLink.rel = "noopener noreferrer";

      const productImage = document.createElement("img");
      productImage.src = product.mediaUrls[0];
      productImage.alt = product.displayName;
      productImage.className = "product-image";
      imageLink.appendChild(productImage);

      productCard.innerHTML = `
            <h2 class="product-title">${product.displayName}</h2>
            <p class="product-price">S/ ${lowestPrice}</p>
            <p>${product.brand}</p>
            ${
              product.discountBadge
                ? `<span class="discount-badge">${product.discountBadge.label}</span>`
                : ""
            }
        `;

      productCard.insertBefore(imageLink, productCard.firstChild);

      productContainer.appendChild(productCard);
    });
  };

  const sortProducts = (sortType) => {
    let sortedProducts = [...filteredProducts];
    switch (sortType) {
      case "price-asc":
        sortedProducts.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
        break;
      default:
        break;
    }
    renderProducts(sortedProducts);
  };

  const filterProducts = (category) => {
    if (category === "all") {
      filteredProducts = [...products];
    } else {
      filteredProducts = products.filter(
        (product) => product.category === category
      );
    }
    sortProducts(sortSelect.value);
  };

  sortSelect.addEventListener("change", (event) => {
    sortProducts(event.target.value);
  });

  categorySelect.addEventListener("change", (event) => {
    filterProducts(event.target.value);
  });

  fetchProducts();
});
