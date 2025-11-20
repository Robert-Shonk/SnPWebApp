/* 
Script for /sectors page
*/

const baseUrl = "https://mysnp500-hvb6abetgadyheau.westus3-01.azurewebsites.net/api/";
// urls
//const baseUrldev = "https://localhost:7188/api/";
const sectorPerfUrl = `${baseUrl}sectorPerformance`;
const dailyUrl = `${baseUrl}daily`
const sectorGroupsUrl = `${baseUrl}sectors`;

async function fetchSectorsInfo() {
    const response = await fetch(sectorPerfUrl);
    const data = await response.json();

    return data;
}

async function fetchDaily() {
    const response = await fetch(dailyUrl);
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
                borderColor: "black",
                backgroundColor: "white",
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "S&P500 Sectors",
                    color: "white",
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        color: "white"
                    },
                    grid: {
                        color: "gray"
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: "Average Move %",
                        color: "white"
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 5,
                        color: "white"
                    }
                }
            },
            pointStyle: false,
            maintainAspectRatio: false,
            indexAxis: 'y'
        }
    });
}

function setSnpStats(snp) {
    const snpValue = document.getElementById("snpValue");
    snpValue.textContent = snp["points"];

    const moveSymbol = document.getElementById("moveSymbol");
    const arrow = document.createElement("div");
    if (snp["move"] >= 0) {
        arrow.setAttribute("id", "triangle-up");
    }
    else {
        arrow.setAttribute("id", "triangle-up");
    }
    moveSymbol.append(arrow);
    

    const movePercent = document.getElementById("movePercent");
    movePercent.textContent = snp["move"];

    const closeDiff = document.getElementById("closeDiff");
    closeDiff.textContent = `+$${snp["change"]}`;

    const date = snp["date"].split("-");
    const closeDate = document.getElementById("closeDate");
    closeDate.textContent = `${date[1]}-${date[2]}-${date[0]}`;
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
            stockClose.textContent = `$${stock["close"]}`;
            stockData.append(stockClose);

            const stockMove = document.createElement("div");
            stockMove.setAttribute("class", "stockMove");
            stockMove.textContent = `${stock["move"].toFixed(2)}%`;
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
            stockClose.textContent = `$${stock["close"]}`;
            stockData.append(stockClose);

            const stockMove = document.createElement("div");
            stockMove.setAttribute("class", "stockMove");
            stockMove.textContent = `${stock["move"].toFixed(2)}%`;
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
    const snp = await fetchDaily();
    const sectorGroups = await fetchSectorGroups();

    displaySectorsInfo(info);
    setSnpStats(snp);
    createTop20Tables(sectorGroups, Object.keys(info));
}

renderView();