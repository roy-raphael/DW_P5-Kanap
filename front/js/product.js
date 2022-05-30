import {getProduct} from './productManager.js';
import {CartItem, CartManager, initCartProductsNumberIndicator, updateCartProductsNumberIndicator} from './cartManager.js';

function getID() {
    let url = new URL(window.location.href);
    let search_params = new URLSearchParams(url.search);
    if (search_params.has('id')) {
        return search_params.get("id");
    } else {
        // LOG ERROR
        return "";
    }
}

function displayProduct(productJson) {
    // Image
    let imageItem = document.createElement("img");
    imageItem.setAttribute("src", productJson.imageUrl);
    imageItem.setAttribute("alt", productJson.altTxt);
    document.getElementsByClassName("item__img")[0].appendChild(imageItem);
    // Contenu
    document.getElementById("title").textContent = productJson.name;
    document.getElementById("price").textContent = (productJson.price/100).toLocaleString();
    // Description
    document.getElementById("description").textContent = productJson.description;
    // Options
    let colorsSelection = document.getElementById("colors");
    for (let color of productJson.colors) {
        let colorOption = document.createElement("option");
        colorOption.setAttribute("value", color);
        colorOption.textContent = color;
        colorsSelection.appendChild(colorOption);
    }
}

function listenAddToCartButton(id) {
    document.getElementById("addToCart").addEventListener('click', function(event) {
        event.preventDefault();
        let colors = document.getElementById("colors");
        let quantity = document.getElementById("quantity");
        let valid = colors.reportValidity();
        valid &= quantity.reportValidity();
        if (valid) {
            // Add the product(s) to the cart
            let cart = new CartManager();
            let cartItem = new CartItem(id, colors.value, quantity.value);
            cart.add(cartItem);
            // Update the indicator
            updateCartProductsNumberIndicator(cart.cartArticlesNumber);
            // Message to the user
            let multipleProducts = quantity.value > 1;
            alert((multipleProducts ? "Les articles ont" : "L'article a") + " bien été ajouté" + (multipleProducts ? "s" : "") + " au panier.");
        }
    });
}

async function main() {
    initCartProductsNumberIndicator();
    let id = getID();
    if (id == "") {
        // LOG ERROR
        return;
    }
    let productJson = await getProduct(id);
    displayProduct(productJson);
    listenAddToCartButton(id);
}

main();