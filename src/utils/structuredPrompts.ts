/**
 * LinkedIn Safe Co-Pilot - Structured Prompts
 *
 * 生成返回结构化JSON的AI提示，用于LinkedIn各字段的精确优化
 */

import type { SectionType } from '../types';

/**
 * 生成结构化的优化提示（返回JSON格式）
 */
export const generateStructuredPrompt = (
  sectionType: SectionType,
  content: string,
  jobDescription?: string
): string => {
  const jobContext = jobDescription
    ? `\n\nTarget Job Description (use this to extract relevant keywords):\n${jobDescription}\n`
    : '';

  switch (sectionType) {
    case 'headline':
      return `You are a LinkedIn headline optimization expert. Generate 2-3 compelling headline options.

STRICT RULES:
1. Each option MUST be under 220 characters
2. Include 3-5 relevant keywords
3. Use separators (| or •) for readability
4. Focus on value proposition, not generic terms
5. Be specific and results-oriented
${jobDescription ? '6. Incorporate keywords from the job description' : ''}

Current Headline:
${content}
${jobContext}

OUTPUT FORMAT - Return ONLY valid JSON, no other text:
{
  "options": [
    "Option 1 text here (under 220 chars)",
    "Option 2 text here (under 220 chars)",
    "Option 3 text here (under 220 chars)"
  ]
}`;

    case 'about':
      return `You are a LinkedIn About section expert. Rewrite this to be engaging and professional.

STRICT RULES:
1. MUST be under 2600 characters total
2. Start with a strong hook
3. Tell a compelling story with achievements
4. Use short paragraphs (2-3 sentences)
5. Include 3-5 quantified achievements
6. End with a call-to-action
7. Use first-person ("I", not "he/she")
8. NO markdown formatting (**, ##, etc.) - plain text only
${jobDescription ? '9. Weave in keywords from job description naturally' : ''}

Current About Section:
${content}
${jobContext}

OUTPUT FORMAT - Return ONLY valid JSON, no other text:
{
  "optimizedText": "The complete optimized About section text here as plain text with paragraph breaks using \\n\\n",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"]
}`;

    case 'experience':
      return `You are a LinkedIn work experience optimization expert. Structure this work experience for maximum impact.

STRICT RULES:
1. Title: MUST be under 100 characters
2. Employment Type: Choose ONE from: Full-time, Part-time, Contract, Internship, Freelance
3. Company: MUST be under 100 characters
4. Description: MUST be under 2000 characters
5. Description format: Use bullet points with • symbol, each on new line
6. Each bullet: Use STAR method (Situation, Task, Action, Result)
7. Lead with action verbs (Led, Spearheaded, Drove, Delivered, etc.)
8. Quantify results (numbers, %, timeframes)
9. NO markdown formatting (**, ##, etc.) - plain text only
${jobDescription ? '10. Incorporate 5+ keywords from job description' : ''}

Work Experience Content:
${content}
${jobContext}

OUTPUT FORMAT - Return ONLY valid JSON, no other text:
{
  "title": "Job title (max 100 chars)",
  "employmentType": "Full-time",
  "company": "Company name (max 100 chars)",
  "location": "City, Country (optional)",
  "description": "• Achievement bullet 1 with quantified results\\n• Achievement bullet 2 with STAR method\\n• Achievement bullet 3 showing business impact\\n• Achievement bullet 4 with specific numbers"
}`;

    case 'skills':
      return `You are a LinkedIn skills optimization expert. Organize these skills for maximum visibility.

STRICT RULES:
1. Categorize into 2-4 logical groups
2. Prioritize in-demand skills
3. Use industry-standard terminology
4. Include both hard and soft skills
5. NO markdown formatting - plain text only
${jobDescription ? '6. Emphasize skills from job description' : ''}

Current Skills:
${content}
${jobContext}

OUTPUT FORMAT - Return ONLY valid JSON, no other text:
{
  "categories": [
    {
      "name": "Technical Skills",
      "skills": ["Skill 1", "Skill 2", "Skill 3"]
    },
    {
      "name": "Leadership & Soft Skills",
      "skills": ["Skill 1", "Skill 2"]
    }
  ]
}`;

    case 'general':
    default:
      return `You are a LinkedIn optimization expert. Enhance this content to be more impactful.

RULES:
1. Use STAR method where applicable
2. Quantify achievements with numbers
3. Use strong action verbs
4. Be specific and measurable
5. Keep it professional and concise
6. NO markdown formatting (**, ##, etc.) - plain text only
${jobDescription ? '7. Incorporate relevant keywords from job description' : ''}

Content to Optimize:
${content}
${jobContext}

OUTPUT FORMAT - Return ONLY valid JSON, no other text:
{
  "plainText": "The optimized content as plain text here"
}`;
  }
};

/**
 * 解析Gemini返回的JSON字符串
 * 处理可能的Markdown代码块包裹和格式问题
 */
export const parseStructuredResponse = (
  responseText: string,
  sectionType: SectionType
): any => {
  try {
    // 清理可能的Markdown代码块标记
    let cleanedText = responseText.trim();

    // 移除可能的 ```json 和 ``` 标记
    cleanedText = cleanedText.replace(/^```json\s*/i, '');
    cleanedText = cleanedText.replace(/^```\s*/, '');
    cleanedText = cleanedText.replace(/\s*```$/, '');
    cleanedText = cleanedText.trim();

    // 尝试解析JSON
    const parsed = JSON.parse(cleanedText);

    // 验证结构
    switch (sectionType) {
      case 'headline':
        if (!parsed.options || !Array.isArray(parsed.options)) {
          throw new Error('Invalid headline structure');
        }
        // 确保每个选项都在220字符内
        parsed.options = parsed.options.map((opt: string) =>
          opt.length > 220 ? opt.substring(0, 217) + '...' : opt
        );
        break;

      case 'about':
        if (!parsed.optimizedText) {
          throw new Error('Invalid about structure');
        }
        // 确保在2600字符内
        if (parsed.optimizedText.length > 2600) {
          parsed.optimizedText = parsed.optimizedText.substring(0, 2597) + '...';
        }
        break;

      case 'experience':
        if (!parsed.title || !parsed.employmentType || !parsed.company || !parsed.description) {
          throw new Error('Invalid experience structure');
        }
        // 确保字符限制
        if (parsed.title.length > 100) {
          parsed.title = parsed.title.substring(0, 97) + '...';
        }
        if (parsed.company.length > 100) {
          parsed.company = parsed.company.substring(0, 97) + '...';
        }
        if (parsed.description.length > 2000) {
          parsed.description = parsed.description.substring(0, 1997) + '...';
        }
        break;

      case 'skills':
        if (!parsed.categories || !Array.isArray(parsed.categories)) {
          throw new Error('Invalid skills structure');
        }
        break;

      case 'general':
        if (!parsed.plainText) {
          throw new Error('Invalid general structure');
        }
        break;
    }

    return parsed;

  } catch (error) {
    console.error('JSON解析失败:', error);
    console.log('原始响应:', responseText);

    // 降级处理：返回纯文本格式
    return {
      plainText: responseText,
      _fallback: true
    };
  }
};

/**
 * 清理文本中的Markdown格式标记
 */
export const cleanMarkdown = (text: string): string => {
  return text
    .replace(/\*\*/g, '')      // 移除粗体 **
    .replace(/\*/g, '')        // 移除斜体 *
    .replace(/#{1,6}\s/g, '')  // 移除标题 #
    .replace(/`{1,3}/g, '')    // 移除代码标记 `
    .replace(/^\s*[-*+]\s/gm, '• ')  // 统一列表符号为 •
    .trim();
};
