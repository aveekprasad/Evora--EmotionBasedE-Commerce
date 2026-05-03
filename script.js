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
   FETCH + DISPLAY PRODUCTS
========================= */
async function displayProducts(emotion) {
    try {
        console.log("Fetching:", emotion);

        const response = await fetch(`http://127.0.0.1:5000/products?emotion=${emotion}`);

        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();

        cachedProducts = data;

        renderProducts(data);

    } catch (error) {
        console.error("ERROR:", error);
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
   THEME FUNCTION
========================= */
function setTheme(emotion) {
    const root = document.documentElement;
    const body = document.body;

    if (emotion === "happy") {
        root.style.setProperty("--accent-color", "#f59f00");
        root.style.setProperty("--card-bg", "rgba(255, 243, 191, 0.9)");
        root.style.setProperty("--text-color", "#5c3d00");
        body.style.backgroundImage = "url('images/happy-bg.png')";
    }

    if (emotion === "sad") {
        root.style.setProperty("--accent-color", "#1c7ed6");
        root.style.setProperty("--card-bg", "rgba(219, 228, 255, 0.9)");
        root.style.setProperty("--text-color", "#1c3d5a");
        body.style.backgroundImage = "url('images/sad-bg.png')";
    }

    if (emotion === "angry") {
        root.style.setProperty("--accent-color", "#e03131");
        root.style.setProperty("--card-bg", "rgba(255, 201, 201, 0.9)");
        root.style.setProperty("--text-color", "#5a1c1c");
        body.style.backgroundImage = "url('images/angry-bg.png')";
    }

    if (emotion === "relaxed") {
        root.style.setProperty("--accent-color", "#099268");
        root.style.setProperty("--card-bg", "rgba(195, 250, 232, 0.9)");
        root.style.setProperty("--text-color", "#1b4332");
        body.style.backgroundImage = "url('images/relaxed-bg.png')";
    }
}

/* =========================
   RESET THEME
========================= */
function resetTheme() {
    const root = document.documentElement;
    const body = document.body;

    root.style.setProperty("--accent-color", "#000");
    root.style.setProperty("--card-bg", "rgba(255,255,255,0.15)");
    root.style.setProperty("--text-color", "#ffffff");

    body.style.backgroundImage = "url('images/homepage-bg.png')";
}

});