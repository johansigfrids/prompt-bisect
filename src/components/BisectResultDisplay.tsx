import { type FC } from 'react';
import './BisectResultDisplay.css';
import { BisectResult } from '../api/bisect';

interface BisectResultDisplayProps {
    bisectResult: BisectResult;
}

const BisectResultDisplay: FC<BisectResultDisplayProps> = ({ bisectResult }) => (
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
    </div>
);

export default BisectResultDisplay;
