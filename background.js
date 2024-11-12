chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        console.log(msg)
        if (msg.cmd === "update-products") {
            const { products, currentPage } = msg;

            // Obtener los productos ya almacenados y agregar los nuevos
            chrome.storage.local.get("allProducts", (data) => {
                const existingProducts = data.allProducts || [];
                const updatedProducts = existingProducts.concat(products);
                chrome.storage.local.set({ allProducts: updatedProducts });
            });
        }
        if (msg.cmd == "finish-scrap") {
            const {products} = msg;
            chrome.storage.local.set({ "products": products }).then(() => {
                console.log("Value is set");
              });
              

              
        }
        if (msg.cmd == "get-products") {
            /* chrome.storage.local.get(["products"]).then((result) => {
                port.postMessage({cmd: 'result-products', result})
              });
               */
              
              chrome.storage.local.get(["allProducts"]).then((result) => {
                port.postMessage({cmd: 'result-products', result})
                console.log(result)
                chrome.storage.local.remove("allProducts", () => {
                    console.log("La clave 'allProducts' ha sido eliminada.");
                });
              });
              /* chrome.storage.local.remove("allProducts", () => {
                console.log("La clave 'allProducts' ha sido eliminada.");
            }); */
        }
    });
});
