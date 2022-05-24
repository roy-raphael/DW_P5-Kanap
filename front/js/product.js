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
    // Image
    let imageItem = document.createElement("img");
    imageItem.setAttribute("src", productJson.imageUrl);
    imageItem.setAttribute("alt", productJson.altTxt);
    document.getElementsByClassName("item__img")[0].appendChild(imageItem);
    // Contenu
    document.getElementById("title").textContent = productJson.name;
    document.getElementById("price").textContent = (productJson.price/100).toLocaleString();
    // Description
    document.getElementById("description").textContent = productJson.description;
    // Options
    let colorsSelection = document.getElementById("colors");
    for (let color of productJson.colors) {
        let colorOption = document.createElement("option");
        colorOption.setAttribute("value", color);
        colorOption.textContent = color;
        colorsSelection.appendChild(colorOption);
    }
}

displayProduct();