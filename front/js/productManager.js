export async function getProduct(id) {
    let host = "http://localhost:3000";
    if (id != "") {
        let response = await fetch(host + "/api/products/" + id);
        let productJson = response.json();
        return productJson;
    } else {
        // LOG ERROR
        return {};
    }
}