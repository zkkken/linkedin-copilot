/**
 * LinkedIn Safe Co-Pilot - Type Definitions
 *
 * 定义项目中使用的所有 TypeScript 类型
 */

/**
 * LinkedIn 个人资料的不同部分
 */
export type SectionType =
  | 'headline'
  | 'about'
  | 'experience'
  | 'education'
  | 'certifications'
  | 'skills'
  | 'projects'
  | 'publications'
  | 'awards'
  | 'volunteer'
  | 'recommendations'
  | 'general';

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
 * LinkedIn 教育经历结构化输出
 */
export interface LinkedInEducationStructured {
  degree: string;             // 学位名称 (e.g., "Bachelor of Science in Computer Science")
  school: string;             // 学校名称 (max 100 chars)
  fieldOfStudy?: string;      // 专业领域 (可选)
  grade?: string;             // GPA或成绩 (可选，仅当≥3.5时建议显示)
  highlights: string;         // 亮点内容：课程、项目、成就 (max 600 chars, bullet points)
  activities?: string;        // 课外活动 (可选)
}

/**
 * LinkedIn 证书认证结构化输出
 */
export interface LinkedInCertificationStructured {
  name: string;               // 证书名称 (max 100 chars)
  organization: string;       // 颁发机构 (max 100 chars)
  issueDate?: string;         // 颁发日期 (可选)
  credentialId?: string;      // 证书ID (可选)
  description: string;        // 适用场景/能力边界说明 (max 200 chars)
}

/**
 * LinkedIn 项目经历结构化输出
 */
export interface LinkedInProjectStructured {
  name: string;               // 项目名称 (max 100 chars)
  role?: string;              // 项目角色 (可选)
  date?: string;              // 项目时间 (可选)
  description: string;        // 项目描述：背景→动作→成果 (max 1000 chars, STAR方法)
  technologies?: string[];    // 使用的技术栈 (可选)
}

/**
 * LinkedIn 出版物结构化输出
 */
export interface LinkedInPublicationStructured {
  title: string;              // 标题 (max 100 chars)
  publisher: string;          // 出版商/平台 (max 100 chars)
  date?: string;              // 发表日期 (可选)
  description: string;        // 简介 (max 500 chars)
  url?: string;               // URL占位 (可选，不自动生成)
}

/**
 * LinkedIn 荣誉奖项结构化输出
 */
export interface LinkedInAwardStructured {
  title: string;              // 奖项名称 (max 100 chars)
  issuer: string;             // 颁发机构 (max 100 chars)
  date?: string;              // 获奖日期 (可选)
  description: string;        // 获奖原因/意义 (max 300 chars)
}

/**
 * LinkedIn 志愿经历结构化输出
 */
export interface LinkedInVolunteerStructured {
  role: string;               // 志愿角色 (max 100 chars)
  organization: string;       // 组织名称 (max 100 chars)
  cause?: string;             // 公益领域 (可选)
  date?: string;              // 时间 (可选)
  description: string;        // 经历描述：背景→贡献→影响 (max 600 chars)
}

/**
 * LinkedIn 推荐摘要结构化输出
 */
export interface LinkedInRecommendationStructured {
  summary: string;            // 已有推荐的亮点摘要 (max 300 chars)
  keyThemes: string[];        // 提炼的关键主题 (e.g., ["Leadership", "Technical Expertise"])
  note: string;               // 说明：基于已有推荐总结，非生成
}

/**
 * 通用结构化优化输出（联合类型）
 */
export type StructuredOptimizationResult =
  | LinkedInExperienceStructured
  | LinkedInHeadlineStructured
  | LinkedInAboutStructured
  | LinkedInSkillsStructured
  | LinkedInEducationStructured
  | LinkedInCertificationStructured
  | LinkedInProjectStructured
  | LinkedInPublicationStructured
  | LinkedInAwardStructured
  | LinkedInVolunteerStructured
  | LinkedInRecommendationStructured
  | { plainText: string };    // 降级处理：纯文本
