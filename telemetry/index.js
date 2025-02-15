const sampleData = {
  timestamp: new Date().toISOString(),
  sensorData: {
    temperature: (Math.random() * 10 + 30).toFixed(2),
    batteryLevel: Math.floor(Math.random() * 100),
    position: {
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
      z: Math.floor(Math.random() * 100)
    }
  }
};

function fetchTelemetryData() {
  return new Promise((resolve) => {
    const data = {
      timestamp: new Date().toISOString(),
      sensorData: {
        temperature: (Math.random() * 10 + 30).toFixed(2),
        batteryLevel: Math.floor(Math.random() * 100),
        position: {
          x: Math.floor(Math.random() * 100),
          y: Math.floor(Math.random() * 100),
          z: Math.floor(Math.random() * 100)
        }
      }
    };
    resolve(data);
  });
}

function parseTelemetryData(json) {
  return JSON.parse(json);
}

module.exports = {
  fetchTelemetryData,
  parseTelemetryData,
  sampleData
};
