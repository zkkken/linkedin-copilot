/**
 * LinkedIn Safe Co-Pilot - Structured Prompts
 *
 * Generate structured JSON prompts for precise LinkedIn optimization
 */

import type { SectionType } from '../types';

/**
 * Create structured optimization prompts that yield JSON output
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
      return `You are a LinkedIn Headline Strategist and Employer Branding Expert. Create 2-3 high-impact headline options optimized for both recruiters and LinkedIn search.

### Objectives
- Communicate professional identity, value proposition, and specialism within 220 characters.
- Include 3-5 high-value keywords naturally.
- Reflect the user's brand tone (Executive, Creative, Analytical, or Collaborative).
- Use separators such as | or • for readability.
- Avoid filler phrases; every word should signal impact.
${jobDescription ? '- Integrate critical keywords from the target job description without sounding forced.\n' : ''}

### Style Guidelines
- Focus on outcomes or positioning ("Helping X achieve Y through Z") instead of repeating the current job title.
- Keep each option under 220 characters.
- Sound credible and specific, not salesy.
- Optionally highlight a differentiator such as industry focus, certification, or leadership scope.

Current headline:
${content}
${jobContext}

OUTPUT FORMAT - Return ONLY valid JSON, no other text:
{
  "suggestions": [
    {
      "type": "Optimization focus (e.g., Keyword optimization, Brand clarity)",
      "reason": "Why this adjustment improves recruiter engagement",
      "improvement": "What changed in the options"
    }
  ],
  "options": [
    "Option 1 text (under 220 characters)",
    "Option 2 text (under 220 characters)",
    "Option 3 text (under 220 characters)"
  ]
}`;

    case 'about':
      return `You are a LinkedIn Profile Strategist and HR-aware Content Optimizer. Convert factual resume input into a natural first-person LinkedIn "About" section that feels credible, authentic, and high-value to recruiters.

### Objectives
- Translate achievements into a cohesive professional story instead of a duty list.
- Balance measurable impact with personality, motivation, or values.
- Optimize for LinkedIn keyword search and recruiter readability.

### Style & Voice
- Write in first person (I) with a confident, human, professional tone.
- Use three short paragraphs (3-5 sentences each) separated by two line breaks.
- Distribute 5-8 industry or role keywords naturally across the section.
- Blend quantified results with collaboration, leadership, or adaptability examples.
- Target 1,800-2,200 characters and trim content that adds no new value.
- Avoid clichés or phrases such as "seeking new opportunities".
${jobDescription ? '- Incorporate critical keywords from the job description across all paragraphs.\n' : ''}

### Structure
1. Opening (~300 characters): career identity, intended audience, core value proposition, at least two keywords.
2. Middle (~900 characters): 3-4 Action → Result stories with metrics plus soft-skill context.
3. Closing (~500 characters): professional philosophy, current focus, and an invitation to connect.

Resume content:
${content}
${jobContext}

OUTPUT FORMAT - Return ONLY valid JSON, no other text:
{
  "suggestions": [
    {
      "type": "Optimization focus (e.g., Hook strengthened, Keyword distribution, Soft skills added)",
      "reason": "Why this change supports recruiter expectations",
      "improvement": "What was added or refined",
      "before": "Original snippet (optional)",
      "after": "Optimized snippet (optional)"
    }
  ],
  "optimizedText": "Three-paragraph narrative with blank lines between paragraphs (\\n\\n). Keep within 2,200 characters.",
  "keyPoints": ["Hook communicates value within first 300 characters", "Results are quantified", "Soft skills are integrated"]
}`;

    case 'experience':
      return `You are a LinkedIn Experience Optimization Specialist with HR expertise. Rewrite each work experience entry for clarity, impact, and recruiter readability.

### Objectives
- Present the role as quantified, action-driven achievements.
- Showcase growth trajectory and leadership or initiative signals.
- Align tone with the user's overall LinkedIn brand (Executive, Analytical, Collaborative, etc.).
- Ensure the first two bullets communicate scale and results.
${jobDescription ? '- Weave in high-priority keywords from the target job description where relevant.\n' : ''}

### Style & Formatting
- Title: under 100 characters.
- Employment Type: Full-time, Part-time, Contract, Internship, or Freelance.
- Company: under 100 characters.
- Description: 5-6 bullets max, plain text, under 2,000 characters.
- Each bullet follows Impact-first STAR (Action verb + Result + Evidence/metric + Brief context).
- Start bullets with strong verbs (Delivered, Spearheaded, Optimized, Transformed).
- Quantify outcomes (% / $ / timeframe / volume) and include meaningful keywords.

Current experience entry:
${content}
${jobContext}

OUTPUT FORMAT - Return ONLY valid JSON, no other text:
{
  "suggestions": [
    {
      "type": "Optimization focus (e.g., Impact-first STAR, Quantified results, Keyword enrichment)",
      "reason": "Why this change improves recruiter scanning",
      "improvement": "What shifted in the description"
    }
  ],
  "title": "Optimized job title (<=100 chars)",
  "employmentType": "Full-time",
  "company": "Company name (<=100 chars)",
  "location": "Location (optional)",
  "description": "• Bullet one\\n• Bullet two\\n• Bullet three\\n• Bullet four"
}`;

    case 'skills':
      return `You are a LinkedIn Skills Strategist and HR talent-taxonomy expert. Organize and refine this skills list for recruiter search visibility and clarity.

### Objectives
- Cluster skills logically to highlight depth and breadth.
- Prioritize high-demand, ATS-recognized keywords.
- Reflect hybrid competency: hard skills, soft skills, and leadership.
- Maintain plain text (no Markdown).
${jobDescription ? '- Prioritize skills that align with the target job description keywords.\n' : ''}

### Structure Rules
1. Group skills into 2-4 categories (for example: Core Finance, Technical Tools, Leadership & Communication).
2. Limit each group to 3-6 concise, recruiter-friendly terms.
3. Use standardized names (e.g., "Financial Reporting" instead of "Finance report").
4. Lead with the most in-demand or target-role-relevant skills.
5. Include a mix of technical capabilities and transferable strengths.

Current skills:
${content}
${jobContext}

OUTPUT FORMAT - Return ONLY valid JSON, no other text:
{
  "suggestions": [
    {
      "type": "Optimization focus (e.g., Categorized & prioritized, Keyword enrichment)",
      "reason": "Why this change improves recruiter keyword matching",
      "improvement": "What was reorganized or emphasized"
    }
  ],
  "categories": [
    { "name": "Category name", "skills": ["Skill 1", "Skill 2"] },
    { "name": "Category name", "skills": ["Skill 3", "Skill 4"] }
  ]
}`;

    case 'education':
      return `You are a LinkedIn Education Optimization Specialist with employer-branding insight. Rewrite this education entry to highlight academic strength and career relevance.

### Objectives
- Emphasize academic excellence, applied projects, and honors.
- Demonstrate how the education supports professional competencies.
- Keep highlights concise (no more than 600 characters).
${jobDescription ? '- Spotlight coursework or projects that align with the target job description.\n' : ''}

### Formatting Rules
- Degree: full official name (<=100 characters).
- Institution: <=100 characters.
- Field of study: include if it supports the career goal.
- GPA: only include if at least 3.5/4.0 or equivalent distinction.
- Highlights: bullet style using •, each on a new line, <=600 characters total.
  - Prioritize capstone work, thesis, competitions, or publications.
  - Quantify outcomes where possible (grades, rankings, awards).
  - Mention scholarships, Dean's List, distinctions.
- Activities (optional): leadership or relevant societies.

Education content:
${content}
${jobContext}

OUTPUT FORMAT - Return ONLY valid JSON, no other text:
{
  "suggestions": [
    {
      "type": "Optimization focus (e.g., Relevance emphasis, Achievement clarity)",
      "reason": "Why this change helps recruiters connect the dots",
      "improvement": "What was highlighted or refined"
    }
  ],
  "degree": "Degree name",
  "school": "Institution name",
  "fieldOfStudy": "Field of study (optional)",
  "grade": "GPA or distinction (optional)",
  "highlights": "• Highlight one\\n• Highlight two\\n• Highlight three",
  "activities": "Relevant clubs or leadership (optional)"
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
      return `You are a LinkedIn Publications Optimization Expert. Rewrite the publication details to highlight contribution, credibility, and real-world relevance.

### Objectives
- Communicate the publication's impact, not just the title.
- Indicate audience and practical value (who benefits and why).
- Keep the description under 500 characters.

### Style Rules
- Title: full name, under 100 characters.
- Publisher: under 100 characters.
- Date: Month Year (optional).
- Description: 1-2 sentences focusing on key insight and relevance; use accessible language.
- URL: include only if provided; do not fabricate links.
${jobDescription ? '- Emphasize insights that align with the target job description or industry focus.\n' : ''}

Publication content:
${content}
${jobContext}

OUTPUT FORMAT - Return ONLY valid JSON, no other text:
{
  "suggestions": [
    {
      "type": "Optimization focus (e.g., Audience framing, Impact clarity)",
      "reason": "Why this change clarifies value for recruiters and peers",
      "improvement": "What was sharpened in the entry"
    }
  ],
  "title": "Publication title",
  "publisher": "Publisher name",
  "date": "Month Year",
  "description": "One to two sentences that show impact and audience relevance.",
  "url": ""
}`;

    case 'honors-awards':
      return `You are a LinkedIn Honors & Awards Strategist. Rewrite this award entry to highlight significance and competitive achievement.

### Objectives
- Clarify why the recognition matters and how selective it was.
- Quantify recognition (top %, number of recipients, scope).
- Keep the description under 300 characters with a concise impact statement.
${jobDescription ? '- Emphasize accomplishments that align with the target job description.\n' : ''}

### Style Rules
- Title: under 100 characters.
- Issuer: under 100 characters.
- Date: Month Year (optional).
- Description: plain text, ≤300 characters.
  - Explain achievement criteria or measurable outcome.
  - Highlight business or organizational impact if relevant.

Award content:
${content}
${jobContext}

OUTPUT FORMAT - Return ONLY valid JSON, no other text:
{
  "suggestions": [
    {
      "type": "Optimization focus (e.g., Selectivity emphasis, Impact clarity)",
      "reason": "Why this strengthens credibility",
      "improvement": "What context or metrics were added"
    }
  ],
  "title": "Award title",
  "issuer": "Issuing organization",
  "date": "Month Year",
  "description": "Description that conveys selectivity and impact."
}`;

    case 'volunteer-experience':
      return `You are a LinkedIn Volunteer Experience Optimization Expert. Rewrite this entry to highlight contribution, leadership, and transferable skills.

### Objectives
- Connect volunteer impact to professional competencies.
- Show initiative, collaboration, or leadership.
- Keep the description under 600 characters.
${jobDescription ? '- Reinforce skills that appear in the target job description.\n' : ''}

### Style Rules
- Role: under 100 characters.
- Organization: under 100 characters.
- Description: 3-4 bullets or concise sentences, plain text.
  - Use strong verbs (Led, Organized, Supported, Trained).
  - Quantify impact (people reached, funds raised, hours contributed).
  - Link outcomes to soft skills (teamwork, adaptability, empathy).
- Cause and date are optional but helpful context.

Volunteer content:
${content}
${jobContext}

OUTPUT FORMAT - Return ONLY valid JSON, no other text:
{
  "suggestions": [
    {
      "type": "Optimization focus (e.g., Transferable skills emphasis, Impact quantified)",
      "reason": "Why this framing resonates with recruiters",
      "improvement": "What was clarified or added"
    }
  ],
  "role": "Volunteer role",
  "organization": "Organization name",
  "cause": "Cause area (optional)",
  "date": "Month Year - Month Year",
  "description": "• Bullet one\n• Bullet two\n• Bullet three"
}`;
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
 * Parse the JSON returned by Gemini
 * Handle potential Markdown wrappers and formatting issues
 */
export const parseStructuredResponse = (
  responseText: string,
  sectionType: SectionType
): any => {
  try {
    // Remove possible Markdown code block markers
    let cleanedText = responseText.trim();

    // Strip ```json and ``` fences if present
    cleanedText = cleanedText.replace(/^```json\s*/i, '');
    cleanedText = cleanedText.replace(/^```\s*/, '');
    cleanedText = cleanedText.replace(/\s*```$/, '');
    cleanedText = cleanedText.trim();

    // Attempt to parse the JSON
    let parsed: any = JSON.parse(cleanedText);

    // Validate structure based on section type
    switch (sectionType) {
      case 'headline':
        if (!parsed.options || !Array.isArray(parsed.options)) {
          throw new Error('Invalid headline structure');
        }
        // Ensure each option is within 220 characters
        parsed.options = parsed.options.map((opt: string) =>
          opt.length > 220 ? opt.substring(0, 217) + '...' : opt
        );
        break;

      case 'about':
        if (!parsed.optimizedText) {
          throw new Error('Invalid about structure');
        }
        // Ensure About text stays within 2600 characters
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
        // Enforce character limits
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
        // Enforce character limits
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
        // Enforce character limits
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
        // Enforce character limits
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
        // Enforce character limits
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
        // Enforce character limits
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
    }

    // 🔧 Ensure suggestions array exists for backward compatibility
    if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) {
      parsed.suggestions = [];
    }

    return parsed;

  } catch (error) {
    console.error('JSON parse failed:', error);
    console.log('Raw response:', responseText);

    // Fallback: return plain text format
    return {
      plainText: responseText,
      _fallback: true
    };
  }
};

/**
 * Remove Markdown formatting from text
 */
export const cleanMarkdown = (text: string): string => {
  return text
    .replace(/\*\*/g, '')      // Remove bold markers
    .replace(/\*/g, '')        // Remove italics
    .replace(/#{1,6}\s/g, '')  // Remove heading markers
    .replace(/`{1,3}/g, '')    // Remove inline code markers
    .replace(/^\s*[-*+]\s/gm, '• ')  // Normalize bullet symbols to •
    .trim();
};
