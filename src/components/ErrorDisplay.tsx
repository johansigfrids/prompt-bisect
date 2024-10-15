import type { FC } from 'react';
import './ErrorDisplay.css';

interface ErrorDisplayProps {
  message: string;
  onBack: () => void;
}

const ErrorDisplay: FC<ErrorDisplayProps> = ({ message, onBack }) => (
  <div className="error">
    <h2>Error:</h2>
    <p>{message}</p>
    <button type="button" onClick={onBack} className="back-button">
      Back
    </button>
  </div>
);

export default ErrorDisplay;
