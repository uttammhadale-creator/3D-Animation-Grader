import React from 'react';
import { MAX_TOTAL_SCORE } from '../constants';
import { Download, Copy, RefreshCw } from 'lucide-react';

interface SummaryCardProps {
  totalScore: number;
  onReset: () => void;
  onExport: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ totalScore, onReset, onExport }) => {
  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-200';
    if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const gradeStyle = getGradeColor(totalScore);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sticky top-6">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">总评分</h3>
      
      <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 mb-6 ${gradeStyle}`}>
        <span className="text-6xl font-bold tracking-tighter">
          {totalScore}
        </span>
        <span className="text-sm font-medium mt-1 opacity-80">
          / {MAX_TOTAL_SCORE} 分
        </span>
      </div>

      <div className="space-y-3">
        <button 
          onClick={onExport}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
        >
          <Download className="w-4 h-4" />
          导出评分报告
        </button>

        <button 
          onClick={onReset}
          className="w-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          重置
        </button>
      </div>
      
      <div className="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-400 text-center">
        福建师范大学协和学院<br/>2025-2026 学年第一学期
      </div>
    </div>
  );
};

export default SummaryCard;
