import * as React from "react";
import { LineChart, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";
import { ArrowsPointingOutIcon, ArrowDownRightIcon } from '@heroicons/react/24/solid';
import BatteryLevel from './components/BatteryLevel';

// Define types for the data
type MotorPosition = {
    time: string;
    motors: {
        [motorName: string]: number;
    };
};

type Error = {
    id: number;
    message: string;
    severity: 'low' | 'medium' | 'high';
};

type TelemetryData = {
    motorPositions: MotorPosition[];
    batteryLevel: number;
    stepsCount: number;
    errors: Error[];
};

// Sample data for the robot telemetry
const initialData: TelemetryData = {
  motorPositions: [
    { time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }), motors: { leftLeg: 35, rightLeg: 36, bleep: 35 } },
  ],
  batteryLevel: 85,
  stepsCount: 1000,
  errors: [
    { id: 1, message: 'Minor calibration error', severity: 'low' },
    { id: 2, message: 'Right ankle servo warning', severity: 'medium' },
  ],
};

// Function to generate random data for updates
const generateRandomData = (prevData: TelemetryData): TelemetryData => {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  return {
    motorPositions: [
      ...prevData.motorPositions,
      {
        time,
        motors: {
            leftLeg: Math.floor(Math.random() * 10) + 30,
            // leftLeg: prevData.motorPositions[prevData.motorPositions.length - 1].motors.leftLeg + 1,
            rightLeg: Math.floor(Math.random() * 10) + 30,
            bleep: Math.floor(Math.random() * 10) + 30
        }
      },
    ].slice(-10),
    batteryLevel: Math.max(0, Math.min(100, prevData.batteryLevel + Math.floor(Math.random() * 11) - 5)),
    stepsCount: prevData.stepsCount + Math.floor(Math.random() * 100),
    errors: prevData.errors,
  };
};

// Custom hook for draggable and resizable grid items
const useDraggableResizable = (id: string, initialPos: { x: number; y: number; }, initialSize: { scale: number; }) => {
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
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
    };

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
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
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleResizeEnd);
    };

    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  return { id, pos, size, isDragging, isResizing, handleDragStart, handleResizeStart };
};

// Component for displaying motor position data
const MotorPositions = ({ data }: { data: MotorPosition[] }) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Motor Positions</h3>
    <LineChart width={300} height={200} data={data}>
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
      <Legend />
    {Object.keys(data[0].motors).map((motor) => {
    const hashCode = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    };

    const randomColor = `#${((hashCode(motor) & 0x00FFFFFF) | 0x1000000).toString(16).substring(1)}`;
      return <Line key={motor} type="monotone" dataKey={`motors.${motor}`} stroke={randomColor} />;
    })}
    </LineChart>
  </div>
);

// Component for displaying step count
const StepCount = ({ count }: { count: number }) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Step Count</h3>
    <div className="text-4xl font-bold text-center">{count}</div>
  </div>
);

// Component for displaying error messages
const ErrorLog = ({ errors }: { errors: Error[] }) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Error Log</h3>
    <ul>
      {errors.map((error) => (
        <li key={error.id} className={`mb-2 p-2 rounded ${error.severity === 'low' ? 'bg-yellow-700' : 'bg-red-700'}`}>
          {error.message}
        </li>
      ))}
    </ul>
  </div>
);

// Main App component
function Dashboard() {
  const [data, setData] = React.useState<TelemetryData>(initialData);

  // Update data periodically
  React.useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => generateRandomData(prevData));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Define grid items with their initial positions and sizes
  const gridItems = [
    useDraggableResizable('positions', { x: 0, y: 0 }, { scale: 1 }),
    useDraggableResizable('battery', { x: 320, y: 0 }, { scale: 1 }),
    useDraggableResizable('steps', { x: 0, y: 250 }, { scale: 1 }),
    useDraggableResizable('errors', { x: 320, y: 250 }, { scale: 1 }),
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bipedal Robot Telemetry Dashboard</h1>
      <div className="relative" style={{ height: 'calc(100vh - 100px)' }}>
        {gridItems.map((item) => (
          <div
            key={item.id}
            className={`absolute ${item.isDragging || item.isResizing ? 'z-10' : ''}`}
            style={{
              left: `${item.pos.x}px`,
              top: `${item.pos.y}px`,
              transform: `scale(${item.size.scale})`,
              transformOrigin: 'top left',
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
              {item.id === 'positions' && <MotorPositions data={data.motorPositions} />}
              {item.id === 'battery' && <BatteryLevel level={data.batteryLevel} />}
              {item.id === 'steps' && <StepCount count={data.stepsCount} />}
              {item.id === 'errors' && <ErrorLog errors={data.errors} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
