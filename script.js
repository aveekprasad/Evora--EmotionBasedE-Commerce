document.addEventListener("DOMContentLoaded", () => {

let currentEmotion = "";
let cachedProducts = [];

const buttons = document.querySelectorAll("#emotions button");
const productDiv = document.getElementById("products");
const searchInput = document.getElementById("search");

/* =========================
   EMOTION BUTTONS
========================= */
buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
        const emotions = ["happy", "sad", "angry", "relaxed"];
        currentEmotion = emotions[index];

        setTheme(currentEmotion);
        displayProducts(currentEmotion);
    });
});

/* =========================
   NAVBAR BUTTONS
========================= */
document.getElementById("homeBtn").onclick = () => {
    currentEmotion = "";
    cachedProducts = [];
    resetTheme();
    searchInput.value = "";
    productDiv.innerHTML = "<p>Select an emotion to explore products 💖</p>";
};

["happy", "sad", "angry", "relaxed"].forEach(emotion => {
    document.getElementById(emotion + "Btn").onclick = () => {
        currentEmotion = emotion;
        setTheme(emotion);
        displayProducts(emotion);
    };
});

/* =========================
   FETCH PRODUCTS
========================= */
async function displayProducts(emotion) {
    try {
        productDiv.innerHTML = "<p>Loading...</p>";

        const res = await fetch(`http://127.0.0.1:5000/products?emotion=${emotion}`);

        if (!res.ok) throw new Error("Server error");

        const data = await res.json();

        // ✅ Remove duplicates (important)
        const unique = [];
        const seen = new Set();

        data.forEach(item => {
            const key = item.name + item.image;
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(item);
            }
        });

        cachedProducts = unique;
        renderProducts(unique);

    } catch (err) {
        console.error(err);
        productDiv.innerHTML = "<p>⚠️ Failed to load products</p>";
    }
}

/* =========================
   RENDER PRODUCTS
========================= */
function renderProducts(items, searchTerm = "") {
    productDiv.innerHTML = `<h2>${currentEmotion.toUpperCase()} Products</h2>`;

    const container = document.createElement("div");
    container.classList.add("product-container");

    items
        .filter(item => item.name.toLowerCase().includes(searchTerm))
        .forEach(item => {

            const card = document.createElement("div");
            card.classList.add("product-card");

            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>⭐ ${item.rating}</p>
                <p><strong>${item.price}</strong></p>
                <button>Buy Now</button>
            `;

            container.appendChild(card);
        });

    productDiv.appendChild(container);
}

/* =========================
   SEARCH
========================= */
searchInput.addEventListener("input", () => {
    if (currentEmotion) {
        renderProducts(cachedProducts, searchInput.value.toLowerCase());
    }
});

/* =========================
   THEME
========================= */
function setTheme(emotion) {
    const root = document.documentElement;
    const body = document.body;

    const themes = {
        happy: ["#f59f00", "rgba(255,243,191,0.9)", "#5c3d00", "images/happy-bg.png"],
        sad: ["#1c7ed6", "rgba(219,228,255,0.9)", "#1c3d5a", "images/sad-bg.png"],
        angry: ["#e03131", "rgba(255,201,201,0.9)", "#5a1c1c", "images/angry-bg.png"],
        relaxed: ["#099268", "rgba(195,250,232,0.9)", "#1b4332", "images/relaxed-bg.png"]
    };

    const [accent, card, text, bg] = themes[emotion];

    root.style.setProperty("--accent-color", accent);
    root.style.setProperty("--card-bg", card);
    root.style.setProperty("--text-color", text);
    body.style.backgroundImage = `url('${bg}')`;
}

function resetTheme() {
    const root = document.documentElement;
    const body = document.body;

    root.style.setProperty("--accent-color", "#000");
    root.style.setProperty("--card-bg", "rgba(255,255,255,0.15)");
    root.style.setProperty("--text-color", "#fff");

    body.style.backgroundImage = "url('images/homepage-bg.png')";
}

/* =========================
   TOGGLE FORM
========================= */
document.getElementById("toggleFormBtn").onclick = () => {
    const form = document.getElementById("addProductForm");
    form.style.display = form.style.display === "none" ? "block" : "none";
};

/* =========================
   ADD PRODUCT
========================= */
const addBtn = document.getElementById("addProductBtn");

addBtn.addEventListener("click", async () => {

    const product = {
        name: document.getElementById("pName").value.trim(),
        price: document.getElementById("pPrice").value.trim(),
        image: document.getElementById("pImage").value.trim(),
        rating: document.getElementById("pRating").value.trim(),
        emotion: document.getElementById("pEmotion").value
    };

    if (!product.name || !product.price || !product.image) {
        alert("Fill all fields ❌");
        return;
    }

    addBtn.disabled = true;

    try {
        const res = await fetch("http://127.0.0.1:5000/add-product", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(product)
        });

        const data = await res.json();
        alert(data.message);

        // reset
        document.getElementById("addProductForm").reset?.();

        if (currentEmotion === product.emotion) {
            displayProducts(product.emotion);
        }

    } catch (err) {
        console.error(err);
        alert("Failed ❌");
    }

    addBtn.disabled = false;
});

});