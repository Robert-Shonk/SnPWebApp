// concat desired stock symbol to this
const stockBySymbolUrl = "https://localhost:7188/api/stock/";


async function fetchStock(symbol) {
    const url = stockBySymbolUrl + symbol;

    const response = await fetch(url);
    const data = await response.json();

    return data;
}

async function getDateClose(symbol) {
    const data = await fetchStock(symbol);

    let dict = {}
    let dates = [];
    let closes = [];

    data.forEach(row => {
        dates.push(row['date']);
        closes.push(row['close']);
    });

    dict['dates'] = dates;
    dict['closes'] = closes;

    return dict;
}

displayData("aapl");