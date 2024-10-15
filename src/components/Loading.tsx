import type { FC } from 'react';
import './Loading.css';

interface LoadingProps {
  currentSegment: string;
}

const Loading: FC<LoadingProps> = ({ currentSegment }) => (
  <div className="loading">
    <h2>Processing segments... Please wait.</h2>
    {currentSegment && (
      <>
        <h3>Current Segment:</h3>
        <pre className="current-segment">{currentSegment}</pre>
      </>
    )}
  </div>
);

export default Loading;
