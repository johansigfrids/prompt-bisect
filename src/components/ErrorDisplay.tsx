import { type FC } from 'react';
import './ErrorDisplay.css';

interface ErrorDisplayProps {
    message: string;
}

const ErrorDisplay: FC<ErrorDisplayProps> = ({ message }) => (
    <div className="error">
        <p>Error: {message}</p>
    </div>
);

export default ErrorDisplay;
