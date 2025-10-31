/**
 * LinkedIn Safe Co-Pilot - Section Configurations
 *
 * LinkedIn 不同部分的配置定义
 */

import type { SectionConfig, SectionType } from '../types';

/**
 * LinkedIn 各部分的配置
 */
export const SECTION_CONFIGS: Record<SectionType, SectionConfig> = {
  general: {
    id: 'general',
    label: '通用内容',
    placeholder: '粘贴您想优化的任何 LinkedIn 内容...',
    description: '适用于任何需要优化的内容',
    rows: 5,
    icon: '📝',
  },
  headline: {
    id: 'headline',
    label: 'LinkedIn 标题',
    placeholder: '例如：软件工程师 | 全栈开发 | React & Node.js 专家',
    description: 'LinkedIn 个人资料标题（显示在姓名下方）',
    maxLength: 220,
    rows: 2,
    icon: '🎯',
  },
  about: {
    id: 'about',
    label: '个人简介 (About)',
    placeholder: '粘贴您的 LinkedIn 个人简介内容...',
    description: '讲述您的职业故事，展示专业价值',
    maxLength: 2600,
    rows: 6,
    icon: '👤',
  },
  experience: {
    id: 'experience',
    label: '工作经历 (Experience)',
    placeholder: '粘贴某段工作经历的描述...',
    description: '使用 STAR 方法优化工作成就',
    rows: 5,
    icon: '💼',
  },
  education: {
    id: 'education',
    label: '教育经历 (Education)',
    placeholder: '粘贴您的教育背景信息（学位、学校、专业、成绩、课程、项目等）...',
    description: '强调相关课程、学术项目和成就',
    maxLength: 600,
    rows: 5,
    icon: '🎓',
  },
  'licenses-certifications': {
    id: 'licenses-certifications',
    label: '证书认证 (Licenses & Certifications)',
    placeholder: '粘贴您的证书信息（证书名称、颁发机构、日期等）...',
    description: 'LinkedIn官方：Licenses & certifications。规范化证书标题，增强适用场景说明',
    maxLength: 200,
    rows: 3,
    icon: '📜',
  },
  skills: {
    id: 'skills',
    label: '技能 (Skills)',
    placeholder: '列出您的技能和专业领域...',
    description: '整理并增强技能描述，提高可见性',
    rows: 4,
    icon: '⚡',
  },
  projects: {
    id: 'projects',
    label: '项目 (Projects)',
    placeholder: '粘贴项目信息（项目名称、角色、时间、描述、成果等）...',
    description: 'Accomplishments 子分区。展示项目背景、你的行动和最终成果（建议字数上限：1000字符，便于快速浏览）',
    maxLength: 1000,
    rows: 5,
    icon: '🚀',
  },
  publications: {
    id: 'publications',
    label: '出版物 (Publications)',
    placeholder: '粘贴出版物信息（标题、出版商、日期、简介等）...',
    description: 'Accomplishments 子分区。展示学术或行业出版物（建议字数上限：500字符）',
    maxLength: 500,
    rows: 4,
    icon: '📚',
  },
  'honors-awards': {
    id: 'honors-awards',
    label: '荣誉奖项 (Honors & Awards)',
    placeholder: '粘贴奖项信息（奖项名称、颁发机构、日期、获奖原因等）...',
    description: 'LinkedIn官方：Honors & awards (Accomplishments 子分区)。突出获奖原因、评选标准和意义（建议字数上限：300字符）',
    maxLength: 300,
    rows: 3,
    icon: '🏆',
  },
  'volunteer-experience': {
    id: 'volunteer-experience',
    label: '志愿经历 (Volunteer Experience)',
    placeholder: '粘贴志愿活动信息（角色、组织、时间、贡献等）...',
    description: 'LinkedIn官方：Volunteer experience。展示志愿服务中的贡献、影响和可迁移技能（建议字数上限：600字符）',
    maxLength: 600,
    rows: 4,
    icon: '🤝',
  },
};

/**
 * 获取字段配置
 */
export const getSectionConfig = (sectionType: SectionType): SectionConfig => {
  return SECTION_CONFIGS[sectionType];
};

/**
 * 获取所有字段的选项列表（用于下拉选择）
 */
export const getSectionOptions = (): Array<{ value: SectionType; label: string; icon: string }> => {
  return Object.values(SECTION_CONFIGS).map(config => ({
    value: config.id,
    label: config.label,
    icon: config.icon,
  }));
};
