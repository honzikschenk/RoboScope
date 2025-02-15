const Chart = require('chart.js');

function createBarChart(element, data) {
    const ctx = document.createElement('canvas');
    element.appendChild(ctx);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.timestamp),
            datasets: [{
                label: 'Value',
                data: data.map(item => item.value),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

module.exports = createBarChart;
