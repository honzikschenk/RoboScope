# RoboScope

RoboScope is an application designed to monitor telemetry data from a bipedal robot. The application provides a customizable dashboard to view and analyze the data in real-time.

## Features

- **Real-time Data Monitoring**: Monitor telemetry data from the robot in real-time.
- **Customizable Dashboard**: Customize the dashboard to display data in various formats such as graphs, charts, and tables.
- **Sample Data**: The application includes hard-coded sample data with random data updates periodically.
- **UI Framework**: The user interface is built using Shadcn.

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/yourusername/roboscope.git
    cd roboscope
    ```

2. Install dependencies:

    ```sh
    npm install
    cd desktop
    npm install
    ```

## Usage

1. Start the application:

    ```sh
    npm start
    ```

2. The application will open in an Electron window.

## Data Format

All telemetry data is passed through JSON objects via HTTP requests. Below is an example of the data format:

```json
{
  "timestamp": "2023-10-01T12:00:00Z",
  "sensorData": {
    "temperature": 36.5,
    "batteryLevel": 85,
    "position": {
      "x": 10,
      "y": 5,
      "z": 0
    }
  }
}
```

## Directory Structure

The `desktop` directory contains the following files:

- `index.js`: Main entry point for the Electron app.
- `index.html`: HTML file loaded into the Electron window.
- `renderer.js`: Script for handling UI updates and data visualization.
- `package.json`: Contains the dependencies and scripts for the Electron app.

The `telemetry` directory contains the following files:

- `index.js`: Module to handle telemetry data fetching and parsing.
- `graphs.js`: Module to handle graph creation and updates.
