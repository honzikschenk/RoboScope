import { PieChart, Pie, Cell } from 'recharts';

// Component for displaying battery level
const BatteryLevel = ({ level }: { level: number }) => (
  <div className="text-center">
    <PieChart width={250} height={200}>
      <Pie
        data={[{ value: level }, { value: 100 - level }]}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
      >
        <Cell fill="#10b981" />
        <Cell fill="#374151" />
      </Pie>
      <text 
        x={125} 
        y={100} 
        textAnchor="middle" 
        dominantBaseline="middle"
        className="fill-slate-100 text-2xl font-bold"
      >
        {`${level}%`}
      </text>
    </PieChart>
  </div>
);

export default BatteryLevel;
