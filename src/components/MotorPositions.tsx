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
    <LineChart width={280} height={200} data={data}>
      <XAxis 
        dataKey="time" 
        tick={{ fill: '#cbd5e1', fontSize: 12 }}
        axisLine={{ stroke: '#475569' }}
        tickLine={{ stroke: '#475569' }}
      />
      <YAxis 
        tick={{ fill: '#cbd5e1', fontSize: 12 }}
        axisLine={{ stroke: '#475569' }}
        tickLine={{ stroke: '#475569' }}
      />
      <Tooltip 
        allowEscapeViewBox={{ x: true, y: true }}
        contentStyle={{
          backgroundColor: '#1e293b',
          border: '1px solid #475569',
          borderRadius: '8px',
          color: '#e2e8f0'
        }}
      />
      <Legend 
        wrapperStyle={{ color: '#cbd5e1' }}
      />
      {Object.keys(data[0].motors).map((motor, index) => {
        const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
        const color = colors[index % colors.length];
        
        return (
          <Line
            key={motor}
            type="monotone"
            dataKey={`motors.${motor}`}
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
          />
        );
      })}
    </LineChart>
  </div>
);

export default MotorPositions;
