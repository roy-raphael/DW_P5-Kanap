export class CartItem {
    constructor (id, color, quantity) {
        this.id = id;
        this.color = color;
        this.quantity = Number(quantity);
    }
}

export class CartManager {
    // Attributes
    #cartItemsList = [];
    #cartArticlesNumber = 0;
    #ProductsUnitaryPrices = new Map();
    #ProductsTotalPrices = new Map();
    static #instance = null;

    // Static method : returns the only instance of this class (and create it if it does not exist)
    static getInstance() {
        if (CartManager.#instance === null) {
            CartManager.#instance = new CartManager();
        }
        return CartManager.#instance;
    }

    // Static method : retrieves the cart list from the local storage
    static getCart() {
        let cart = localStorage.getItem("cartItemsList");
        if (cart == null) {
            return [];
        } else {
            return JSON.parse(cart);
        }
    }

    // Constructor of the class
    constructor () {
        let jsonCartItemsList = CartManager.getCart();
        jsonCartItemsList && Object.assign(this.#cartItemsList, jsonCartItemsList);
        for (let cartItem of this.#cartItemsList) {
            this.#cartArticlesNumber += cartItem.quantity;
        }
    }

    // Getter/Setter : gets the size of the list of items in the cart
    cartItemsListSize() {
        return this.#cartItemsList.length;
    }

    // Getter/Setter : gets an item of the cart (using and index)
    getCartItem(i) {
        return Object.assign({}, this.#cartItemsList[i]);
    }

    // Getter/Setter : gets the number of articles in the cart
    getCartArticlesNumber() {
        return this.#cartArticlesNumber;
    }

    // Getter/Setter : gets the unitary price of a product
    // (using a list if already retrieved, else retrieve it using the API)
    async getProductUnitaryPrice(id) {
        if (this.#ProductsUnitaryPrices.has(id))
        {
            return this.#ProductsUnitaryPrices.get(id);
        } else {
            let unitaryPrice = 0;
            let productJson = {};
            let {getProduct} = await import('./productManager.js');
            try {
                productJson = await getProduct(id);
            } catch (error) {
                console.error("cartManager:getProductUnitaryPrice() : API request failure (maybe the backend is down)");
            }
            if (Object.keys(productJson).length !== 0) {
                this.#ProductsUnitaryPrices.set(id, productJson.price);
                unitaryPrice = productJson.price;
            }
            return unitaryPrice;
        }
    }

    // Getter/Setter : sets the unitary price of a product (store it in a list)
    setProductUnitaryPrice(id, price) {
        this.#ProductsUnitaryPrices.set(id, price);
    }

    // Getter/Setter : sets the subtotal price of products (a product * its quantity)
    setProductTotalPrice(id, totalPrice) {
        this.#ProductsTotalPrices.set(id, totalPrice);
    }

    // Getter/Setter : gets the total price of the cart
    getTotalPrice() {
        let totalPrice = 0;
        for (let subtotalPrice of this.#ProductsTotalPrices.values()) {
            totalPrice += subtotalPrice;
        }
        return totalPrice;
    }

    // End any modification of the cart : update the number of articles and save the cart (local storage)
    endCartModification(quantityDifference) {
        this.#cartArticlesNumber += quantityDifference;
        localStorage.setItem("cartItemsList", JSON.stringify(this.#cartItemsList));
    }

    // Add a product in the cart
    add(product) {
        let productAdded = false;
        for (let cartItem of this.#cartItemsList) {
            if (cartItem.id === product.id && cartItem.color === product.color) {
                cartItem.quantity += product.quantity;
                productAdded = true;
                break;
            }
        }
        if (! productAdded) {
            this.#cartItemsList.push(product);
        }
        this.endCartModification(product.quantity);
    }

    // Change the quantity of a product in the cart
    changeQuantity(product, newQuantity) {
        let originalQuantity = product.quantity;
        if (newQuantity === 0) {
            this.delete(product, originalQuantity);
        } else if (newQuantity !== originalQuantity) {
            for (let cartItem of this.#cartItemsList) {
                if (cartItem.id === product.id && cartItem.color === product.color) {
                    cartItem.quantity = newQuantity;
                    this.endCartModification(newQuantity - originalQuantity);
                    return;
                }
            }
        }
    }

    // Delete the product from the cart
    delete(product) {
        this.#cartItemsList = this.#cartItemsList.filter(item => item.id !== product.id || item.color !== product.color);
        this.endCartModification(-product.quantity);
    }
}

// Update the indicator for number of articles in the cart (in the nav bar)
export function updateCartProductsNumberIndicator(productsNumber) {
    let navBar = document.getElementsByTagName("nav")[0];
    let cartElement = navBar.children[0].children[1].children[0];
    cartElement.textContent = "Panier (" + productsNumber + ")";
}

// Initialize the indicator for number of articles in the cart (in the nav bar)
export function initCartProductsNumberIndicator() {
    updateCartProductsNumberIndicator(CartManager.getInstance().getCartArticlesNumber());
}