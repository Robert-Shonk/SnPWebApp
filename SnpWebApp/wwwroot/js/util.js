// toggles stock list for mobile views. button will not be visible for wider screens.
const stocksButton = document.getElementById("stocksButton");
stocksButton.addEventListener("click", () => {
    const stockList = document.getElementsByClassName("stockList")[0];

    if (stockList.style.display === "none" || stockList.style.display === "") {
        stockList.style.display = "flex";
    }
    else {
        stockList.style.display = "none";
    }
});

function filterStocks(userInput) {
    // we take in dictionary of {symbol: companyName}
    const stockNames = JSON.parse(sessionStorage.getItem("stockNames"));
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


// chart buttons (mobile)
const ytdChart = document.getElementById("graphCanvas");
const vol = document.getElementById("graphCanvas2");

const yearToDate = document.getElementById("yearToDate");
yearToDate.addEventListener("click", () => {
    if (ytdChart.style.display === "none" || ytdChart.style.display === '') {
        ytdChart.style.display = "block";
        vol.style.display = "none";
    }
});

const volatility = document.getElementById("volatility");
volatility.addEventListener("click", () => {

    if (vol.style.display === "none" || vol.style.display === '') {
        ytdChart.style.display = "none";
        vol.style.display = "block";
    }
});