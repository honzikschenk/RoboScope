const Chart = require('chart.js');

function createScatterPlot(element, data) {
    const ctx = document.createElement('canvas');
    element.appendChild(ctx);

    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Scatter Plot',
                data: data.map(item => ({ x: item.x, y: item.y })),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

module.exports = createScatterPlot;
