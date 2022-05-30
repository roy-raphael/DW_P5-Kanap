import {getProduct} from './productManager.js';
import {CartManager, updateCartProductsNumberIndicator} from './cartManager.js';

// Afficher un tableau récapitulatif des achats dans la page Panier

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
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartItem.quantity}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                </div>
                                </div>
                            </div>
                            </article>`;
}

async function displayCart(cart) {
    for (let cartItem of cart.cartItemsList) {
        let productJson = await getProduct(cartItem.id);
        displayCartItem(cartItem, productJson);
    }
}

async function main() {
    let cart = new CartManager();
    updateCartProductsNumberIndicator(cart.cartArticlesNumber);
    displayCart(cart);
}

main();



// Gérer la modification et la suppression de produits dans la page Panier
// Concernant la modification, il va falloir recourir à l'événement de modification
// (addEventListener de type change) pour observer le changement de la quantité.
// Aussi, la méthode Element.closest() devrait permettre de cibler le produit que vous souhaitez
// supprimer (où dont vous souhaitez modifier la quantité) grâce à son identifiant et sa couleur.