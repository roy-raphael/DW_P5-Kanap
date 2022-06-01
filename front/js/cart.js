import {getProduct} from './productManager.js';
import {CartItem, CartManager, updateCartProductsNumberIndicator} from './cartManager.js';

// Display one article (specific ID & color) on the Cart page
function displayCartItem(cartItem, productJson) {
    let container = document.getElementById("cart__items");
    container.innerHTML += `<article class="cart__item" data-id="${cartItem.id}" data-color="${cartItem.color}">
                            <div class="cart__item__img">
                                <img src="${productJson.imageUrl}" alt="${productJson.altTxt}">
                            </div>
                            <div class="cart__item__content">
                                <div class="cart__item__content__description">
                                <h2>${productJson.name}</h2>
                                <p>${cartItem.color}</p>
                                <p>${(productJson.price/100).toLocaleString()} €</p>
                                </div>
                                <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                    <p>Qté : </p>
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="0" max="100" value="${cartItem.quantity}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                </div>
                                </div>
                            </div>
                            </article>`;
}

// Display a summary array of articles in the cart, on the cart page
async function displayCart() {
    let cart = CartManager.getInstance();
    for (let i = 0; i < cart.cartItemsListSize(); i++) {
        let cartItem = cart.getCartItem(i);
        let productJson = await getProduct(cartItem.id);
        displayCartItem(cartItem, productJson);
        // Set unitary price and subtotal price (unitary price * quantity) of the article
        cart.setProductUnitaryPrice(cartItem.id, productJson.price);
        cart.setProductTotalPrice(cartItem.id + cartItem.color, productJson.price * cartItem.quantity);
    }
    // Display total price
    document.getElementById("totalPrice").textContent = (cart.getTotalPrice()/100).toLocaleString();
}

// Update the number of articles in the cart (in the nav bar & at the end of the summary)
function updateCartArticlesNumber(cartArticlesNumber) {
    updateCartProductsNumberIndicator(cartArticlesNumber);
    document.getElementById("totalQuantity").textContent = cartArticlesNumber;
}

// Update the total price of the cart (thanks to the new quantity of the updated article)
async function updateCartTotalPrice(id, color, newQuantity) {
    let cart = CartManager.getInstance();
    let productPrice = await cart.getProductUnitaryPrice(id);
    cart.setProductTotalPrice(id + color, productPrice * newQuantity);
    document.getElementById("totalPrice").textContent = (cart.getTotalPrice()/100).toLocaleString();
}

// Update the quantity of an article :
// - update the local storage
// - update the summary in the cart page
// - update the number of articles
// - update the total price of the cart
async function updateProductQuantity(cartItemElement, originalQuantity, newQuantity) {
    let cart = CartManager.getInstance();
    let originalProduct = new CartItem(cartItemElement.dataset.id, cartItemElement.dataset.color, originalQuantity);
    if (newQuantity === 0) {
        cart.delete(originalProduct);
        cartItemElement.parentElement.removeChild(cartItemElement);
    } else {
        cart.changeQuantity(originalProduct, newQuantity);
    }
    updateCartArticlesNumber(cart.getCartArticlesNumber());
    await updateCartTotalPrice(cartItemElement.dataset.id, cartItemElement.dataset.color, newQuantity);
}

// Add event listener on all "Delete" buttons
function listenDeleteButtons() {
    for (let deleteButtonElement of document.getElementsByClassName("deleteItem")) {
        deleteButtonElement.addEventListener('click', async function(event) {
            event.preventDefault();
            let cartItemElement = this.closest('article');
            let originalQuantity = cartItemElement.getElementsByClassName("itemQuantity")[0].getAttribute("value");
            
            await updateProductQuantity(cartItemElement, Number(originalQuantity), 0);
        });
    }
}

// Add event listener on all spinner inputs (for articles in the cart)
function listenSpinnerInputs() {
    for (let deleteButtonElement of document.getElementsByClassName("itemQuantity")) {
        deleteButtonElement.addEventListener('change', async function(event) {
            event.preventDefault();
            if (this.reportValidity()) {
                let cartItemElement = this.closest('article');
                let quantityElement = cartItemElement.getElementsByClassName("itemQuantity")[0];
                let originalQuantity = quantityElement.getAttribute("value");
                let newQuantity = event.target.value;
                quantityElement.setAttribute("value", newQuantity);
                
                await updateProductQuantity(cartItemElement, Number(originalQuantity), Number(newQuantity));
            }
        });
    }
}

// Order the cart
async function order(firstName, lastName, address, city, email) {
    // Objet contact : firstName, lastName, address, city et email
    let contact = {firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        email: email};

    // Tableau produits : array de strings product-ID
    let products = [];
    let cart = CartManager.getInstance();
    for (let i = 0; i < cart.cartItemsListSize(); i++) {
        let cartItem = cart.getCartItem(i);
        products.push(cartItem.id);
    }
    
    // POST /order <objet contact> <tableau produits>
    let host = "http://localhost:3000";
    let response = await fetch(host + "/api/products/order", {
        method: "POST",
        headers: {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        body: `{"contact": ${JSON.stringify(contact)},
    "products": ${JSON.stringify(products)}}`
    });
    // Returns <objet contact> <tableau produits> <orderId (string)>
    let responseJson = await response.json();
    // Redirect to confirmation page
    window.location.href = "./confirmation.html?orderId=" + responseJson.orderId;
}

// Add event listener on the order button
function listenOrderButton(id) {
    document.getElementById("order").addEventListener('click', async function(event) {
        event.preventDefault();
        let firstName = document.getElementById("firstName");
        let lastName = document.getElementById("lastName");
        let address = document.getElementById("address");
        let city = document.getElementById("city");
        let email = document.getElementById("email");
        let valid = true;
        let nameErrorMsg = "Veuillez modifier la valeur pour correspondre au format demandé : texte sans chiffres.";
        firstName.setCustomValidity("");
        if (! firstName.checkValidity()) {
            valid = false;
            firstName.setCustomValidity(nameErrorMsg);
        }
        lastName.setCustomValidity("");
        if (! lastName.checkValidity()) {
            valid = false;
            lastName.setCustomValidity(nameErrorMsg);
        }
        valid &= address.checkValidity();
        valid &= city.checkValidity();
        valid &= email.checkValidity();
        document.getElementById("firstNameErrorMsg").innerHTML = firstName.validationMessage;
        document.getElementById("lastNameErrorMsg").innerHTML = lastName.validationMessage;
        document.getElementById("addressErrorMsg").innerHTML = address.validationMessage;
        document.getElementById("cityErrorMsg").innerHTML = city.validationMessage;
        document.getElementById("emailErrorMsg").innerHTML = email.validationMessage;
        if (valid) {
            await order(firstName.value, lastName.value, address.value, city.value, email.value);
        }
    });
}

// Global function
async function main() {
    let cart = CartManager.getInstance();
    await displayCart();
    updateCartArticlesNumber(cart.getCartArticlesNumber());
    listenSpinnerInputs();
    listenDeleteButtons();
    listenOrderButton();
}

main();