import React, { useState } from 'react';
import { Sparkles, Loader2, Download, RefreshCw, FileVideo } from 'lucide-react';
import { RUBRIC_DATA, MAX_TOTAL_SCORE } from './constants';
import { GradingScore, GradingComments } from './types';
import { analyzeAnimationFrames } from './services/geminiService';

import VideoUploader from './components/VideoUploader';
import CriteriaRow from './components/CriteriaRow';

const App: React.FC = () => {
  // Removed studentInfo state object
  const [fileName, setFileName] = useState<string>('');

  const [scores, setScores] = useState<GradingScore>(
    RUBRIC_DATA.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
  );

  const [comments, setComments] = useState<GradingComments>(
    RUBRIC_DATA.reduce((acc, item) => ({ ...acc, [item.id]: '' }), {})
  );

  const [capturedFrames, setCapturedFrames] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasGraded, setHasGraded] = useState(false);
  const [overallComment, setOverallComment] = useState<string>('');

  const totalScore = Object.values(scores).reduce((a: number, b: number) => a + b, 0);

  const handleVideoLoaded = (file: File) => {
    setFileName(file.name);
    // Reset grading when new video is loaded
    if (hasGraded) handleReset(false);
  };

  const handleAiAnalysis = async () => {
    if (capturedFrames.length === 0) return alert("请先上传视频");
    if (!process.env.API_KEY) return alert("API Key missing");

    setIsAnalyzing(true);
    try {
      // Pass filename as context
      const result = await analyzeAnimationFrames(capturedFrames, `Filename: ${fileName}`);
      setScores(result.scores);
      setComments(result.reasoning);
      setOverallComment(result.overallComment);
      setHasGraded(true);
    } catch (error) {
      console.error(error);
      alert("评分失败，请重试");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = () => {
    // Attempt to parse filename
    let studentId = "未识别";
    let studentName = "未识别";
    let projectTitle = fileName.split('.')[0];

    // Pattern: 123456_Name_Title
    const parts = fileName.split('.')[0].split(/[_| \-]/);
    if (parts.length >= 3) {
      studentId = parts[0];
      studentName = parts[1];
      projectTitle = parts.slice(2).join('_');
    }

    const report = `# 期末作品评分报告

**学生信息**

- 学号：${studentId}
- 姓名：${studentName}
- 作品名：${projectTitle}

**评分汇总**

| 评分项 | 满分 | 得分 | 评语/扣分原因 |
| :--- | :---: | :---: | :--- |
| **1. 创意 (10分)** | 10 | **${scores['creativity'] || 0}** | ${comments['creativity'] || '无'} |
| **2. 剧本分镜 (10分)** | 10 | **${scores['storyboard'] || 0}** | ${comments['storyboard'] || '无'} |
| **3. 素材模型 (10分)** | 10 | **${scores['modeling'] || 0}** | ${comments['modeling'] || '无'} |
| **4. 常规技术 (10分)** | 10 | **${scores['basic_tech'] || 0}** | ${comments['basic_tech'] || '无'} |
| **5. 高级技术 (10分)** | 10 | **${scores['adv_tech'] || 0}** | ${comments['adv_tech'] || '无'} |
| **6. 流畅度 (10分)** | 10 | **${scores['fluency'] || 0}** | ${comments['fluency'] || '无'} |
| **7. 运动规律 (10分)** | 10 | **${scores['mechanics'] || 0}** | ${comments['mechanics'] || '无'} |
| **8. 光照渲染 (10分)** | 10 | **${scores['rendering'] || 0}** | ${comments['rendering'] || '无'} |
| **9. 论述文档 (10分)** | 10 | **${scores['document'] || 0}** | ${comments['document'] || '无'} |
| **10. 视觉质量 (10分)** | 10 | **${scores['visual_quality'] || 0}** | ${comments['visual_quality'] || '无'} |
| **提交规范扣分** | 0 | **0** | 无 |

**总分：${totalScore}**

**综合点评：**
${overallComment || '无'}
`;

    // Create a blob and trigger download
    const blob = new Blob([report], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName || 'score_report'}_grading_report.md`;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = (clearVideo = true) => {
    setScores(RUBRIC_DATA.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {}));
    setComments(RUBRIC_DATA.reduce((acc, item) => ({ ...acc, [item.id]: '' }), {}));
    setHasGraded(false);
    if (clearVideo) {
      setCapturedFrames([]);
      setFileName('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-blue-200 shadow-md">
            <span className="font-bold text-sm">AI</span>
          </div>
          <h1 className="text-lg font-bold">3D Animation Grader</h1>
        </div>
        <div className="flex gap-2">
          {hasGraded && (
            <button
              onClick={() => handleReset(true)}
              className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">重新开始</span>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="grid lg:grid-cols-12 gap-6 items-start">

          {/* Left Column: Video Player & Controls (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <VideoUploader
              onVideoLoaded={handleVideoLoaded}
              onFramesCaptured={setCapturedFrames}
            />

            {/* Analysis Action Area */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">当前文件</h3>
                <div className="flex items-center gap-2 text-slate-800 font-medium truncate">
                  <FileVideo className="w-5 h-5 text-blue-500" />
                  <span className="truncate" title={fileName || "未选择文件"}>
                    {fileName || "请上传视频文件..."}
                  </span>
                </div>
              </div>

              <button
                onClick={handleAiAnalysis}
                disabled={isAnalyzing || capturedFrames.length === 0}
                className={`w-full py-3 rounded-lg font-bold text-base flex items-center justify-center gap-2 transition-all transform active:scale-95
                  ${isAnalyzing
                    ? 'bg-slate-100 text-slate-400 cursor-wait'
                    : capturedFrames.length > 0
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
              >
                {isAnalyzing ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                {isAnalyzing ? "正在分析画面..." : "开始 AI 评分"}
              </button>
            </div>

            {/* Total Score Summary (Visible when graded) */}
            {hasGraded && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4">
                <div className="text-xs text-slate-400 uppercase font-bold mb-2">总评分</div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-6xl font-black tracking-tighter ${totalScore >= 90 ? 'text-green-600' :
                    totalScore >= 75 ? 'text-blue-600' :
                      totalScore >= 60 ? 'text-amber-500' : 'text-red-500'
                    }`}>
                    {totalScore}
                  </span>
                  <span className="text-slate-400 font-medium">/ {MAX_TOTAL_SCORE}</span>
                </div>

                <button
                  onClick={handleExport}
                  className="mt-6 w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium text-sm shadow-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  导出评分报告
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Grading Report */}
          <div className="lg:col-span-7 space-y-4">
            {!hasGraded ? (
              <div className="h-[400px] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                  <Sparkles className="w-8 h-8" />
                </div>
                <p>评分报告将在此处生成</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-3">
                <div className="flex items-center justify-between px-2 mb-2">
                  <h2 className="text-lg font-bold text-slate-800">评分明细</h2>
                </div>
                {RUBRIC_DATA.map((item) => (
                  <CriteriaRow
                    key={item.id}
                    item={item}
                    score={scores[item.id]}
                    comment={comments[item.id]}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
