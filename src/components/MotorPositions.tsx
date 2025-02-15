import { Line, LineChart, Legend, XAxis, YAxis, Tooltip } from "recharts";


export type MotorPosition = {
    time: string;
    motors: {
      [motorName: string]: number;
    };
  };

// Component for displaying motor position data
const MotorPositions = ({ data }: { data: MotorPosition[] }) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Motor Positions</h3>
    <LineChart width={300} height={200} data={data}>
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip allowEscapeViewBox={{ x: true, y: true }} />
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

        const randomColor = `#${((hashCode(motor) & 0x00ffffff) | 0x1000000)
          .toString(16)
          .substring(1)}`;
        return (
          <Line
            key={motor}
            type="monotone"
            dataKey={`motors.${motor}`}
            stroke={randomColor}
          />
        );
      })}
    </LineChart>
  </div>
);

export default MotorPositions;
