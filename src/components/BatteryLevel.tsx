import { PieChart, Pie, Cell } from 'recharts';

// Component for displaying battery level
const BatteryLevel = ({ level }: { level: number }) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Battery Level</h3>
    <PieChart width={200} height={200}>
      <Pie
        data={[{ value: level }, { value: 100 - level }]}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
      >
        <Cell fill="#82ca9d" />
        <Cell fill="#d3d3d3" />
      </Pie>
      <text x={100} y={100} textAnchor="middle" dominantBaseline="middle">
        {`${level}%`}
      </text>
    </PieChart>
  </div>
);

export default BatteryLevel;
