const fs = require('fs');
const path = require('path');
const Chart = require('chart.js');
const DataTable = require('datatables');

const dataDirectory = path.join(__dirname, 'data');
const widgetDirectory = path.join(__dirname, 'widgets');

let widgets = [];

function loadJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function fetchData() {
  const files = fs.readdirSync(dataDirectory);
  return files.map(file => loadJSON(path.join(dataDirectory, file)));
}

function createWidget(widgetConfig) {
  const widgetType = widgetConfig.visualizationType;
  const widgetData = widgetConfig.data;
  const widgetElement = document.createElement('div');
  widgetElement.className = 'widget';

  switch (widgetType) {
    case 'lineGraph':
      const lineGraph = require(path.join(widgetDirectory, 'lineGraph.js'));
      lineGraph(widgetElement, widgetData);
      break;
    case 'barChart':
      const barChart = require(path.join(widgetDirectory, 'barChart.js'));
      barChart(widgetElement, widgetData);
      break;
    case 'pieChart':
      const pieChart = require(path.join(widgetDirectory, 'pieChart.js'));
      pieChart(widgetElement, widgetData);
      break;
    case 'scatterPlot':
      const scatterPlot = require(path.join(widgetDirectory, 'scatterPlot.js'));
      scatterPlot(widgetElement, widgetData);
      break;
    case 'table':
      const table = require(path.join(widgetDirectory, 'table.js'));
      table(widgetElement, widgetData);
      break;
    case 'list':
      const list = require(path.join(widgetDirectory, 'list.js'));
      list(widgetElement, widgetData);
      break;
    default:
      console.error(`Unknown widget type: ${widgetType}`);
  }

  return widgetElement;
}

function renderDashboard() {
  const dashboardContainer = document.getElementById('dashboard-container');
  dashboardContainer.innerHTML = '';

  widgets.forEach(widgetConfig => {
    const widgetElement = createWidget(widgetConfig);
    dashboardContainer.appendChild(widgetElement);
  });
}

function updateDashboard() {
  const data = fetchData();
  widgets = data.map(item => ({
    visualizationType: item.visualizationType,
    data: item.data,
  }));

  renderDashboard();
}

setInterval(updateDashboard, 5000);
updateDashboard();
