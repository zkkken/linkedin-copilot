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
  "suggestions": [
    {
      "type": "Optimization type (e.g., Add quantification, Keyword optimization)",
      "reason": "Why this change improves the headline",
      "improvement": "What was improved"
    }
  ],
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
  "suggestions": [
    {
      "type": "Optimization type (e.g., Added story hook, Quantified achievements)",
      "reason": "Why this change improves the About section",
      "improvement": "What was improved"
    }
  ],
  "optimizedText": "The complete optimized About section text here as plain text with paragraph breaks using \\n\\n",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"]
}`;

    case 'experience':
      return `You are a LinkedIn work experience optimization expert. Structure each work experience entry for maximum impact.

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
10. If multiple roles/positions/projects are detected, optimize EACH ONE separately
${jobDescription ? '11. Incorporate 5+ keywords from job description' : ''}

Work Experience Content:
${content}
${jobContext}

OUTPUT FORMAT - Return ONLY valid JSON, no other text:
{
  "suggestions": [
    {
      "type": "Optimization type (e.g., STAR method applied, Quantified impact)",
      "reason": "Why this change improves the experience",
      "improvement": "What was improved"
    }
  ],
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
  "suggestions": [
    {
      "type": "Optimization type (e.g., Categorized skills, Prioritized in-demand skills)",
      "reason": "Why this change improves skills presentation",
      "improvement": "What was improved"
    }
  ],
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

    case 'education':
      return `You are a LinkedIn education section expert. Optimize this educational background to highlight academic achievements and relevant experience.

STRICT RULES:
1. Degree: Full degree name (max 100 chars)
2. School: Institution name (max 100 chars)
3. Field of Study: Optional, include if relevant
4. Grade: Only include if GPA ≥ 3.5/4.0 or equivalent distinction
5. Highlights: MUST be under 600 characters
   - Use bullet points with • symbol
   - Include relevant coursework, academic projects, honors
   - Quantify achievements where possible
6. Activities: Optional extracurricular activities
7. NO markdown formatting (**, ##, etc.) - plain text only
${jobDescription ? '8. Emphasize courses/projects relevant to target role' : ''}

Education Content:
${content}
${jobContext}

OUTPUT FORMAT - Return ONLY valid JSON, no other text:
{
  "suggestions": [
    {
      "type": "Optimization type (e.g., Highlighted relevant coursework, Quantified achievements)",
      "reason": "Why this change improves education presentation",
      "improvement": "What was improved"
    }
  ],
  "degree": "Bachelor of Science in Computer Science",
  "school": "University Name",
  "fieldOfStudy": "Computer Science",
  "grade": "GPA: 3.8/4.0",
  "highlights": "• Relevant coursework: Machine Learning, Data Structures, Algorithms\\n• Capstone project: Built a recommendation system serving 10K+ users\\n• Dean's List (3 semesters)\\n• Published research paper on neural networks",
  "activities": "President of Computer Science Club, Hackathon organizer"
}`;

    case 'licenses-certifications':
      return `You are a LinkedIn Licenses & Certifications expert. Optimize this certification to clearly convey its value and relevance.

STRICT RULES:
1. Name: Certification full name (max 100 chars)
2. Organization: Issuing body (max 100 chars)
3. Issue Date: Optional, format as "Month Year"
4. Credential ID: Optional, include if available (if provided in input, otherwise leave empty)
5. Description: MUST be under 200 characters
   - Application scenario + Capability boundary (two-sentence method)
   - Focus on practical application and what it enables you to do
   - NO marketing fluff or generic statements
6. NO markdown formatting - plain text only
${jobDescription ? '7. Highlight relevance to target role' : ''}

Certification Content:
${content}
${jobContext}

OUTPUT FORMAT - Return ONLY valid JSON, no other text:
{
  "suggestions": [
    {
      "type": "Optimization type (e.g., Clarified application scope, Added capability boundary)",
      "reason": "Why this change improves certification presentation",
      "improvement": "What was improved"
    }
  ],
  "name": "AWS Certified Solutions Architect - Professional",
  "organization": "Amazon Web Services (AWS)",
  "issueDate": "January 2024",
  "credentialId": "ABC123XYZ",
  "description": "Validates ability to design and deploy scalable, highly available systems on AWS with advanced networking and security implementation."
}`;

    case 'projects':
      return `You are a LinkedIn projects expert. Optimize this project description using the STAR method to showcase impact.

STRICT RULES:
1. Name: Project title (max 100 chars)
2. Role: Your role in the project (optional but recommended)
3. Date: Project timeframe (optional)
4. Description: MUST be under 1000 characters
   - Structure: Situation/Background → Task/Challenge → Action → Result/Impact
   - Use bullet points with • symbol for key points
   - Quantify outcomes with specific metrics
   - Focus on YOUR contributions, not just project overview
5. Technologies: Optional array of technologies used
6. NO markdown formatting (**, ##, etc.) - plain text only
${jobDescription ? '7. Highlight technologies and skills relevant to target role' : ''}

Project Content:
${content}
${jobContext}

OUTPUT FORMAT - Return ONLY valid JSON, no other text:
{
  "suggestions": [
    {
      "type": "Optimization type (e.g., Applied STAR method, Quantified impact)",
      "reason": "Why this change improves project presentation",
      "improvement": "What was improved"
    }
  ],
  "name": "E-commerce Platform Modernization",
  "role": "Lead Developer",
  "date": "Jan 2023 - Jun 2023",
  "description": "Led the migration of a legacy monolithic e-commerce platform to microservices architecture.\\n\\n• Challenge: System handled 50K daily users but suffered frequent downtime and slow checkout\\n• Actions: Designed and implemented 12 microservices using Node.js and Docker, introduced API gateway, implemented Redis caching\\n• Results: Reduced page load time by 65%, achieved 99.9% uptime, increased conversion rate by 23%, system now handles 200K+ daily users",
  "technologies": ["Node.js", "Docker", "Kubernetes", "Redis", "PostgreSQL", "React"]
}`;

    case 'publications':
      return `You are a LinkedIn publications expert. Optimize this publication entry to clearly convey its significance.

STRICT RULES:
1. Title: Full publication title (max 100 chars)
2. Publisher: Publishing organization or platform (max 100 chars)
3. Date: Publication date (optional), format as "Month Year"
4. Description: MUST be under 500 characters
   - One to two sentences summarizing the key contribution or findings
   - Who is the target audience and why it matters
   - Avoid academic jargon, use accessible language
5. URL: Do NOT generate fake URLs, only include if provided
6. NO markdown formatting - plain text only

Publication Content:
${content}
${jobContext}

OUTPUT FORMAT - Return ONLY valid JSON, no other text:
{
  "suggestions": [
    {
      "type": "Optimization type (e.g., Clarified key contribution, Added impact metrics)",
      "reason": "Why this change improves publication presentation",
      "improvement": "What was improved"
    }
  ],
  "title": "Scalable Machine Learning Pipelines for Real-Time Analytics",
  "publisher": "ACM Computing Surveys",
  "date": "March 2024",
  "description": "Presents a novel framework for building ML pipelines that process streaming data with sub-100ms latency. Aimed at data engineers and ML practitioners working with real-time systems. Cited by 45+ papers in the first 6 months.",
  "url": ""
}`;

    case 'honors-awards':
      return `You are a LinkedIn Honors & Awards expert. Optimize this award entry to highlight achievement and significance.

STRICT RULES:
1. Title: Award name (max 100 chars)
2. Issuer: Organization that gave the award (max 100 chars)
3. Date: When you received it (optional), format as "Month Year"
4. Description: MUST be under 300 characters
   - WHY you received it (the achievement or criteria)
   - Evaluation criteria or selection ratio if available (e.g., "top 5%", "1 of 10 recipients")
   - Impact or significance of the achievement
   - Avoid just restating the award name
5. NO markdown formatting - plain text only
${jobDescription ? '6. Emphasize achievements relevant to target role' : ''}

Award Content:
${content}
${jobContext}

OUTPUT FORMAT - Return ONLY valid JSON, no other text:
{
  "suggestions": [
    {
      "type": "Optimization type (e.g., Added selection criteria, Quantified achievement impact)",
      "reason": "Why this change improves award presentation",
      "improvement": "What was improved"
    }
  ],
  "title": "Top Innovator Award 2024",
  "issuer": "Tech Corporation",
  "date": "December 2024",
  "description": "Awarded to top 5 employees company-wide (out of 5,000+) for developing an AI-driven cost optimization system that saved $2.3M annually and improved operational efficiency by 40%."
}`;

    case 'volunteer-experience':
      return `You are a LinkedIn Volunteer Experience expert. Optimize this volunteer experience to showcase contribution, impact, and transferable skills.

STRICT RULES:
1. Role: Your volunteer role/title (max 100 chars)
2. Organization: Organization name (max 100 chars)
3. Cause: Area of focus (optional), e.g., "Education", "Environment"
4. Date: Time period (optional)
5. Description: MUST be under 600 characters
   - Structure: Context → Your contribution → Impact achieved
   - Use bullet points with • symbol for key accomplishments
   - Quantify impact where possible (people helped, funds raised, etc.)
   - EMPHASIZE transferable skills (leadership, project management, communication, etc.)
   - Show how volunteer work demonstrates professional capabilities
6. NO markdown formatting (**, ##, etc.) - plain text only
${jobDescription ? '7. Highlight skills relevant to target role' : ''}

Volunteer Content:
${content}
${jobContext}

OUTPUT FORMAT - Return ONLY valid JSON, no other text:
{
  "suggestions": [
    {
      "type": "Optimization type (e.g., Quantified impact, Highlighted transferable skills)",
      "reason": "Why this change improves volunteer experience presentation",
      "improvement": "What was improved"
    }
  ],
  "role": "Technical Mentor",
  "organization": "Code for Good Foundation",
  "cause": "Education",
  "date": "2022 - Present",
  "description": "Mentor underrepresented youth in software development through weekly coding workshops.\\n\\n• Designed curriculum covering web development fundamentals (HTML, CSS, JavaScript)\\n• Mentored 45+ students, with 78% completing the program\\n• 15 students secured internships at tech companies\\n• Organized 3 hackathons with 200+ participants"
}`;

    case 'general':
    default:
      return `You are a LinkedIn optimization expert. Enhance this content to be more impactful.

RULES:
1. Identify content type first:
   - For work achievements/projects/volunteer work: Use STAR method (Situation, Task, Action, Result)
   - For descriptions/summaries: Focus on clarity and impact
   - For lists (skills, courses): Organize and prioritize
2. Quantify achievements with numbers where possible
3. Use strong action verbs (Led, Developed, Achieved, etc.)
4. Be specific and measurable
5. Keep it professional and concise
6. NO markdown formatting (**, ##, etc.) - plain text only
${jobDescription ? '7. Incorporate relevant keywords from job description' : ''}

Content to Optimize:
${content}
${jobContext}

OUTPUT FORMAT - Return ONLY valid JSON, no other text:
{
  "suggestions": [
    {
      "type": "Optimization type (e.g., Applied STAR method, Added quantification)",
      "reason": "Why this change improves the content",
      "improvement": "What was improved"
    }
  ],
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
    let parsed: any = JSON.parse(cleanedText);

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

      case 'experience': {
        const candidateArray = Array.isArray(parsed?.experiences)
          ? parsed.experiences
          : Array.isArray(parsed)
          ? parsed
          : parsed && parsed.title
          ? [parsed]
          : [];

        if (!candidateArray || candidateArray.length === 0) {
          throw new Error('Invalid experience structure');
        }

        const sanitizedExperiences = candidateArray
          .filter(
            (item: any) =>
              item &&
              typeof item.title === 'string' &&
              typeof item.company === 'string' &&
              typeof item.description === 'string'
          )
          .map((item: any) => {
            const experience = { ...item };
            if (experience.title.length > 100) {
              experience.title = experience.title.substring(0, 97) + '...';
            }
            if (experience.company.length > 100) {
              experience.company = experience.company.substring(0, 97) + '...';
            }
            if (experience.description.length > 2000) {
              experience.description = experience.description.substring(0, 1997) + '...';
            }
            if (experience.location && experience.location.length > 120) {
              experience.location = experience.location.substring(0, 117) + '...';
            }
            if (!experience.employmentType) {
              experience.employmentType = 'Full-time';
            }
            return experience;
          });

        if (!sanitizedExperiences.length) {
          throw new Error('Invalid experience structure');
        }

        parsed = { experiences: sanitizedExperiences };
        break;
      }

      case 'skills':
        if (!parsed.categories || !Array.isArray(parsed.categories)) {
          throw new Error('Invalid skills structure');
        }
        break;

      case 'education':
        if (!parsed.degree || !parsed.school || !parsed.highlights) {
          throw new Error('Invalid education structure');
        }
        // 确保字符限制
        if (parsed.degree.length > 100) {
          parsed.degree = parsed.degree.substring(0, 97) + '...';
        }
        if (parsed.school.length > 100) {
          parsed.school = parsed.school.substring(0, 97) + '...';
        }
        if (parsed.highlights.length > 600) {
          parsed.highlights = parsed.highlights.substring(0, 597) + '...';
        }
        break;

      case 'licenses-certifications':
        if (!parsed.name || !parsed.organization || !parsed.description) {
          throw new Error('Invalid certification structure');
        }
        // 确保字符限制
        if (parsed.name.length > 100) {
          parsed.name = parsed.name.substring(0, 97) + '...';
        }
        if (parsed.organization.length > 100) {
          parsed.organization = parsed.organization.substring(0, 97) + '...';
        }
        if (parsed.description.length > 200) {
          parsed.description = parsed.description.substring(0, 197) + '...';
        }
        break;

      case 'projects':
        if (!parsed.name || !parsed.description) {
          throw new Error('Invalid project structure');
        }
        // 确保字符限制
        if (parsed.name.length > 100) {
          parsed.name = parsed.name.substring(0, 97) + '...';
        }
        if (parsed.description.length > 1000) {
          parsed.description = parsed.description.substring(0, 997) + '...';
        }
        break;

      case 'publications':
        if (!parsed.title || !parsed.publisher || !parsed.description) {
          throw new Error('Invalid publication structure');
        }
        // 确保字符限制
        if (parsed.title.length > 100) {
          parsed.title = parsed.title.substring(0, 97) + '...';
        }
        if (parsed.publisher.length > 100) {
          parsed.publisher = parsed.publisher.substring(0, 97) + '...';
        }
        if (parsed.description.length > 500) {
          parsed.description = parsed.description.substring(0, 497) + '...';
        }
        break;

      case 'honors-awards':
        if (!parsed.title || !parsed.issuer || !parsed.description) {
          throw new Error('Invalid award structure');
        }
        // 确保字符限制
        if (parsed.title.length > 100) {
          parsed.title = parsed.title.substring(0, 97) + '...';
        }
        if (parsed.issuer.length > 100) {
          parsed.issuer = parsed.issuer.substring(0, 97) + '...';
        }
        if (parsed.description.length > 300) {
          parsed.description = parsed.description.substring(0, 297) + '...';
        }
        break;

      case 'volunteer-experience':
        if (!parsed.role || !parsed.organization || !parsed.description) {
          throw new Error('Invalid volunteer structure');
        }
        // 确保字符限制
        if (parsed.role.length > 100) {
          parsed.role = parsed.role.substring(0, 97) + '...';
        }
        if (parsed.organization.length > 100) {
          parsed.organization = parsed.organization.substring(0, 97) + '...';
        }
        if (parsed.description.length > 600) {
          parsed.description = parsed.description.substring(0, 597) + '...';
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
