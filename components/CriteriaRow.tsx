import React from 'react';
import { RubricItem } from '../types';

interface CriteriaRowProps {
  item: RubricItem;
  score: number;
  comment: string;
  isAiSuggesting?: boolean;
}

const CriteriaRow: React.FC<CriteriaRowProps> = ({ 
  item, 
  score, 
  comment,
  isAiSuggesting 
}) => {
  const isPerfect = score === item.maxScore;
  const hasScore = score > 0;

  return (
    <div className={`p-4 rounded-lg border transition-all duration-300 ${hasScore ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-80'}`}>
      <div className="flex justify-between items-start gap-4">
        {/* Left: Criteria Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-slate-800">{item.category}</h4>
            <span className="text-xs font-mono text-slate-400">/ {item.maxScore} pts</span>
          </div>
          <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
        </div>

        {/* Right: Score Display */}
        <div className="flex flex-col items-end min-w-[60px]">
          <div className={`text-2xl font-bold font-mono ${isPerfect ? 'text-green-600' : hasScore ? 'text-blue-600' : 'text-slate-300'}`}>
            {score}
          </div>
        </div>
      </div>

      {/* Bottom: AI Comment */}
      {(comment || isAiSuggesting) && (
        <div className={`mt-3 p-3 rounded-md text-sm leading-relaxed ${isAiSuggesting ? 'bg-amber-50 text-amber-800 animate-pulse' : 'bg-slate-50 text-slate-700'}`}>
          {comment || "Waiting for analysis..."}
        </div>
      )}
    </div>
  );
};

export default CriteriaRow;