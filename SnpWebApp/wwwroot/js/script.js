/*
This script has functions for fetching all the data and creating visuals for index.html.

index.html shows:
a list of all stocks on the S&P500 that user can click and choose to show info,
2 charts showing year-to-date closing prices and monthly volatility for stock,
and a table showing stock's closing date, closing price, and daily return percentage (move).
*/

// concat desired stock symbol to this
const baseUrl = "https://localhost:7188/api/";
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
        dates.push(row['date']);
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
    const stockList = document.getElementById("stockList");

    // for every key, create a main div that will have 2 divs, one for each symbol and name.
    // set main div's dataset.symbol = symbol.
    // then append to stockList div.
    for (const key in stocks) {
        const mainDiv = document.createElement("div");
        mainDiv.setAttribute("class", "stockListRow");
        mainDiv.style.display = "flex";
        mainDiv.dataset.symbol = key;
        // still need to make onlick function but need to figure out how to destroy() charts before making new ones.
        mainDiv.addEventListener('click', () => {
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
    }
}


// data = { dates: [list of dates], closes: [list of closes], move: [list of moves] }
function createStockTable(data) {
    // delete previous tds if new stock selected
    const oldTds = document.querySelectorAll('.stockData');
    if (oldTds.length > 0) {
        oldTds.forEach(r => {
            r.remove();
        });
    }

    const table = document.getElementsByTagName("table")[0];
    const rowNum = data['dates'].length;

    for (let row = 0; row < rowNum; row++) {
        const tableRow = document.createElement("tr");
        tableRow.setAttribute('class', 'stockData');

        const tdDate = document.createElement("td");
        tdDate.textContent = data["dates"][row];
        tableRow.append(tdDate);

        const tdClose = document.createElement("td");
        tdClose.textContent = data["closes"][row].toFixed(2);
        tableRow.append(tdClose);

        const tdMove = document.createElement("td");
        tdMove.textContent = data["moves"][row].toFixed(2);
        tableRow.append(tdMove);

        table.append(tableRow);
    }
}

// create chart for close price on date
function displayData(data, symbol, stockName) {
    let ctx = document.getElementById('chart');
    ctx.remove();
    const chart2 = document.getElementById('chart2');
    ctx = document.createElement('canvas');
    ctx.setAttribute('id', 'chart');
    chart2.before(ctx);

    const dates = data["dates"].toReversed();
    const closes = data["closes"].toReversed();

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: `${stockName} - ${symbol.toUpperCase()}`,
                data: closes,
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
                        maxTicksLimit: 6
                    }
                }
            },
            pointStyle: false
        }
    });
}

// create aggregate stock data charts
// one for monthly volatility (and one for monthly average?)
function displayVolatility(data) {
    let ctx = document.getElementById('chart2');
    ctx.remove();
    ctx = document.createElement('canvas');
    ctx.setAttribute('id', 'chart2');

    const chartDiv = document.getElementById('chartDiv');
    chartDiv.append(ctx);


    const volatility = data['monthlyStds'];
    let monthNums = [];
    for (let i = 0; i < volatility.length; i++) {
        monthNums.push(i + 1);
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthNums,
            datasets: [{
                label: 'Monthly Volatility',
                data: volatility,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

async function renderView(symbol, stockName) {
    const data = await getData(symbol);
    const stockNames = await fetchStockNames();
    const agg = await fetchStockAgg(symbol);

    // create stock name list
    createNameList(stockNames);

    // create basic stock data chart
    displayData(data, symbol, stockName);

    // create aggregate stock data chart
    displayVolatility(agg);

    // create table
    createStockTable(data);

    const companyName = document.getElementById("companyName");
    companyName.textContent = stockName;
}

renderView('aapl', 'Apple');