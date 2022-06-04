import {initCartProductsNumberIndicator} from './cartManager.js';

// Retrieve the order id (using the URL)
function getOrderID() {
    let url = new URL(window.location.href);
    let search_params = new URLSearchParams(url.search);
    if (search_params.has('orderId')) {
        return search_params.get("orderId");
    } else {
        console.error("URL does not have an orderId parameter");
        return "";
    }
}

// Global function (the one launched)
function main() {
    initCartProductsNumberIndicator();
    document.getElementById("orderId").textContent = getOrderID();
}

main();