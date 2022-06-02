// Retrieve the data of a product using the API
export async function getProduct(id) {
    let host = "http://localhost:3000";
    if (id != "") {
        let response = await fetch(host + "/api/products/" + id);
        let productJson = response.json();
        return productJson;
    } else {
        console.error("productManager:getProduct(id) : the id parameter is empty");
        return {};
    }
}