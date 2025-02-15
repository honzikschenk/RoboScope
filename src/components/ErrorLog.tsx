export type ErrorMessage = {
    id: number;
    message: string;
    severity: 'low' | 'medium' | 'high';
};

// Component for displaying error messages
const ErrorLog = ({ errors }: { errors: ErrorMessage[] }) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Error Log</h3>
    <ul>
      {errors.map((error) => (
        <li key={error.id} className={`mb-2 p-2 rounded ${error.severity === 'low' ? 'bg-yellow-500' : error.severity === 'medium' ? 'bg-amber-600' : 'bg-red-700'}`}>
          {error.message}
        </li>
      ))}
    </ul>
  </div>
);

export default ErrorLog;
