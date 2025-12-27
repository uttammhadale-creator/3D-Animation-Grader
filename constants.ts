import { RubricItem } from './types';

export const RUBRIC_DATA: RubricItem[] = [
  {
    id: 'theme',
    category: '1. 主题内容要求',
    maxScore: 10,
    description: '使用 3ds Max 制作，主题不限但需健康。完整表达主题。',
    subCriteria: [
      '选题内容健康，围绕主题完整表达',
      '尽可能原创，非盗用',
      '如有参考需说明参考资料'
    ]
  },
  {
    id: 'model',
    category: '2. 模型要求',
    maxScore: 10,
    description: '模型质量、原创性/引用规范及风格统一性。',
    subCriteria: [
      '原创模型需提供参考图',
      '自建/网络/AI生成模型需提供文档/链接/步骤',
      '符合动画需求，比例合理，材质纹理贴合'
    ]
  },
  {
    id: 'tech',
    category: '3. 动画技术要求',
    maxScore: 20,
    description: '考察关键帧、修改器、约束控制、IK及骨骼绑定。',
    subCriteria: [
      '基础：关键帧动画、修改器动画、约束控制',
      '提高：IK反向动力学、骨骼绑定完成复杂角色动画'
    ]
  },
  {
    id: 'motion',
    category: '4. 动画运动规律要求',
    maxScore: 20,
    description: '符合物理规律，流畅自然，镜头语言。',
    subCriteria: [
      '加速度、速度合理，符合物理规律（缓动曲线）',
      '整体流畅，动作自然',
      '镜头切换平滑，有真实动态感'
    ]
  },
  {
    id: 'workload',
    category: '5. 工作量要求',
    maxScore: 10,
    description: '时长限制与工作量平衡。',
    subCriteria: [
      '总时长 30秒 - 90秒',
      '若无IK/骨骼绑定，需适当增加时长以保证工作量',
      '不超过90秒'
    ]
  },
  {
    id: 'render',
    category: '6. 渲染输出要求',
    maxScore: 10,
    description: '光影效果、画质与分辨率。',
    subCriteria: [
      '光源与渲染设置符合风格',
      '无明显噪点和错误',
      '分辨率不小于 640x360'
    ]
  },
  {
    id: 'visual',
    category: '7. 综合视觉效果要求',
    maxScore: 10,
    description: '色彩、构图、细节的整体艺术表现。',
    subCriteria: [
      '色彩运用合理',
      '构图和细节到位',
      '整体视觉效果良好'
    ]
  },
  {
    id: 'submission',
    category: '8. 提交文件要求',
    maxScore: 10,
    description: '文件格式、命名规范及压缩包大小。',
    subCriteria: [
      '包含 .max 源文件及贴图',
      'MP4 格式视频，命名：完整学号_姓名_作品名.mp4',
      'Docx 论述文档，命名：完整学号_姓名_作品名.docx',
      'Zip 包结构正确，大小不超过 500M'
    ]
  }
];

export const MAX_TOTAL_SCORE = 100;
