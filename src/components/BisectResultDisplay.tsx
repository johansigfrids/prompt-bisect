import type { FC } from 'react';
import './BisectResultDisplay.css';
import type { BisectResult } from '../api/bisect';

interface BisectResultDisplayProps {
  bisectResult: BisectResult;
  onBack: () => void;
}

const BisectResultDisplay: FC<BisectResultDisplayProps> = ({
  bisectResult,
  onBack,
}) => (
  <div className="bisect-result">
    <h2>Result:</h2>
    {bisectResult.result === 'segment_found' ? (
      <>
        <p>Problematic Segment Found</p>
        <div className="segment">{bisectResult.problematicSegment}</div>
      </>
    ) : (
      <>
        <p>{bisectResult.message}</p>
      </>
    )}
    <button type="button" onClick={onBack} className="back-button">
      Back
    </button>
  </div>
);

export default BisectResultDisplay;
