import React from 'react';
import { StudentInfo } from '../types';
import { User, FileText, Hash } from 'lucide-react';

interface StudentInfoFormProps {
  info: StudentInfo;
  onChange: (info: StudentInfo) => void;
}

const StudentInfoForm: React.FC<StudentInfoFormProps> = ({ info, onChange }) => {
  const handleChange = (field: keyof StudentInfo, value: string) => {
    onChange({ ...info, [field]: value });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-600" />
        学生信息
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Hash className="w-3 h-3" /> 学号
          </label>
          <input
            type="text"
            value={info.studentId}
            onChange={(e) => handleChange('studentId', e.target.value)}
            placeholder="2023..."
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <User className="w-3 h-3" /> 姓名
          </label>
          <input
            type="text"
            value={info.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="张三"
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <FileText className="w-3 h-3" /> 作品名称
          </label>
          <input
            type="text"
            value={info.projectName}
            onChange={(e) => handleChange('projectName', e.target.value)}
            placeholder="动画短片标题"
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition"
          />
        </div>
      </div>
    </div>
  );
};

export default StudentInfoForm;
