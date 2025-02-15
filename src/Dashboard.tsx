import * as React from "react";
import {
  ArrowsPointingOutIcon,
  ArrowDownRightIcon,
} from "@heroicons/react/24/solid";
import BatteryLevel from "./components/BatteryLevel";
import ErrorLog, { ErrorMessage } from "./components/ErrorLog";
import MotorPositions, { MotorPosition } from "./components/MotorPositions";
import StepCount from "./components/StepCount";

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

// Custom hook for draggable and resizable grid items
const useDraggableResizable = (
  id: string,
  initialPos: { x: number; y: number },
  initialSize: { scale: number }
) => {
  const [pos, setPos] = React.useState(initialPos);
  const [size, setSize] = React.useState(initialSize);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isResizing, setIsResizing] = React.useState(false);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const startX = e.clientX - pos.x;
    const startY = e.clientY - pos.y;

    const handleDrag = (e: MouseEvent) => {
      setPos({
        x: e.clientX - startX,
        y: e.clientY - startY,
      });
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
    };

    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const startScale = size.scale;

    const handleResize = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const newScale = Math.max(0.5, startScale + (deltaX + deltaY) / 200);
      setSize({ scale: newScale });
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("mouseup", handleResizeEnd);
    };

    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", handleResizeEnd);
  };

  return {
    id,
    pos,
    size,
    isDragging,
    isResizing,
    handleDragStart,
    handleResizeStart,
  };
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

  // Define grid items with their initial positions and sizes
  const gridItems = [
    useDraggableResizable("positions", { x: 0, y: 0 }, { scale: 1 }),
    useDraggableResizable("battery", { x: 320, y: 0 }, { scale: 1 }),
    useDraggableResizable("steps", { x: 0, y: 250 }, { scale: 1 }),
    useDraggableResizable("errors", { x: 320, y: 250 }, { scale: 1 }),
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Bipedal Robot Telemetry Dashboard
      </h1>
      <div className="relative" style={{ height: "calc(100vh - 100px)" }}>
        {gridItems.map((item) => (
          <div
            key={item.id}
            className={`absolute ${
              item.isDragging || item.isResizing ? "z-10" : ""
            }`}
            style={{
              left: `${item.pos.x}px`,
              top: `${item.pos.y}px`,
              transform: `scale(${item.size.scale})`,
              transformOrigin: "top left",
            }}
          >
            <div className="bg-gray-600 rounded-lg shadow-lg p-4 pt-8 relative">
              <div
                className="absolute top-0 left-0 right-0 h-6 cursor-move bg-gray-400 rounded-t-lg flex items-center justify-center"
                onMouseDown={item.handleDragStart}
              >
                <ArrowsPointingOutIcon width={20} />
              </div>
              <div
                className="absolute bottom-1 right-1 w-6 h-6 cursor-se-resize flex items-center justify-center"
                onMouseDown={item.handleResizeStart}
              >
                <ArrowDownRightIcon width={20} />
              </div>
              {item.id === "positions" && (
                <MotorPositions data={motorPositions} />
              )}
              {item.id === "battery" && <BatteryLevel level={batteryLevel} />}
              {item.id === "steps" && <StepCount count={stepsCount} />}
              {item.id === "errors" && <ErrorLog errors={errors} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
