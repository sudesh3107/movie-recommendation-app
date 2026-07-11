import { CircleAlert } from 'lucide-react';

function ErrorMessage({ message }) {
  return (
    <div className="error-message">
      <CircleAlert size={28} strokeWidth={1.5} />
      <p>{message}</p>
      <p className="error-hint">Make sure the backend server is running on port 5000.</p>
    </div>
  );
}

export default ErrorMessage;
