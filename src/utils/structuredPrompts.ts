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
      return `You are a LinkedIn Education Optimization Specialist. The content below may contain ONE or MULTIPLE education entries. Optimize each entry to highlight academic strength and career relevance.

IMPORTANT:
- If you detect MULTIPLE education entries in the content, return an array format: {"educations": [{...}, {...}]}
- If only ONE education entry is found, return single object format: {single education object}
- Detect education boundaries by looking for: new school names, different degrees, or clear separation

### Objectives for each entry
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
If MULTIPLE education entries detected:
{
  "educations": [
    {
      "suggestions": [...],
      "degree": "Master of Science",
      "school": "Stanford University",
      "fieldOfStudy": "Computer Science",
      "grade": "3.9/4.0",
      "highlights": "• Led research team on AI project\\n• Published 2 papers",
      "activities": "CS Club President"
    },
    {
      "suggestions": [...],
      "degree": "Bachelor of Engineering",
      "school": "MIT",
      "fieldOfStudy": "Electrical Engineering",
      "grade": "3.8/4.0",
      "highlights": "• Dean's List all semesters\\n• Won hackathon",
      "activities": "IEEE Member"
    }
  ]
}

If SINGLE education entry detected:
{
  "suggestions": [...],
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
      return `You are a LinkedIn projects expert. The content below may contain ONE or MULTIPLE projects. Optimize each project using the STAR method.

IMPORTANT:
- If you detect MULTIPLE projects in the content, return an array format: {"projects": [{...}, {...}]}
- If only ONE project is found, return single object format: {single project object}
- Detect project boundaries by looking for: new project titles, dates, or clear separation between projects

STRICT RULES for each project:
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
If MULTIPLE projects detected:
{
  "projects": [
    {
      "suggestions": [...],
      "name": "Project 1 Name",
      "role": "Your Role",
      "date": "Jan 2023 - Jun 2023",
      "description": "Project 1 description with STAR method",
      "technologies": ["Tech1", "Tech2"]
    },
    {
      "suggestions": [...],
      "name": "Project 2 Name",
      "role": "Your Role",
      "date": "Jul 2023 - Dec 2023",
      "description": "Project 2 description with STAR method",
      "technologies": ["Tech3", "Tech4"]
    }
  ]
}

If SINGLE project detected:
{
  "suggestions": [...],
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
        // AI might return: experiences, optimized_experiences, or direct array
        const candidateArray = Array.isArray(parsed?.experiences)
          ? parsed.experiences
          : Array.isArray(parsed?.optimized_experiences)
          ? parsed.optimized_experiences
          : Array.isArray(parsed)
          ? parsed
          : parsed && parsed.title
          ? [parsed]
          : [];

        console.log('[Parser] Experience candidates:', candidateArray.length, 'entries found');

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

      case 'education': {
        // Handle both single education and array of educations
        const candidateArray = Array.isArray(parsed?.educations)
          ? parsed.educations
          : Array.isArray(parsed)
          ? parsed
          : parsed && parsed.degree
          ? [parsed]
          : [];

        if (!candidateArray || candidateArray.length === 0) {
          throw new Error('Invalid education structure: no education entries found');
        }

        const sanitizedEducations = candidateArray
          .filter(
            (item: any) =>
              item && typeof item.degree === 'string' && typeof item.school === 'string'
          )
          .map((item: any) => {
            const education = { ...item };
            // Enforce character limits
            if (education.degree && education.degree.length > 100) {
              education.degree = education.degree.substring(0, 97) + '...';
            }
            if (education.school && education.school.length > 100) {
              education.school = education.school.substring(0, 97) + '...';
            }
            // Make highlights optional with default
            if (!education.highlights) {
              education.highlights = '';
            } else if (education.highlights.length > 600) {
              education.highlights = education.highlights.substring(0, 597) + '...';
            }
            // Optional fields
            if (!education.fieldOfStudy) education.fieldOfStudy = '';
            if (!education.grade) education.grade = '';
            if (!education.activities) education.activities = '';
            return education;
          });

        if (!sanitizedEducations.length) {
          throw new Error('Invalid education structure: no valid education entries after filtering');
        }

        parsed = sanitizedEducations.length === 1 ? sanitizedEducations[0] : { educations: sanitizedEducations };
        break;
      }

      case 'licenses-certifications': {
        // Handle both single certification and array of certifications
        const candidateArray = Array.isArray(parsed?.certifications)
          ? parsed.certifications
          : Array.isArray(parsed)
          ? parsed
          : parsed && parsed.name
          ? [parsed]
          : [];

        if (!candidateArray || candidateArray.length === 0) {
          throw new Error('Invalid certification structure: no certifications found');
        }

        const sanitizedCertifications = candidateArray
          .filter(
            (item: any) =>
              item && typeof item.name === 'string' && typeof item.organization === 'string'
          )
          .map((item: any) => {
            const cert = { ...item };
            // Enforce character limits
            if (cert.name && cert.name.length > 100) {
              cert.name = cert.name.substring(0, 97) + '...';
            }
            if (cert.organization && cert.organization.length > 100) {
              cert.organization = cert.organization.substring(0, 97) + '...';
            }
            // Make description optional with default
            if (!cert.description) {
              cert.description = '';
            } else if (cert.description.length > 200) {
              cert.description = cert.description.substring(0, 197) + '...';
            }
            // Optional fields
            if (!cert.issueDate) cert.issueDate = '';
            if (!cert.credentialId) cert.credentialId = '';
            return cert;
          });

        if (!sanitizedCertifications.length) {
          throw new Error('Invalid certification structure: no valid certifications after filtering');
        }

        parsed = sanitizedCertifications.length === 1 ? sanitizedCertifications[0] : { certifications: sanitizedCertifications };
        break;
      }

      case 'projects': {
        // AI might return: projects, optimized_projects, or direct array
        const candidateArray = Array.isArray(parsed?.projects)
          ? parsed.projects
          : Array.isArray(parsed?.optimized_projects)
          ? parsed.optimized_projects
          : Array.isArray(parsed)
          ? parsed
          : parsed && parsed.name
          ? [parsed]
          : [];

        console.log('[Parser] Projects candidates:', candidateArray.length, 'entries found');

        if (!candidateArray || candidateArray.length === 0) {
          throw new Error('Invalid project structure: no projects found');
        }

        const sanitizedProjects = candidateArray
          .filter(
            (item: any) =>
              item && typeof item.name === 'string'
          )
          .map((item: any) => {
            const project = { ...item };
            // Enforce character limits
            if (project.name && project.name.length > 100) {
              project.name = project.name.substring(0, 97) + '...';
            }
            // Make description optional with default
            if (!project.description) {
              project.description = '';
            } else if (project.description && project.description.length > 1000) {
              project.description = project.description.substring(0, 997) + '...';
            }
            // Optional fields with defaults
            if (!project.role) project.role = '';
            if (!project.date) project.date = '';
            if (!project.technologies) project.technologies = [];
            return project;
          });

        if (!sanitizedProjects.length) {
          throw new Error('Invalid project structure: no valid projects after filtering');
        }

        parsed = sanitizedProjects.length === 1 ? sanitizedProjects[0] : { projects: sanitizedProjects };
        break;
      }

      case 'publications': {
        // Handle both single publication and array of publications
        const candidateArray = Array.isArray(parsed?.publications)
          ? parsed.publications
          : Array.isArray(parsed)
          ? parsed
          : parsed && parsed.title
          ? [parsed]
          : [];

        if (!candidateArray || candidateArray.length === 0) {
          throw new Error('Invalid publication structure: no publications found');
        }

        const sanitizedPublications = candidateArray
          .filter(
            (item: any) =>
              item && typeof item.title === 'string' && typeof item.publisher === 'string'
          )
          .map((item: any) => {
            const publication = { ...item };
            // Enforce character limits
            if (publication.title && publication.title.length > 100) {
              publication.title = publication.title.substring(0, 97) + '...';
            }
            if (publication.publisher && publication.publisher.length > 100) {
              publication.publisher = publication.publisher.substring(0, 97) + '...';
            }
            // Make description optional with default
            if (!publication.description) {
              publication.description = '';
            } else if (publication.description.length > 500) {
              publication.description = publication.description.substring(0, 497) + '...';
            }
            // Optional fields
            if (!publication.date) publication.date = '';
            if (!publication.url) publication.url = '';
            return publication;
          });

        if (!sanitizedPublications.length) {
          throw new Error('Invalid publication structure: no valid publications after filtering');
        }

        parsed = sanitizedPublications.length === 1 ? sanitizedPublications[0] : { publications: sanitizedPublications };
        break;
      }

      case 'honors-awards': {
        // Handle both single award and array of awards
        const candidateArray = Array.isArray(parsed?.awards)
          ? parsed.awards
          : Array.isArray(parsed)
          ? parsed
          : parsed && parsed.title
          ? [parsed]
          : [];

        if (!candidateArray || candidateArray.length === 0) {
          throw new Error('Invalid award structure: no awards found');
        }

        const sanitizedAwards = candidateArray
          .filter(
            (item: any) =>
              item && typeof item.title === 'string' && typeof item.issuer === 'string'
          )
          .map((item: any) => {
            const award = { ...item };
            // Enforce character limits
            if (award.title && award.title.length > 100) {
              award.title = award.title.substring(0, 97) + '...';
            }
            if (award.issuer && award.issuer.length > 100) {
              award.issuer = award.issuer.substring(0, 97) + '...';
            }
            // Make description optional with default
            if (!award.description) {
              award.description = '';
            } else if (award.description.length > 300) {
              award.description = award.description.substring(0, 297) + '...';
            }
            // Optional fields
            if (!award.date) award.date = '';
            return award;
          });

        if (!sanitizedAwards.length) {
          throw new Error('Invalid award structure: no valid awards after filtering');
        }

        parsed = sanitizedAwards.length === 1 ? sanitizedAwards[0] : { awards: sanitizedAwards };
        break;
      }

      case 'volunteer-experience': {
        // Handle both single volunteer entry and array of volunteer experiences
        const candidateArray = Array.isArray(parsed?.volunteerExperiences)
          ? parsed.volunteerExperiences
          : Array.isArray(parsed)
          ? parsed
          : parsed && parsed.role
          ? [parsed]
          : [];

        if (!candidateArray || candidateArray.length === 0) {
          throw new Error('Invalid volunteer structure: no volunteer experiences found');
        }

        const sanitizedVolunteer = candidateArray
          .filter(
            (item: any) =>
              item && typeof item.role === 'string' && typeof item.organization === 'string'
          )
          .map((item: any) => {
            const volunteer = { ...item };
            // Enforce character limits
            if (volunteer.role && volunteer.role.length > 100) {
              volunteer.role = volunteer.role.substring(0, 97) + '...';
            }
            if (volunteer.organization && volunteer.organization.length > 100) {
              volunteer.organization = volunteer.organization.substring(0, 97) + '...';
            }
            // Make description optional with default
            if (!volunteer.description) {
              volunteer.description = '';
            } else if (volunteer.description.length > 600) {
              volunteer.description = volunteer.description.substring(0, 597) + '...';
            }
            // Optional fields
            if (!volunteer.cause) volunteer.cause = '';
            if (!volunteer.date) volunteer.date = '';
            return volunteer;
          });

        if (!sanitizedVolunteer.length) {
          throw new Error('Invalid volunteer structure: no valid volunteer experiences after filtering');
        }

        parsed = sanitizedVolunteer.length === 1 ? sanitizedVolunteer[0] : { volunteerExperiences: sanitizedVolunteer };
        break;
      }
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
