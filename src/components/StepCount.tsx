// Component for displaying step count
const StepCount = ({ count }: { count: number }) => (
    <div>
      <h3 className="text-lg font-semibold mb-2">Step Count</h3>
      <div className="text-4xl font-bold text-center">{count}</div>
    </div>
  );

export default StepCount;
