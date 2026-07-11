import { Film } from 'lucide-react';

function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <Film className="spin-icon" size={32} strokeWidth={1.5} />
      <p>Loading movies...</p>
    </div>
  );
}

export default LoadingSpinner;
