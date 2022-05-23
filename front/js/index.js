async function getProducts() {
    let host = "http://localhost:3000";
    let response = await fetch(host + "/api/products");
    let productsListJson = await response.json();
    return productsListJson;
}

function displayProductsList(productsListJson) {
    let container = document.getElementById("items");
    for (let product of productsListJson) {
        container.innerHTML += `<a href="./product.html?id=${product._id}">
                                    <article>
                                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                                    <h3 class="productName">${product.name}</h3>
                                    <p class="productDescription">${product.description}</p>
                                    </article>
                                </a>`;
    }
}

async function displayProducts() {
    let productsListJson = await getProducts();
    displayProductsList(productsListJson);
}

displayProducts();