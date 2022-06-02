import {initCartProductsNumberIndicator} from './cartManager.js';

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

function main() {
    initCartProductsNumberIndicator();
    document.getElementById("orderId").textContent = getOrderID();
}

main();