export interface RubricItem {
  id: string;
  category: string;
  maxScore: number;
  description: string;
  subCriteria: string[];
}

export interface StudentInfo {
  name: string;
  studentId: string;
  projectName: string;
}

export interface GradingScore {
  [categoryId: string]: number;
}

export interface GradingComments {
  [categoryId: string]: string;
}

export interface AnalysisResult {
  scores: GradingScore;
  reasoning: GradingComments;
  overallComment: string;
}
