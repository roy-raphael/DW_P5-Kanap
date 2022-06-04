import {getProduct} from './productManager.js';
import {CartItem, CartManager, initCartProductsNumberIndicator, updateCartProductsNumberIndicator} from './cartManager.js';

// Retrieve the id of the product to display (using the URL)
function getID() {
    let url = new URL(window.location.href);
    let search_params = new URLSearchParams(url.search);
    if (search_params.has('id')) {
        return search_params.get("id");
    } else {
        console.error("URL does not have an id parameter");
        return "";
    }
}

// Display the product on the page (fill some tag contents)
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

// Add an event listener to the button that adds the product to the cart
// (checks the inputs and add the product to the cart)
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
            updateCartProductsNumberIndicator(cart.getCartArticlesNumber());
            // Message to the user
            let multipleProducts = quantity.value > 1;
            alert((multipleProducts ? "Les articles ont" : "L'article a") + " bien été ajouté" + (multipleProducts ? "s" : "") + " au panier.");
        }
    });
}

// Global function (the one launched)
async function main() {
    initCartProductsNumberIndicator();
    let id = getID();
    if (id == "") {
        console.error("product:main() : the retrieved id is empty");
        return;
    }
    let productJson = {};
    try {
        productJson = await getProduct(id);
    } catch (error) {
        console.error("product:main() : API request failure (maybe the backend is down), so we stop here the display of the product");
        return;
    }
    displayProduct(productJson);
    listenAddToCartButton(id);
}

main();