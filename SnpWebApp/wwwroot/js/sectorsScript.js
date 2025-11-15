/* 
Script for /sectors page
*/

// urls
const baseUrl = "https://localhost:7188/";
const sectorPerfUrl = `${baseUrl}api/sectorPerformance`;
const sectorGroupsUrl = `${baseUrl}api/sectors`;

async function fetchSectorsInfo() {
    const response = await fetch(sectorPerfUrl);
    const data = await response.json();

    return data;
}

async function fetchSectorGroups() {
    const response = await fetch(sectorGroupsUrl);
    const data = await response.json();

    return data;
}

// data = list of dictionaries = [{ sectorName: sector }]
function displaySectorsInfo(data) {
    const ctx = document.getElementById("chart");

    let sectors = [];
    let moveMeans = [];
    Object.keys(data).forEach(key => {
        sectors.push(key);
        moveMeans.push(data[key]);
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sectors,
            datasets: [{
                label: `S&P500 Sectors`,
                data: moveMeans,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                },
                x: {
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 5
                    }
                }
            },
            pointStyle: false,
            maintainAspectRatio: false,
            indexAxis: 'y'
        }
    });
}

function createTop20Tables(data, sortedKeys) {
    const sectorStocks = document.getElementById("sectorStocks");

    sortedKeys.forEach(key => {
        const sectorInfo = document.createElement("div");
        sectorInfo.setAttribute("class", "sectorInfo");

        const sectorTitle = document.createElement("div");
        sectorTitle.setAttribute("class", "sectorTitle");
        sectorTitle.textContent = key;
        sectorInfo.append(sectorTitle);

        // create top20 row
        const top20Row = document.createElement("div");
        top20Row.setAttribute("class", "row20");

        let title20 = '';
        title20 = document.createElement("div");
        title20.setAttribute("class", "title20");
        title20.textContent = "Top 20";
        top20Row.append(title20);

        data[key]["top20"].forEach(stock => {
            const stock20 = document.createElement("div");
            stock20.setAttribute("class", "stock20");

            // create and append stockSymbol div to stock20 div
            const stockSymbol = document.createElement("div");
            stockSymbol.setAttribute("class", "stockSymbol");
            stockSymbol.textContent = stock["symbol"];
            stock20.append(stockSymbol);

            // create stockData div
            const stockData = document.createElement("div");
            stockData.setAttribute("class", "stockData");

            // create and append stockClose and stockMove to stockData div
            const stockClose = document.createElement("div");
            stockClose.setAttribute("class", "stockClose");
            stockClose.textContent = stock["close"];
            stockData.append(stockClose);

            const stockMove = document.createElement("div");
            stockMove.setAttribute("class", "stockMove");
            stockMove.textContent = stock["move"].toFixed(2);
            stockData.append(stockMove);

            // append stockData to stock20 div
            stock20.append(stockData);

            // finally append stock20 to top20Row
            top20Row.append(stock20);
        });
        
        // create bot20 row
        const bot20Row = document.createElement("div");
        bot20Row.setAttribute("class", "row20");

        title20 = document.createElement("div");
        title20.setAttribute("class", "title20");
        title20.textContent = "Bot 20";
        bot20Row.append(title20);

        data[key]["bot20"].forEach(stock => {
            const stock20 = document.createElement("div");
            stock20.setAttribute("class", "stock20");

            // create and append stockSymbol div to stock20 div
            const stockSymbol = document.createElement("div");
            stockSymbol.setAttribute("class", "stockSymbol");
            stockSymbol.textContent = stock["symbol"];
            stock20.append(stockSymbol);

            // create stockData div
            const stockData = document.createElement("div");
            stockData.setAttribute("class", "stockData");

            // create and append stockClose and stockMove to stockData div
            const stockClose = document.createElement("div");
            stockClose.setAttribute("class", "stockClose");
            stockClose.textContent = stock["close"];
            stockData.append(stockClose);

            const stockMove = document.createElement("div");
            stockMove.setAttribute("class", "stockMove");
            stockMove.textContent = stock["move"].toFixed(2);
            stockData.append(stockMove);

            // append stockData to stock20 div
            stock20.append(stockData);

            // finally append stock20 to top20Row
            bot20Row.append(stock20);
        });
        const rowContainer = document.createElement("div");
        rowContainer.setAttribute("class", "rowContainer");
        rowContainer.append(top20Row);
        rowContainer.append(bot20Row);

        // append everything to sectorStocks div
        sectorInfo.append(sectorTitle);
        sectorInfo.append(rowContainer);

        sectorStocks.append(sectorInfo);
    });
}

async function renderView() {
    const info = await fetchSectorsInfo();
    const sectorGroups = await fetchSectorGroups();

    displaySectorsInfo(info);
    createTop20Tables(sectorGroups, Object.keys(info));
}

renderView();