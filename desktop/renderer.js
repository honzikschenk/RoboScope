const { ipcRenderer } = require('electron');
const shadcn = require('shadcn');

function updateDashboard(data) {
  const dashboard = document.getElementById('dashboard');
  dashboard.innerHTML = `
    <div class="shadcn-card">
      <h2>Telemetry Data</h2>
      <p>Timestamp: ${data.timestamp}</p>
      <p>Temperature: ${data.sensorData.temperature} °C</p>
      <p>Battery Level: ${data.sensorData.batteryLevel} %</p>
      <p>Position: (${data.sensorData.position.x}, ${data.sensorData.position.y}, ${data.sensorData.position.z})</p>
    </div>
  `;
}

ipcRenderer.on('update-data', (event, data) => {
  updateDashboard(data);
});

function fetchTelemetryData() {
  fetch('http://example.com/telemetry')
    .then(response => response.json())
    .then(data => {
      updateDashboard(data);
    })
    .catch(error => {
      console.error('Error fetching telemetry data:', error);
    });
}

setInterval(fetchTelemetryData, 5000);
