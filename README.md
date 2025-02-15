# RoboScope

RoboScope is an Electron-based desktop application that monitors telemetry data from a bipedal robot. The app features a customizable dashboard with various data visualization widgets, including graphs, charts, tables, and lists. The data is passed through JSON files and updated periodically with sample data.

## Features

- **Customizable Dashboard**: Add, remove, and rearrange widgets on the dashboard.
- **Data Visualization**: Line graphs, bar charts, pie charts, scatter plots, tables, and lists.
- **Modular Data Components**: Separate JSON files for each data type, allowing easy addition and removal of data types.
- **Periodic Data Updates**: Sample data is updated periodically to simulate real-time data.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/honzikschenk/RoboScope.git
   cd RoboScope
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Electron app:
   ```bash
   npm start
   ```

## File Structure

- `main.js`: Main Electron process file.
- `index.html`: Main HTML file for the app's UI.
- `renderer.js`: Main JavaScript file for the app's UI.
- `styles.css`: CSS file for styling the app's UI.
- `data/`: Directory containing JSON files with sample data.
- `widgets/`: Directory containing JavaScript files for rendering different types of widgets.

## Usage

1. Start the Electron app using the installation instructions above.
2. The app will load the dashboard with sample data and update it periodically.
3. Customize the dashboard by adding, removing, and rearranging widgets.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
