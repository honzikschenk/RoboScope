import * as React from "react";
import {
  ArrowsPointingOutIcon,
  ArrowDownRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
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
      className={`absolute ${isDragging || isResizing ? "z-10" : ""}`}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: `scale(${size.scale})`,
        transformOrigin: "top left",
      }}
    >
      <div className="bg-gray-600 rounded-lg shadow-lg p-4 pt-8 relative">
        <div
          className="absolute top-0 left-0 right-0 h-6 cursor-move bg-gray-400 rounded-t-lg flex items-center justify-center"
          onMouseDown={handleDragStart}
        >
          <ArrowsPointingOutIcon width={20} />
        </div>
        <div
          className="absolute bottom-1 right-1 w-6 h-6 cursor-se-resize flex items-center justify-center"
          onMouseDown={handleResizeStart}
        >
          <ArrowDownRightIcon width={20} />
        </div>
        <button
            title="Close window"
          className="absolute top-0 right-0 w-6 h-6 bg-transparent text-gray-600 hover:text-gray-800"
          onClick={() => removeWindow(id)}
        >
          <XMarkIcon width={10} />
        </button>
        {id === "positions" && motorPositions && (
          <MotorPositions data={motorPositions} />
        )}
        {id === "battery" && batteryLevel !== undefined && (
          <BatteryLevel level={batteryLevel} />
        )}
        {id === "steps" && stepsCount !== undefined && (
          <StepCount count={stepsCount} />
        )}
        {id === "errors" && errors && <ErrorLog errors={errors} />}
      </div>
    </div>
  );
};

export default DataWindow;
