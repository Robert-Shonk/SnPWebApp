// concat desired stock symbol to this
const stockBySymbolUrl = "https://localhost:7188/api/stock/";
const stockAggUrl = "https://localhost:7188/api/stock/aggregate/";


async function fetchStock(symbol) {
    const url = stockBySymbolUrl + symbol;

    const response = await fetch(url);
    const data = await response.json();

    return data;
}

async function fetchStockAgg(symbol) {
    const url = stockAggUrl + symbol;

    const response = await fetch(url);
    data = await response.json();

    console.log(data);
    return data;
}

async function getData(symbol) {
    const data = await fetchStock(symbol);

    let dict = {}
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

// I want a function that will fetch the data first, then use two other functions that will: create the chart
// and create the table.
async function renderView(symbol) {
    const data = await getData(symbol);
    const agg = await fetchStockAgg(symbol);

    // create basic stock data chart
    displayData(data);

    // create aggregate stock data chart
    displayVolatility(agg);

    // create table
    createStockTable(data);
}



// data = { dates: [list of dates], closes: [list of closes], move: [list of moves] }
function createStockTable(data) {
    const table = document.getElementsByTagName("table")[0];
    const rowNum = data['dates'].length;

    for (let row = 0; row < rowNum; row++) {
        const tableRow = document.createElement("tr");

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
function displayData(data) {
    const ctx = document.getElementById('chart');
    const dates = data["dates"].toReversed();
    const closes = data["closes"].toReversed();

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Apple - AAPL',
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
    const ctx = document.getElementById('chart2');
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

renderView('aapl');