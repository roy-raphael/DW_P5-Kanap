async function getProduct() {
    let host = "http://localhost:3000";
    let url = new URL(window.location.href);
    let search_params = new URLSearchParams(url.search);
    if (search_params.has('id')) {
        let response = await fetch(host + "/api/products/" + search_params.get("id"));
        let productJson = await response.json();
        console.log(productJson);
        return productJson;
    } else {
        // LOG ERROR
        return {};
    }
}

async function displayProduct() {
    let productJson = await getProduct();
    // TODO
}

displayProduct();