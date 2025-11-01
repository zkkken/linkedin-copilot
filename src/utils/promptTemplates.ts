/**
 * LinkedIn Safe Co-Pilot - AI Prompt Templates
 * Generate tailored AI prompts for different LinkedIn sections.
 */

import type { SectionType } from '../types';

/**
 * Produce an optimization prompt based on section type.
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
 * Attempt to detect section type when the user has not selected one.
 */
export const detectSectionType = (content: string): SectionType => {
  const lowerContent = content.toLowerCase();

  // Headline: typically short and contains separators or branding keywords
  if (
    content.length < 150 &&
    (content.includes('|') || content.includes('•'))
  ) {
    return 'headline';
  }

  // Experience: mentions responsibilities, actions, or achievements
  if (
    lowerContent.includes('responsible') ||
    lowerContent.includes('worked on') ||
    lowerContent.includes('developed') ||
    lowerContent.includes('managed') ||
    lowerContent.includes('delivered')
  ) {
    return 'experience';
  }

  // Skills: list-like structure or skill-specific vocabulary
  if (
    lowerContent.includes('skills') ||
    lowerContent.includes('proficient') ||
    lowerContent.includes('expertise') ||
    (content.split('\n').length > 5 && content.split('\n').every(line => line.length < 50))
  ) {
    return 'skills';
  }

  // About: longer narrative with multiple paragraphs
  if (content.length > 300 && content.split('\n\n').length > 2) {
    return 'about';
  }

  return 'about';
};

/**
 * Character count helper with LinkedIn guidance.
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
      break;
  }

  return { count, limit, status };
};
