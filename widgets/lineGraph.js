const Chart = require('chart.js');

function createLineGraph(element, data) {
  const ctx = document.createElement('canvas');
  element.appendChild(ctx);

  const labels = data.map(item => new Date(item.timestamp).toLocaleTimeString());
  const values = data.map(item => item.value);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Telemetry Data',
        data: values,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'minute'
          }
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

module.exports = createLineGraph;
