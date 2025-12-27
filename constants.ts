import { RubricItem } from './types';

export const RUBRIC_DATA: RubricItem[] = [
  {
    id: 'creativity',
    category: '1. 创意',
    maxScore: 10,
    description: '主题新颖，构思独特，具有原创性。',
    subCriteria: ['选题新颖', '构思独特', '避免抄袭']
  },
  {
    id: 'storyboard',
    category: '2. 剧本分镜',
    maxScore: 10,
    description: '故事情节完整，分镜设计合理，镜头语言丰富。',
    subCriteria: ['故事完整', '分镜合理', '镜头丰富']
  },
  {
    id: 'modeling',
    category: '3. 素材模型',
    maxScore: 10,
    description: '模型精度达标，布线合理，材质纹理贴合。',
    subCriteria: ['模型质量', '材质纹理', '布线合理']
  },
  {
    id: 'basic_tech',
    category: '4. 常规技术',
    maxScore: 10,
    description: '基础关键帧动画、修改器动画、路径约束等运用熟练。',
    subCriteria: ['关键帧动画', '修改器运用', '基础控制']
  },
  {
    id: 'adv_tech',
    category: '5. 高级技术',
    maxScore: 10,
    description: '骨骼绑定、IK/FK控制、复杂的材质或特效应用。',
    subCriteria: ['骨骼绑定', 'IK/FK', '高级特效']
  },
  {
    id: 'fluency',
    category: '6. 流畅度',
    maxScore: 10,
    description: '整体动画播放流畅，节奏把控得当，无明显卡顿。',
    subCriteria: ['播放流畅', '节奏感', '无卡顿']
  },
  {
    id: 'mechanics',
    category: '7. 运动规律',
    maxScore: 10,
    description: '符合物理运动规律（如重力、惯性、挤压拉伸）。',
    subCriteria: ['符合物理规律', '动作自然', '力学表现']
  },
  {
    id: 'rendering',
    category: '8. 光照渲染',
    maxScore: 10,
    description: '布光考究，阴影真实，渲染清晰无噪点。',
    subCriteria: ['布光合理', '渲染清晰', '无噪点']
  },
  {
    id: 'document',
    category: '9. 论述文档',
    maxScore: 10,
    description: '文档规范，内容详实，能清晰阐述制作流程。 (AI评分仅供参考)',
    subCriteria: ['文档规范', '内容详实', '流程清晰']
  },
  {
    id: 'visual_quality',
    category: '10. 视觉质量',
    maxScore: 10,
    description: '整体画面美观，色彩协调，构图讲究，艺术感强。',
    subCriteria: ['画面美观', '色彩协调', '构图艺术']
  }
];

export const MAX_TOTAL_SCORE = 100;
