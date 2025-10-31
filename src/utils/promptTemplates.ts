/**
 * LinkedIn Safe Co-Pilot - AI Prompt Templates
 *
 * 为不同类型的 LinkedIn 内容生成专门的 AI 提示
 */

import type { SectionType } from '../types';

/**
 * 为不同的字段类型生成优化提示
 */
export const generatePrompt = (
  sectionType: SectionType,
  content: string,
  jobDescription?: string
): string => {
  const baseContext = jobDescription
    ? `\n\nTARGET JOB DESCRIPTION (incorporate relevant keywords):\n${jobDescription}\n`
    : '';

  switch (sectionType) {
    case 'headline':
      return `Act as a LinkedIn branding expert. Optimize the following LinkedIn headline to be more compelling and keyword-rich.

Rules:
1. Keep it under 220 characters (LinkedIn limit)
2. Include 3-5 relevant keywords for searchability
3. Show unique value proposition
4. Use separators (| or •) for readability
5. Avoid generic terms like "professional" or "expert" without context
6. Make it specific and results-oriented
${jobDescription ? '7. Incorporate keywords from the job description naturally' : ''}

Current Headline:
${content}
${baseContext}

Provide 2-3 optimized headline options, each on a new line starting with "Option 1:", "Option 2:", etc.`;

    case 'about':
      return `Act as a LinkedIn storytelling expert. Rewrite the "About" section to be more engaging and professional.

Rules:
1. Start with a strong opening hook that captures attention
2. Tell a compelling professional story (who you are, what you do, why it matters)
3. Include 3-5 key achievements with numbers/metrics
4. Keep paragraphs short (2-3 sentences max)
5. End with a clear call-to-action (e.g., "Let's connect if...")
6. Use first-person narrative ("I" not "he/she")
7. Stay under 2600 characters (LinkedIn limit)
${jobDescription ? '8. Weave in relevant keywords from the job description' : ''}

Current About Section:
${content}
${baseContext}

Provide the optimized "About" section as a cohesive narrative, maintaining natural flow.`;

    case 'experience':
      return `Act as an expert career coach specializing in resume optimization for ATS and LinkedIn. Optimize the work experience description using the STAR method.

Rules:
1. Use STAR method: Situation, Task, Action, Result for each bullet point
2. Lead with powerful action verbs (Led, Spearheaded, Architected, Drove, Delivered, etc.)
3. Quantify results with specific numbers, percentages, or timeframes
4. Make achievements specific and measurable
5. Keep each bullet point to 1-2 lines
6. Show impact on business outcomes (revenue, efficiency, quality, etc.)
${jobDescription ? '7. Incorporate 5+ relevant keywords from the job description' : '7. Use industry-standard keywords'}

Work Experience to Optimize:
${content}
${baseContext}

Provide 4-6 optimized bullet points, each starting with • symbol. Focus on achievements over responsibilities.`;

    case 'skills':
      return `Act as a LinkedIn skills optimization expert. Organize and enhance the skills section for maximum visibility and impact.

Rules:
1. Categorize skills into 3-4 groups (e.g., Technical, Leadership, Domain Expertise)
2. Prioritize in-demand and relevant skills
3. Use industry-standard terminology
4. Include both hard skills and soft skills
5. Add context where helpful (e.g., "Python (5+ years)" or "Team Leadership (managed 10+)")
${jobDescription ? '6. Emphasize skills mentioned in the job description' : '6. Focus on marketable skills'}

Current Skills:
${content}
${baseContext}

Provide organized skill categories with bulleted items. Format as:
**Category Name**
• Skill 1
• Skill 2
etc.`;

    case 'general':
    default:
      return `Act as an expert career coach specializing in LinkedIn profile optimization. Enhance the following content to be more impactful and professional.

Rules:
1. Use the STAR method where applicable (Situation, Task, Action, Result)
2. Focus on quantifiable achievements with specific numbers
3. Start with powerful action verbs
4. Make statements specific and measurable
5. Keep language professional and concise
${jobDescription ? '6. Incorporate relevant keywords from the job description' : '6. Use industry-standard keywords'}

Content to Optimize:
${content}
${baseContext}

Provide the optimized content as clean, professional bullet points or paragraphs as appropriate.`;
  }
};

/**
 * 检测内容类型（如果用户没有手动选择）
 */
export const detectSectionType = (content: string): SectionType => {
  const lowerContent = content.toLowerCase();

  // 检测标题（通常很短，包含 | 或特定关键词）
  if (
    content.length < 150 &&
    (content.includes('|') || content.includes('•'))
  ) {
    return 'headline';
  }

  // 检测工作经历（包含职责、任务相关词汇）
  if (
    lowerContent.includes('responsible') ||
    lowerContent.includes('worked on') ||
    lowerContent.includes('developed') ||
    lowerContent.includes('managed') ||
    lowerContent.includes('负责') ||
    lowerContent.includes('开发') ||
    lowerContent.includes('管理')
  ) {
    return 'experience';
  }

  // 检测技能（列表格式或包含技能关键词）
  if (
    lowerContent.includes('skills') ||
    lowerContent.includes('proficient') ||
    lowerContent.includes('技能') ||
    lowerContent.includes('擅长') ||
    (content.split('\n').length > 5 && content.split('\n').every(line => line.length < 50))
  ) {
    return 'skills';
  }

  // 检测个人简介（较长的段落格式）
  if (content.length > 300 && content.split('\n\n').length > 2) {
    return 'about';
  }

  // 默认返回通用类型
  return 'general';
};

/**
 * 获取字数统计和推荐
 */
export const getCharacterCount = (
  content: string,
  sectionType: SectionType
): { count: number; limit?: number; status: 'good' | 'warning' | 'error' } => {
  const count = content.length;
  let limit: number | undefined;
  let status: 'good' | 'warning' | 'error' = 'good';

  switch (sectionType) {
    case 'headline':
      limit = 220;
      if (count > limit) status = 'error';
      else if (count > limit * 0.9) status = 'warning';
      break;

    case 'about':
      limit = 2600;
      if (count > limit) status = 'error';
      else if (count > limit * 0.9) status = 'warning';
      break;

    default:
      // 其他字段没有严格限制
      break;
  }

  return { count, limit, status };
};
