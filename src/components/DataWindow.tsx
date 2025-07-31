import * as React from "react";
import MotorPositions from "./MotorPositions";
import BatteryLevel from "./BatteryLevel";
import StepCount from "./StepCount";
import ErrorLog, { ErrorMessage } from "./ErrorLog";

type MotorPosition = {
  time: string;
  motors: {
    [motorName: string]: number;
  };
};

type DataWindowProps = {
  id: string;
  initialPos: { x: number; y: number };
  initialSize: { scale: number };
  motorPositions?: MotorPosition[];
  batteryLevel?: number;
  stepsCount?: number;
  errors?: ErrorMessage[];
  removeWindow: (id: string) => void;
};

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
      const headerHeight = 64; // Actual header height (py-4 = 16px top/bottom + text height)
      const footerHeight = 64; // Actual footer height (py-4 = 16px top/bottom + content height)
      const windowMargin = 10; // Reduced margin from edges
      
      const newX = Math.max(windowMargin, Math.min(window.innerWidth - 320 * size.scale - windowMargin, e.clientX - startX));
      const newY = Math.max(headerHeight + windowMargin, Math.min(window.innerHeight - footerHeight - 240 * size.scale - windowMargin, e.clientY - startY));
      
      setPos({
        x: newX,
        y: newY,
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
    e.stopPropagation();
    setIsResizing(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const startScale = size.scale;

    const handleResize = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const newScale = Math.max(0.5, Math.min(2, startScale + (deltaX + deltaY) / 200));
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

const getWindowIcon = (id: string) => {
  const type = id.split('-')[0]; // Extract type from id like "steps-1234567890"
  const iconMap = {
    battery: '/icons/battery.svg',
    positions: '/icons/motors.svg',
    steps: '/icons/steps.svg',
    errors: '/icons/error.svg',
  };
  return iconMap[type as keyof typeof iconMap] || '/icons/motors.svg';
};

const getWindowTitle = (id: string) => {
  const type = id.split('-')[0]; // Extract type from id like "steps-1234567890"
  const titleMap = {
    battery: 'Battery Level',
    positions: 'Motor Positions',
    steps: 'Step Count',
    errors: 'Error Log',
  };
  return titleMap[type as keyof typeof titleMap] || 'Data Window';
};

const DataWindow: React.FC<DataWindowProps> = ({
  id,
  initialPos,
  initialSize,
  motorPositions,
  batteryLevel,
  stepsCount,
  errors,
  removeWindow,
}) => {
  const {
    pos,
    size,
    isDragging,
    isResizing,
    handleDragStart,
    handleResizeStart,
  } = useDraggableResizable(id, initialPos, initialSize);

  return (
    <div
      className={`absolute ${
        isDragging || isResizing 
          ? "z-20 scale-105" 
          : "z-10 transition-all duration-200"
      }`}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: `scale(${size.scale})`,
        transformOrigin: "top left",
      }}
    >
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 backdrop-blur-sm relative overflow-hidden min-w-[320px]">
        {/* Modern Header with Icon */}
        <div
          className="h-12 cursor-move bg-gradient-to-r from-slate-700 to-slate-600 flex items-center justify-between px-4 rounded-t-xl border-b border-slate-600"
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center space-x-3">
            <img 
              src={getWindowIcon(id)} 
              alt={getWindowTitle(id)}
              className="w-5 h-5 text-slate-300"
              style={{ filter: 'invert(0.7)' }}
            />
            <span className="text-slate-200 font-medium text-sm">
              {getWindowTitle(id)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <img 
              src="/icons/move.svg" 
              alt="Move"
              className="w-4 h-4 text-slate-400"
              style={{ filter: 'invert(0.6)' }}
            />
            <button
              title="Close window"
              className="w-6 h-6 bg-slate-600 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-200"
              onClick={() => removeWindow(id)}
            >
              <img 
                src="/icons/close.svg" 
                alt="Close"
                className="w-3 h-3"
                style={{ filter: 'invert(1)' }}
              />
            </button>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="p-6 text-slate-100">
          {id.startsWith("positions") && motorPositions && (
            <MotorPositions data={motorPositions} />
          )}
          {id.startsWith("battery") && batteryLevel !== undefined && (
            <BatteryLevel level={batteryLevel} />
          )}
          {id.startsWith("steps") && stepsCount !== undefined && (
            <StepCount count={stepsCount} />
          )}
          {id.startsWith("errors") && errors && <ErrorLog errors={errors} />}
        </div>
        
        {/* Resize Handle */}
        <div
          className="absolute bottom-1 right-1 w-6 h-6 cursor-se-resize flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-tl-lg transition-colors duration-200"
          onMouseDown={handleResizeStart}
        >
          <img 
            src="/icons/resize.svg" 
            alt="Resize"
            className="w-4 h-4"
            style={{ filter: 'invert(0.7)' }}
          />
        </div>
      </div>
    </div>
  );
};

export default DataWindow;
