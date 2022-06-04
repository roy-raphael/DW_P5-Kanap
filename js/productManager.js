import {Config} from './config.js';

// Retrieve the data of a product using the API
export async function getProduct(id) {
    let config = await Config.getInstance();
    let productJson = {};
    if (id != "") {
        let apiAdress = config.getHost() + "/api/products/" + id;
        try {
            let response = await fetch(apiAdress);
            productJson = response.json();
        } catch (error) {
            alert("Erreur : échec de la requête d'API sur " + apiAdress + " (le serveur est peut-être hors-ligne)");
            throw error;
        }
    } else {
        console.error("productManager:getProduct(id) : the id parameter is empty");
    }
    return productJson;
}