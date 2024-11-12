const buttonScrapt = document.getElementById('btn-scrap');
const buttonProducts = document.getElementById('btn-product');
const port = chrome.runtime.connect({name: "background"})

/* buttonScrapt.addEventListener('click', async () => {
    port.postMessage({joke: "scrap"})
})
 */

buttonScrapt.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, {cmd: "scrap"});
})

buttonProducts.addEventListener('click', async () => {
    port.postMessage({cmd: "get-products"})
})


port.onMessage.addListener(function(msg) {
    if (msg.cmd === 'result-products'){
        const {result} = msg;
        const txtData = document.getElementById('txt-data');
        txtData.innerText = JSON.stringify(result,null,2)

        // Descargar como Excel
        const worksheet = XLSX.utils.json_to_sheet(result.allProducts);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

        XLSX.writeFile(workbook, "productos.xlsx");
    }
});
