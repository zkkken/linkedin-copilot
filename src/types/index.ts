/**
 * LinkedIn Safe Co-Pilot - Type Definitions
 * Defines every TypeScript contract used by the project.
 */

/**
 * Optimization suggestion item returned by AI.
 */
export interface OptimizationSuggestion {
  type: string;           // e.g., "Add quantification", "Keyword optimization"
  reason: string;         // Why this change is recommended
  improvement: string;    // What was improved
  before?: string;        // Optional original snippet
  after?: string;         // Optional revised snippet
}

/**
 * LinkedIn profile sections (official naming conventions).
 */
export type SectionType =
  | 'general'
  | 'headline'
  | 'about'
  | 'experience'
  | 'education'
  | 'licenses-certifications'
  | 'skills'
  | 'projects'
  | 'publications'
  | 'honors-awards'
  | 'volunteer-experience';

/**
 * Section configuration descriptor.
 */
export interface SectionConfig {
  id: SectionType;
  label: string;
  placeholder: string;
  description: string;
  maxLength?: number;      // LinkedIn recommended length
  rows: number;            // Default textarea rows
  icon: string;            // Emoji or icon descriptor
}

/**
 * Prompt template contract for AI interactions.
 */
export interface PromptTemplate {
  role: string;
  rules: string[];
  outputFormat: string;
}

/**
 * Application state structure.
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
 * Structured LinkedIn experience output.
 */
export interface LinkedInExperienceStructured {
  suggestions: OptimizationSuggestion[];
  title: string;              // Job title (max 100 chars)
  employmentType: string;     // Full-time | Part-time | Contract | Internship | Freelance
  company: string;            // Company name (max 100 chars)
  location?: string;          // Optional location
  description: string;        // Bullet list description (max 2000 chars)
}

/** Structured headline output. */
export interface LinkedInHeadlineStructured {
  suggestions: OptimizationSuggestion[];
  options: string[];          // Up to 3 options (<=220 chars each)
}

/** Structured About section output. */
export interface LinkedInAboutStructured {
  suggestions: OptimizationSuggestion[];
  optimizedText: string;      // Full narrative (max 2600 chars)
  keyPoints?: string[];       // Optional highlight list
}

/** Structured skills output. */
export interface LinkedInSkillsStructured {
  suggestions: OptimizationSuggestion[];
  categories: {
    name: string;             // Category name (e.g., "Technical Skills")
    skills: string[];         // Skills in that category
  }[];
}

/** Structured education output. */
export interface LinkedInEducationStructured {
  suggestions: OptimizationSuggestion[];
  degree: string;             // Degree (e.g., "Bachelor of Commerce")
  school: string;             // Institution name (max 100 chars)
  fieldOfStudy?: string;      // Optional field of study
  grade?: string;             // Optional GPA or distinction (≥3.5 recommended)
  highlights: string;         // Bullet list of highlights (max 600 chars)
  activities?: string;        // Optional extracurriculars
}

/** Structured certifications output. */
export interface LinkedInCertificationStructured {
  suggestions: OptimizationSuggestion[];
  name: string;               // Certification name (max 100 chars)
  organization: string;       // Issuing organization (max 100 chars)
  issueDate?: string;         // Optional issue date
  credentialId?: string;      // Optional credential ID
  description: string;        // Applicability / capability summary (max 200 chars)
}

/** Structured project output. */
export interface LinkedInProjectStructured {
  suggestions: OptimizationSuggestion[];
  name: string;               // Project name (max 100 chars)
  role?: string;              // Optional role
  date?: string;              // Optional timeline
  description: string;        // Background → actions → results (max 1000 chars)
  technologies?: string[];    // Optional tech stack
}

/** Structured publication output. */
export interface LinkedInPublicationStructured {
  suggestions: OptimizationSuggestion[];
  title: string;              // Title (max 100 chars)
  publisher: string;          // Publisher/platform (max 100 chars)
  date?: string;              // Optional publication date
  description: string;        // Summary (max 500 chars)
  url?: string;               // Optional URL
}

/** Structured honors & awards output. */
export interface LinkedInAwardStructured {
  suggestions: OptimizationSuggestion[];
  title: string;              // Award title (max 100 chars)
  issuer: string;             // Issuer (max 100 chars)
  date?: string;              // Optional date
  description: string;        // Recognition summary (max 300 chars)
}

/** Structured volunteer experience output. */
export interface LinkedInVolunteerStructured {
  suggestions: OptimizationSuggestion[];
  role: string;               // Volunteer role (max 100 chars)
  organization: string;       // Organization (max 100 chars)
  cause?: string;             // Optional cause
  date?: string;              // Optional timeframe
  description: string;        // Background → contribution → impact (max 600 chars)
}

/** Structured recommendation summary output. */
export interface LinkedInRecommendationStructured {
  summary: string;            // Highlight summary (max 300 chars)
  keyThemes: string[];        // Extracted themes (e.g., ["Leadership", "Technical Expertise"])
  note: string;               // Clarifies that this summarizes existing recommendations
}

/** Structured featured content output. */
export interface LinkedInFeaturedStructured {
  items: {
    title: string;            // Item title (max 100 chars)
    description: string;      // Value proposition (max 180 chars)
    type?: string;            // Optional type (article, project, media, etc.)
  }[];
}

/** Structured activity summary output. */
export interface LinkedInActivityStructured {
  summary: string;            // Overall engagement summary (max 200 chars)
  topPosts: {
    title: string;            // Post summary (max 100 chars)
    engagement?: string;      // Optional engagement note
  }[];
  note: string;               // Clarifies that this summarizes existing activity
}

/**
 * Union of all structured optimization outputs plus plain-text fallback.
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
  | LinkedInFeaturedStructured
  | LinkedInActivityStructured
  | { plainText: string };
