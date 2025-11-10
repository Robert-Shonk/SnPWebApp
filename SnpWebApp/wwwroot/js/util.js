const stockNames = JSON.parse(sessionStorage.getItem("stockNames"));

function filterStocks(userInput) {
    // we take in dictionary of {symbol: companyName}
    const inputLen = userInput.length;

    // create new filtered object
    let filteredObj = {};
    for (let key in stockNames) {
        if (key.slice(0, inputLen) === userInput.toUpperCase()) {
            filteredObj[key] = stockNames[key];
        }
    }

    // then send new filtered object to script.js createNameList() function.
    createNameList(filteredObj);
}

const stockInput = document.getElementById("stockInput");
stockInput.addEventListener("input", () => {
    filterStocks(stockInput.value);
});