import type { FC } from 'react';
import './Loading.css';

interface LoadingProps {
    currentSegment: string;
}

const Loading: FC<LoadingProps> = ({ currentSegment }) => (
    <div className="loading">
        <p>Processing... Please wait.</p>
        {currentSegment && (
            <div className="current-segment">
                <strong>Current Segment:</strong>
                <pre>{currentSegment}</pre>
            </div>
        )}
    </div>
);

export default Loading;
