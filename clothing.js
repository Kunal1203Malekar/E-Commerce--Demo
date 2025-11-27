// clothing.js
console.clear();

/*
  Self-contained demo data + reliable placeholder images.
  Save clothing.html, clothing.js, style.css in the same folder and open clothing.html.
*/

const clothingData = [
  {
    id: 1,
    name: "Men Navy Blue Shirt",
    brand: "Roadster",
    price: 799,
    preview: "img/Blue Tshirt.jpg"
  },
  {
    id: 2,
    name: "Women Red Printed Dress",
    brand: "Zara",
    price: 1299,
    preview: "img/Women Red Printed Dress.jpg"
  },
  {
    id: 3,
    name: "Men Casual White Shirt",
    brand: "Highlander",
    price: 599,
    preview:"img/Men Casual White Shirt.jpg"
  },
  {
    id: 4,
    name: "Women Blue Denim Jacket",
    brand: "H&M",
    price: 1499,
    preview: "img/Women Blue Denim Jacket.jpg"
  },
  {
    id: 5,
    name: "Men Green Hoodie",
    brand: "Nike",
    price: 1999,
    preview: "img/Nike Green.jpeg"
  },
  {
    id: 6,
    name: "Women Floral Top",
    brand: "Mango",
    price: 899,
    preview: "img/Women Floral Top.jpg"
  }
];

const container = document.getElementById("clothingContainer");
const searchInput = document.getElementById("searchInput");

// Create a product card element and return it
function createCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  // use a relative product details link - create productDetails.html later if you want
  card.innerHTML = `
    <a href="productDetails.html?${product.id}" class="card-link" title="${product.name}">
      <div class="thumb">
        <img src="${product.preview}" alt="${product.name}" onerror="this.src='https://picsum.photos/seed/${product.id}/600/400'"/>
      </div>
      <div class="info">
        <h3 class="pname">${product.name}</h3>
        <p class="pbrand">${product.brand}</p>
        <h4 class="price">Rs ${product.price}</h4>
      </div>
    </a>
  `;
  return card;
}

// Render list (optionally filtered)
function renderList(list) {
  container.innerHTML = "";
  if (!list || list.length === 0) {
    container.innerHTML = "<p class='empty'>No products found.</p>";
    return;
  }
  list.forEach(p => container.appendChild(createCard(p)));
}

// Show cart badge from cookie (works if cookie "counter=number" exists)
function updateBadgeFromCookie() {
  const cookies = document.cookie.split(";").map(s => s.trim());
  for (const c of cookies) {
    if (c.startsWith("counter=")) {
      const val = c.split("=")[1];
      document.getElementById("badge").innerText = Number(val) || 0;
      return;
    }
  }
  // if not found, 0
  document.getElementById("badge").innerText = "0";
}

// Search feature (simple name/brand search)
searchInput.addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  if (!q) {
    renderList(clothingData);
    return;
  }
  const filtered = clothingData.filter(item =>
    item.name.toLowerCase().includes(q) ||
    item.brand.toLowerCase().includes(q)
  );
  renderList(filtered);
});

// init
updateBadgeFromCookie();
renderList(clothingData);
