import * as React from "react";
import DataWindow from "./components/DataWindow";
import { ErrorMessage } from "./components/ErrorLog";
import { MotorPosition } from "./components/MotorPositions";
import axios from "axios";

// Sample data for the robot telemetry
const initialMotorPositions: MotorPosition[] = [
  {
    time: new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    }),
    motors: { leftLeg: 35, rightLeg: 36, bleep: 35 },
  },
];

const initialBatteryLevel = 85;
const initialStepsCount = 1000;
const initialErrors: ErrorMessage[] = [
  { id: 1, message: "Minor calibration error", severity: "low" },
  { id: 2, message: "Right ankle servo warning", severity: "medium" },
  { id: 3, message: "Left knee servo error", severity: "high" },
];

// Function to generate random motor positions
const generateRandomMotorPositions = (
  prevMotorPositions: MotorPosition[]
): MotorPosition[] => {
  const time = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
  return [
    ...prevMotorPositions,
    {
      time,
      motors: {
        leftLeg: Math.floor(Math.random() * 10) + 30,
        rightLeg: Math.floor(Math.random() * 10) + 30,
        bleep: Math.floor(Math.random() * 10) + 30,
      },
    },
  ].slice(-10);
};

// Function to generate random battery level
const generateRandomBatteryLevel = (prevBatteryLevel: number): number => {
  return Math.max(
    0,
    Math.min(100, prevBatteryLevel + Math.floor(Math.random() * 11) - 5)
  );
};

// Function to generate random steps count
const generateRandomStepsCount = (prevStepsCount: number): number => {
  return prevStepsCount + Math.floor(Math.random() * 100);
};

// Main App component
function Dashboard() {
  const [motorPositions, setMotorPositions] = React.useState<MotorPosition[]>(
    initialMotorPositions
  );
  const [batteryLevel, setBatteryLevel] =
    React.useState<number>(initialBatteryLevel);
  const [stepsCount, setStepsCount] = React.useState<number>(initialStepsCount);
  const [errors, setErrors] = React.useState<ErrorMessage[]>(initialErrors);
  const [gridItems, setGridItems] = React.useState([
    { id: "positions", initialPos: { x: 0, y: 0 }, initialSize: { scale: 1 } },
    { id: "battery", initialPos: { x: 320, y: 0 }, initialSize: { scale: 1 } },
    { id: "steps", initialPos: { x: 0, y: 250 }, initialSize: { scale: 1 } },
    { id: "errors", initialPos: { x: 320, y: 250 }, initialSize: { scale: 1 } },
  ]);
  const [newWindowType, setNewWindowType] = React.useState("positions");

  // Update data periodically
  React.useEffect(() => {
    const interval = setInterval(() => {
      setMotorPositions((prevMotorPositions) =>
        generateRandomMotorPositions(prevMotorPositions)
      );
      setBatteryLevel((prevBatteryLevel) =>
        generateRandomBatteryLevel(prevBatteryLevel)
      );
      setStepsCount((prevStepsCount) =>
        generateRandomStepsCount(prevStepsCount)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Load window configuration from JSON file
  React.useEffect(() => {
    axios.get("/window-config.json")
      .then((response) => {
        if (response.data) {
          console.log("Loaded window configuration:", response.data);
          setGridItems(response.data);
        }
      })
      .catch((error) => {
        console.error("Error loading window configuration:", error);
      });
  }, []);

  const handleAddWindow = () => {
    const newWindow = {
      id: newWindowType,
      initialPos: { x: 0, y: 0 },
      initialSize: { scale: 1 },
    };
    console.log("Adding new window:", newWindow);
    setGridItems((prevGridItems) => [...prevGridItems, newWindow]);
  };

  const handleRemoveWindow = (id: string) => {
    console.log("Removing window:", id);
    setGridItems((prevGridItems) => prevGridItems.filter(item => item.id !== id));
  };

  const handleSaveConfig = () => {
    console.log("Saving window configuration:", gridItems);
    axios.post("http://localhost:3000/save-window-config", gridItems)
      .then(() => {
        console.log("Window configuration saved successfully.");
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.error("Endpoint not found. Please check the server configuration.");
        } else {
          console.error("Error saving window configuration:", error);
        }
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Bipedal Robot Telemetry Dashboard
      </h1>
      <div className="relative" style={{ height: "calc(100vh - 100px)" }}>
        {gridItems.map((item, index) => (
          <DataWindow
            key={index}
            id={item.id}
            initialPos={item.initialPos}
            initialSize={item.initialSize}
            motorPositions={item.id === "positions" ? motorPositions : undefined}
            batteryLevel={item.id === "battery" ? batteryLevel : undefined}
            stepsCount={item.id === "steps" ? stepsCount : undefined}
            errors={item.id === "errors" ? errors : undefined}
            removeWindow={handleRemoveWindow}
          />
        ))}
      </div>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        <select
          title="Select window type"
          value={newWindowType}
          onChange={(e) => setNewWindowType(e.target.value)}
          className="p-2 rounded border border-gray-300"
        >
          <option value="positions">Motor Positions</option>
          <option value="battery">Battery Level</option>
          <option value="steps">Step Count</option>
          <option value="errors">Error Log</option>
        </select>
        <button
          onClick={handleAddWindow}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Add Window
        </button>
        <button
          onClick={handleSaveConfig}
          className="p-2 bg-green-500 text-white rounded"
        >
          Save Config
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
