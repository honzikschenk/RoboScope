const shadcn = require('shadcn');

function createGraph(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id ${containerId} not found`);
    return;
  }

  const graph = new shadcn.Graph({
    container: container,
    data: data,
    options: {
      title: 'Telemetry Data Graph',
      xAxis: {
        title: 'Time',
        type: 'datetime'
      },
      yAxis: {
        title: 'Value'
      }
    }
  });

  graph.render();
}

function updateGraph(containerId, newData) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id ${containerId} not found`);
    return;
  }

  const graph = shadcn.Graph.getInstance(container);
  if (!graph) {
    console.error(`Graph instance not found for container with id ${containerId}`);
    return;
  }

  graph.updateData(newData);
}

module.exports = {
  createGraph,
  updateGraph
};
