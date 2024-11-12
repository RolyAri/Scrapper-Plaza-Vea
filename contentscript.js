// div.Showcase__content contenedor del producto
// Showcase__name nombre Showcase__SellerName distribuidor Showcase__salePrice precio
console.log('Ejecutando content script plaza vea V2.0')


function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

const port = chrome.runtime.connect({name: "background"})

chrome.runtime.onMessage.addListener(
    async function(request, sender, sendResponse){
        if(request.cmd == "scrap"){
            currentPage = 0;
            veaPages = document.querySelectorAll('.page-number');
            totalPages = veaPages[veaPages.length-1].innerText;

            let allProducts = []

            while (currentPage < totalPages) {
                const products = scrappingProducts();
                allProducts = allProducts.concat(products);
    
                // Envia los productos de la página actual al background
                port.postMessage({ cmd: "update-products", products, currentPage, totalPages });
    
                // Si no estamos en la última página, ir a la siguiente
                if (currentPage < totalPages) {
                    await goToNextPage(); // Cambiar de página
                    await delay(2000); // Espera para asegurar que la nueva página cargue
                }
                
                currentPage++; // Incrementa el contador de página
            }
            /* totalPages = veaPages[veaPages.length-1].innerText; */
            /* const products = scrappingProducts(); */
            /* port.postMessage({cmd: "finish-scrap", products, currentPage, totalPages}) */
            /* port.postMessage({cmd: "finish-scrap", products, currentPage, totalPages}) */
            //sendResponse(products)
        }
            
    }
)

function scrappingProducts(){
    let cards = document.querySelectorAll('div.vitrine>div.vitrine__products>div>div>div>div>div.ShowcaseGrid>div.showcase-grid>div>div.Showcase__content')
    cards = [...cards]
    const products = cards.map(el => {
        const name = el.querySelector('.Showcase__name')?.textContent
        const sellerName = el.querySelector('.Showcase__SellerName')?.textContent
        const salePrice = el.querySelector('.Showcase__salePrice')?.textContent
        return {name, sellerName, salePrice}
    })
    console.log(products)
    return products;
}

async function goToNextPage() {
    const nextPageButton = document.querySelector('.pagination__item.page-control.next');
    if (nextPageButton) {
        nextPageButton.click(); // Simula clic en el botón "Siguiente"
    }
}
/* delay(5000).then(() => {
    let cards = document.querySelectorAll('div.vitrine>div.vitrine__products>div>div>div>div>div.ShowcaseGrid>div.showcase-grid>div>div.Showcase__content')
    cards = [...cards]
    const products = cards.map(el => {
        const name = el.querySelector('.Showcase__name')?.textContent
        const sellerName = el.querySelector('.Showcase__SellerName')?.textContent
        const salePrice = el.querySelector('.Showcase__salePrice')?.textContent
        return {name, sellerName, salePrice}
    })

    console.log(products)
});
 */