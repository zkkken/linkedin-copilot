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
    label: '工作经历',
    placeholder: '粘贴某段工作经历的描述...',
    description: '使用 STAR 方法优化工作成就',
    rows: 5,
    icon: '💼',
  },
  skills: {
    id: 'skills',
    label: '技能描述',
    placeholder: '列出您的技能和专业领域...',
    description: '整理并增强技能描述，提高可见性',
    rows: 4,
    icon: '⚡',
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
