/*
This script has functions for fetching all the data and creating visuals for index.html.

index.html shows:
a list of all stocks on the S&P500 that user can click and choose to show info,
2 charts showing year-to-date closing prices and monthly volatility for stock,
and a table showing stock's closing date, closing price, and daily return percentage (move).
*/

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const baseUrl = "https://mysnp500-hvb6abetgadyheau.westus3-01.azurewebsites.net/api/";
// concat desired stock symbol to this
// const baseUrl = "https://localhost:7188/api/";
const stockBySymbolUrl = `${baseUrl}stock/`;
const stockNamesUrl = `${baseUrl}names`;
const stockAggUrl = `${baseUrl}stock/aggregate/`;

// fetch functions
async function fetchStock(symbol) {
    const url = stockBySymbolUrl + symbol;

    const response = await fetch(url);
    const data = await response.json();

    return data;
}

async function getData(symbol) {
    const data = await fetchStock(symbol);

    let dict = {};
    let dates = [];
    let closes = [];
    let moves = [];

    data.forEach(row => {
        // format dates
        const dateSplit = row['date'].split('-');
        dates.push(`${months[parseInt(dateSplit[1])-1]} ${dateSplit[2]}, ${dateSplit[0]}`);

        closes.push(row['close']);
        moves.push(row['move']);
    });

    dict['dates'] = dates;
    dict['closes'] = closes;
    dict['moves'] = moves;

    return dict;
}

// gets list of all 500 stock company names and ticker symbols, a dictionary.
async function fetchStockNames() {
    const response = await fetch(stockNamesUrl);
    const data = await response.json();

    return data;
}

// gets given stock's monthly average closing price and monthly volitility.
async function fetchStockAgg(symbol) {
    const url = stockAggUrl + symbol;

    const response = await fetch(url);
    data = await response.json();

    return data;
}

// DOM functions
// create list of stock company names for user to choose for display.
// param is a dictionary = { symbol: companyName }, so stocks['AMD'] returns 'Advanced Micro Devices'.
function createNameList(stocks) {
    const stockList = document.getElementById("list");

    // clear stockList div if children exist
    while (stockList.firstChild) {
        stockList.firstChild.remove();
    }

    // alphabetize keys
    const sortedKeys = Object.keys(stocks).sort();

    // for every key, create a main div that will have 2 divs, one for each symbol and name.
    // set main div's dataset.symbol = symbol.
    // then append to stockList div.
    sortedKeys.forEach(key => {
        const mainDiv = document.createElement("div");
        mainDiv.setAttribute("class", "stockListRow");
        mainDiv.setAttribute("id", key);

        // onclick will render new charts, highlight chosen stock in list and un-highlight previous one.
        mainDiv.addEventListener('click', () => {
            // clear input field
            const stockInput = document.getElementById("stockInput");
            stockInput.value = '';

            // close whole stockList menu
            const stockL = document.getElementsByClassName("stockList")[0];
            stockL.style.display = "none";

            renderView(key, stocks[key]);
        });

        const symbolDiv = document.createElement("div");
        symbolDiv.setAttribute("class", "sym");
        symbolDiv.textContent = key;

        const nameDiv = document.createElement("div");
        nameDiv.setAttribute("class", "stockName");
        nameDiv.textContent = stocks[key];

        mainDiv.append(symbolDiv, nameDiv);

        stockList.append(mainDiv);

        if (key == sessionStorage.getItem("stockFocus")) {
            mainDiv.setAttribute("id", "listFocus");
        }
    });
}


// data = { dates: [list of dates], closes: [list of closes], move: [list of moves] }
function createStockTable(data) {
    // scroll table back to top
    const tbody = document.getElementsByTagName("tbody")[0];
    //stockTable.scrollTop = 0;

    // delete previous tds if new stock selected
    const oldTds = document.querySelectorAll('.stockData');
    if (oldTds.length > 0) {
        oldTds.forEach(r => {
            r.remove();
        });
    }

    const rowNum = data['dates'].length;

    for (let row = 0; row < rowNum; row++) {
        const tableRow = document.createElement("tr");
        tableRow.setAttribute("class", "stockData");

        const tdDate = document.createElement("td");
        tdDate.textContent = data["dates"][row];
        tableRow.append(tdDate);

        const tdClose = document.createElement("td");
        tdClose.textContent = data["closes"][row].toFixed(2);
        tableRow.append(tdClose);

        const tdMove = document.createElement("td");
        tdMove.textContent = data["moves"][row].toFixed(2);
        if (data["moves"][row] >= 0) {
            tdMove.setAttribute("class", "positiveMove");
        }
        else {
            tdMove.setAttribute("class", "negativeMove");
        }
        tableRow.append(tdMove);

        tbody.append(tableRow);
    }
}

// create chart for close price on date
function displayData(data, symbol, stockName) {
    let ctx = document.getElementById('chart');
    //ctx.remove();
    if (ctx != null) {
        ctx.remove();
        ctx = document.createElement("canvas");

        const graphCanvas = document.getElementById("graphCanvas");
        graphCanvas.append(ctx);
    }
    ctx.setAttribute('id', 'chart');

    const dates = data["dates"].toReversed();
    const closes = data["closes"].toReversed();

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: "Year to Date",
                data: closes,
                borderColor: "white",
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
                    text: `Year to Date - ${symbol.toUpperCase()}`,
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
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 5,
                        color: "white"
                    },
                    grid: {
                        color: "gray"
                    }
                }
            },
            pointStyle: false,
            maintainAspectRatio: false
        }
    });
}

// create aggregate stock data charts
// one for monthly volatility (and one for monthly average?)
function displayVolatility(data) {
    let ctx = document.getElementById('chart2');
    if (ctx != null) {
        ctx.remove();
        ctx = document.createElement("canvas");

        const graphCanvas = document.getElementById("graphCanvas2");
        graphCanvas.append(ctx);
    }
    ctx.setAttribute('id', 'chart2');

    const volatility = data['monthlyStds'];
    let monthNums = [];
    for (let i = 0; i < volatility.length; i++) {
        monthNums.push(months[i]);
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthNums,
            datasets: [{
                label: 'Monthly Volatility',
                data: volatility,
                borderColor: "white",
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
                    text: "Monthly Volatility",
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
                    ticks: {
                        color: "white"
                    },
                    grid: {
                        color: "gray"
                    }
                }
            },
            maintainAspectRatio: false
        }
    });
}

async function renderView(symbol, stockName) {
    const data = await getData(symbol);
    const agg = await fetchStockAgg(symbol);

    sessionStorage.setItem("stockFocus", symbol.toUpperCase());

    // first check if object does not exist in sessionStorage already before making api call.
    if (sessionStorage.getItem("stockNames") == null) {
        const stockNames = await fetchStockNames();
        sessionStorage.setItem("stockNames", JSON.stringify(stockNames));
    }
    
    // create stock name list
    createNameList(JSON.parse(sessionStorage.getItem("stockNames")));

    // create basic stock data chart
    displayData(data, symbol, stockName);

    // create aggregate stock data chart
    displayVolatility(agg);

    // create table
    createStockTable(data);

    const companyName = document.getElementById("companyName");
    companyName.textContent = stockName;

    const ticker = document.getElementById("ticker");
    ticker.textContent = symbol.toUpperCase();
}

// render view with Apple as default.
renderView('aapl', 'Apple Inc.');