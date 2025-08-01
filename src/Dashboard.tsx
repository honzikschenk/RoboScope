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
  const [errors] = React.useState<ErrorMessage[]>(initialErrors);
  const [gridItems, setGridItems] = React.useState([
    { id: "positions", initialPos: { x: 20, y: 80 }, initialSize: { scale: 1 } },
    { id: "battery", initialPos: { x: 360, y: 80 }, initialSize: { scale: 1 } },
    { id: "steps", initialPos: { x: 700, y: 80 }, initialSize: { scale: 1 } },
    { id: "errors", initialPos: { x: 20, y: 340 }, initialSize: { scale: 1 } },
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

  // Enhanced config management with better error handling and fallback options
  const loadConfiguration = React.useCallback(async () => {
    try {
      // Try to load from server first
      console.log("Loading window configuration from server...");
      const response = await axios.get("/window-config.json");
      if (response.data && Array.isArray(response.data)) {
        console.log("Loaded window configuration from server:", response.data);
        setGridItems(response.data);
        return;
      }
    } catch (error) {
      console.warn("Failed to load config from server:", error);
    }

    try {
      // Fallback to localStorage
      const savedConfig = localStorage.getItem('roboscope-window-config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        if (Array.isArray(config)) {
          console.log("Loaded window configuration from localStorage:", config);
          setGridItems(config);
          return;
        }
      }
    } catch (error) {
      console.warn("Failed to load config from localStorage:", error);
    }

    console.log("Using default window configuration");
  }, []);

  // Load configuration on mount
  React.useEffect(() => {
    loadConfiguration();
  }, [loadConfiguration]);

  const saveConfiguration = React.useCallback(async () => {
    try {
      // Always save to localStorage as primary storage
      localStorage.setItem('roboscope-window-config', JSON.stringify(gridItems));
      console.log("Configuration saved to localStorage successfully");

      // Try to save to server as backup
      const backendUrl = window.location.protocol === 'file:' || window.electronAPI 
        ? "http://localhost:3001/save-window-config"
        : "http://localhost:3000/save-window-config";
      
      await axios.post(backendUrl, gridItems, {
        timeout: 5000, // 5 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("Configuration also saved to server successfully");
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn("Server endpoint not available, configuration saved locally only");
      } else if (error.code === 'ECONNABORTED') {
        console.warn("Server save timed out, configuration saved locally only");
      } else {
        console.warn("Failed to save to server, configuration saved locally only:", error.message);
      }
    }
  }, [gridItems]);

  const handleAddWindow = () => {
    // Calculate a smart position for the new window to avoid overlap
    const existingPositions = gridItems.map(item => ({ x: item.initialPos.x, y: item.initialPos.y }));
    let newX = 20;
    let newY = 80;
    
    // Try to find a position that doesn't overlap with existing windows
    const windowWidth = 320;
    const windowHeight = 260; // Slightly larger to account for content
    const spacing = 20;
    
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        const testX = col * (windowWidth + spacing) + spacing;
        const testY = row * (windowHeight + spacing) + 80; // Start below header
        
        const hasOverlap = existingPositions.some(pos => 
          Math.abs(pos.x - testX) < windowWidth && 
          Math.abs(pos.y - testY) < windowHeight
        );
        
        if (!hasOverlap) {
          newX = testX;
          newY = testY;
          break;
        }
      }
      if (newX !== 20 || newY !== 80) break;
    }
    
    const newWindow = {
      id: `${newWindowType}-${Date.now()}`, // Add timestamp to make unique
      initialPos: { x: newX, y: newY },
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
    saveConfiguration();
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="px-6 py-4 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
          RoboScope Dashboard
        </h1>
      </header>
      <div className="flex-1 relative overflow-hidden">
        {gridItems.map((item, index) => (
          <DataWindow
            key={index}
            id={item.id}
            initialPos={item.initialPos}
            initialSize={item.initialSize}
            motorPositions={item.id.startsWith("positions") ? motorPositions : undefined}
            batteryLevel={item.id.startsWith("battery") ? batteryLevel : undefined}
            stepsCount={item.id.startsWith("steps") ? stepsCount : undefined}
            errors={item.id.startsWith("errors") ? errors : undefined}
            removeWindow={handleRemoveWindow}
          />
        ))}
      </div>
      <div className="px-6 py-4 bg-slate-800/50 backdrop-blur-sm border-t border-slate-700">
        <div className="flex items-center justify-center space-x-4">
          <select
            title="Select window type"
            value={newWindowType}
            onChange={(e) => setNewWindowType(e.target.value)}
            className="px-3 py-2 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="positions">Motor Positions</option>
            <option value="battery">Battery Level</option>
            <option value="steps">Step Count</option>
            <option value="errors">Error Log</option>
          </select>
          <button
            onClick={handleAddWindow}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            Add Window
          </button>
          <button
            onClick={handleSaveConfig}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            Save Config
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
