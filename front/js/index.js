import {Config} from './config.js';
import {initCartProductsNumberIndicator} from './cartManager.js';

// Retrieve the list of products (and their data) using the API
async function getProducts() {
    let productsListJson = [];
    let config = await Config.getInstance();
    let apiAdress = config.getHost() + "/api/products";
    try {
        let response = await fetch(apiAdress);
        productsListJson = response.json();
    } catch (error) {
        alert("Erreur : échec de la requête d'API sur " + apiAdress + " (le serveur est peut-être hors-ligne)");
    }
    return productsListJson;
}

// Display the list of the products on the page (add an article per product)
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

// Global function (the one launched)
async function main() {
    initCartProductsNumberIndicator();
    let productsListJson = await getProducts();
    displayProductsList(productsListJson);
}

main();