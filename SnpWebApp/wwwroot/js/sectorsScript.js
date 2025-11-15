/* 
Script for /sectors page
*/

// urls
const baseUrl = "https://localhost:7188/";
const sectorPerfUrl = `${baseUrl}api/sectorPerformance`;

async function fetchSectorsInfo() {
    const response = await fetch(sectorPerfUrl);
    const data = await response.json();

    console.log(data);
    return data;
}

// data = list of dictionaries = [{ sectorName: sector }]
function displaySectorsInfo(data) {
    const ctx = document.getElementById("chart");

    let sectors = [];
    let moveMeans = [];
    data.forEach(d => {
        sectors.push(d['sectorName']);
        moveMeans.push(d['sectorMoveMean']);
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

async function renderView() {
    const data = await fetchSectorsInfo();

    displaySectorsInfo(data);
}

renderView();