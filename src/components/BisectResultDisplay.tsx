import { type FC } from 'react';
import './BisectResultDisplay.css';
import { BisectResult } from '../api/bisect';

interface BisectResultDisplayProps {
    bisectResult: BisectResult;
    onBack: () => void;
}

const BisectResultDisplay: FC<BisectResultDisplayProps> = ({ bisectResult, onBack }) => (
    <div className="bisect-result">
        <h2>Result:</h2>
        {bisectResult.result === 'segment_found' ? (
            <>
                <p>{`Problematic Segment:`}</p>
                <div>{bisectResult.problematicSegment}</div>
            </>
        ) : (
            <div>{bisectResult.message}</div>
        )}
        <button onClick={onBack} className="back-button">
            Back
        </button>
    </div>
);

export default BisectResultDisplay;
