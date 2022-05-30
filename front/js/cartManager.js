export class CartItem {
    constructor (id, color, quantity) {
        this.id = id;
        this.color = color;
        this.quantity = Number(quantity);
    }
}

export class CartManager {
    cartArticlesNumber = 0;
    cartItemsList = [];

    static getCart() {
        let cart = localStorage.getItem("cart");
        if (cart == null) {
            return [];
        } else {
            return JSON.parse(cart);
        }
    }

    constructor () {
        let jsonCart = CartManager.getCart();
        jsonCart && Object.assign(this, jsonCart);
    }

    saveCart() {
        localStorage.setItem("cart", JSON.stringify(this));
    }

    add(product) {
        let productAdded = false;
        for (let cartItem of this.cartItemsList) {
            if (cartItem.id === product.id && cartItem.color === product.color) {
                cartItem.quantity += product.quantity;
                productAdded = true;
                break;
            }
        }
        if (! productAdded) {
            this.cartItemsList.push(product);
        }
        this.cartArticlesNumber += product.quantity;
        this.saveCart();
    }
}

export function initCartProductsNumberIndicator() {
    let cart = new CartManager();
    updateCartProductsNumberIndicator(cart.cartArticlesNumber);
}

export function updateCartProductsNumberIndicator(productsNumber) {
    let navBar = document.getElementsByTagName("nav")[0];
    let cartElement = navBar.children[0].children[1].children[0];
    cartElement.textContent = "Panier (" + productsNumber + ")";
}