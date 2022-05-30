import {initCartProductsNumberIndicator} from './cartManager.js';

async function getProducts() {
    let host = "http://localhost:3000";
    let response = await fetch(host + "/api/products");
    let productsListJson = response.json();
    return productsListJson;
}

function displayProductsList(productsListJson) {
    let container = document.getElementById("items");
    for (let product of productsListJson) {
        container.innerHTML += `<a href="./product.html?id=${product._id}">
                                    <article>
                                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                                    <h3 class="productName">${product.name}</h3>
                                    <p class="productPrice">${(product.price/100).toLocaleString()}€</p>
                                    <p class="productDescription">${product.description}</p>
                                    </article>
                                </a>`;
    }
    for (let productPriceItem of container.getElementsByClassName("productPrice"))
    {
        productPriceItem.style.margin = 0;
        productPriceItem.style.fontWeight = 600;
    }
}

async function displayProducts() {
    let productsListJson = await getProducts();
    displayProductsList(productsListJson);
}

initCartProductsNumberIndicator();
displayProducts();