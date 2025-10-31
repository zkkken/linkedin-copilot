/**
 * LinkedIn Safe Co-Pilot - Type Definitions
 *
 * 定义项目中使用的所有 TypeScript 类型
 */

/**
 * LinkedIn 个人资料的不同部分
 */
export type SectionType = 'headline' | 'about' | 'experience' | 'skills' | 'general';

/**
 * 字段配置接口
 */
export interface SectionConfig {
  id: SectionType;
  label: string;
  placeholder: string;
  description: string;
  maxLength?: number;      // LinkedIn 推荐的最大长度
  rows: number;            // 文本框行数
  icon: string;            // 图标 emoji 或 SVG 路径
}

/**
 * AI 优化的 Prompt 模板接口
 */
export interface PromptTemplate {
  role: string;            // AI 角色设定
  rules: string[];         // 优化规则
  outputFormat: string;    // 输出格式要求
}

/**
 * 应用状态接口
 */
export interface AppState {
  resumeContent: string;
  jobDescription: string;
  optimizedText: string;
  isLoading: boolean;
  error?: string;
  currentSection: SectionType;
  uploadedFileName?: string;
}

/**
 * LinkedIn 工作经历结构化输出接口
 */
export interface LinkedInExperienceStructured {
  title: string;              // 职位头衔 (max 100 chars)
  employmentType: string;     // 职位性质: Full-time | Part-time | Contract | Internship | Freelance
  company: string;            // 公司名称 (max 100 chars)
  location?: string;          // 地点 (可选)
  description: string;        // 工作描述 (bullet points, max 2000 chars)
}

/**
 * LinkedIn 标题优化结构化输出
 */
export interface LinkedInHeadlineStructured {
  options: string[];          // 多个优化选项 (each max 220 chars)
}

/**
 * LinkedIn 个人简介优化结构化输出
 */
export interface LinkedInAboutStructured {
  optimizedText: string;      // 优化后的完整文本 (max 2600 chars)
  keyPoints?: string[];       // 关键亮点提取（可选）
}

/**
 * LinkedIn 技能优化结构化输出
 */
export interface LinkedInSkillsStructured {
  categories: {
    name: string;             // 类别名称（如"技术技能"）
    skills: string[];         // 该类别下的技能列表
  }[];
}

/**
 * 通用结构化优化输出（联合类型）
 */
export type StructuredOptimizationResult =
  | LinkedInExperienceStructured
  | LinkedInHeadlineStructured
  | LinkedInAboutStructured
  | LinkedInSkillsStructured
  | { plainText: string };    // 降级处理：纯文本
