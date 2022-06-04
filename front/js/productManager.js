import {Config} from './config.js';

// Retrieve the data of a product using the API
export async function getProduct(id) {
    let config = await Config.getInstance();
    if (id != "") {
        let response = await fetch(config.getHost() + "/api/products/" + id);
        let productJson = response.json();
        return productJson;
    } else {
        console.error("productManager:getProduct(id) : the id parameter is empty");
        return {};
    }
}