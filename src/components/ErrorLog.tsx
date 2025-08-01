export type ErrorMessage = {
    id: number;
    message: string;
    severity: 'low' | 'medium' | 'high';
};

// Component for displaying error messages
const ErrorLog = ({ errors }: { errors: ErrorMessage[] }) => (
  <div>
    <div className="space-y-2 max-h-40 overflow-y-auto">
      {errors.map((error) => (
        <div key={error.id} className={`p-3 rounded-lg border-l-4 ${
          error.severity === 'low' 
            ? 'bg-yellow-900/50 border-yellow-500 text-yellow-200' 
            : error.severity === 'medium' 
            ? 'bg-orange-900/50 border-orange-500 text-orange-200' 
            : 'bg-red-900/50 border-red-500 text-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${
              error.severity === 'low' 
                ? 'bg-yellow-500' 
                : error.severity === 'medium' 
                ? 'bg-orange-500' 
                : 'bg-red-500'
            }`}></span>
            <span className="text-sm font-medium capitalize">{error.severity}</span>
          </div>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      ))}
    </div>
  </div>
);

export default ErrorLog;
