// Component for displaying step count
const StepCount = ({ count }: { count: number }) => (
    <div className="text-center py-4">
      <div className="text-5xl font-bold text-slate-100 mb-2">
        {count.toLocaleString()}
      </div>
      <div className="text-slate-400 text-sm uppercase tracking-wider">
        Total Steps
      </div>
    </div>
  );

export default StepCount;
