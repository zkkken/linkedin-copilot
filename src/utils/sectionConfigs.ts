/**
 * LinkedIn Safe Co-Pilot - Section Configurations
 *
 * Configuration definitions for different LinkedIn profile sections
 */

import type { SectionConfig, SectionType } from '../types';

/**
 * Configuration for each LinkedIn section
 */
export const SECTION_CONFIGS: Record<SectionType, SectionConfig> = {
  general: {
    id: 'general',
    label: 'General Content',
    placeholder: 'Paste any LinkedIn text you want to optimize...',
    description: 'Neutral mode for free-form content or quick testing.',
    rows: 5,
    icon: '📝',
  },
  headline: {
    id: 'headline',
    label: 'Headline',
    placeholder: 'e.g., Software Engineer | Full-Stack Developer | React & Node.js Expert',
    description: 'Your professional headline (appears below your name)',
    maxLength: 220,
    rows: 2,
    icon: '🎯',
  },
  about: {
    id: 'about',
    label: 'About',
    placeholder: 'Paste your LinkedIn About section content...',
    description: 'Tell your professional story and showcase your value',
    maxLength: 2600,
    rows: 6,
    icon: '👤',
  },
  experience: {
    id: 'experience',
    label: 'Experience',
    placeholder: 'Paste a work experience description...',
    description: 'Optimize your achievements using the STAR method',
    rows: 5,
    icon: '💼',
  },
  education: {
    id: 'education',
    label: 'Education',
    placeholder: 'Paste your education details (degree, school, major, GPA, courses, projects, etc.)...',
    description: 'Highlight relevant coursework, academic projects, and achievements',
    maxLength: 600,
    rows: 5,
    icon: '🎓',
  },
  'licenses-certifications': {
    id: 'licenses-certifications',
    label: 'Licenses & Certifications',
    placeholder: 'Paste your certification details (name, issuing organization, date, etc.)...',
    description: 'Official LinkedIn section: Licenses & certifications. Enhance with clear scope and applicability',
    maxLength: 200,
    rows: 3,
    icon: '📜',
  },
  skills: {
    id: 'skills',
    label: 'Skills',
    placeholder: 'List your skills and areas of expertise...',
    description: 'Organize and enhance skill descriptions for better visibility',
    rows: 4,
    icon: '⚡',
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    placeholder: 'Paste project details (name, role, timeline, description, outcomes, etc.)...',
    description: 'Accomplishments subsection. Show project context, your actions, and results (recommended limit: 1000 chars)',
    maxLength: 1000,
    rows: 5,
    icon: '🚀',
  },
  publications: {
    id: 'publications',
    label: 'Publications',
    placeholder: 'Paste publication details (title, publisher, date, description, etc.)...',
    description: 'Accomplishments subsection. Showcase academic or industry publications (recommended limit: 500 chars)',
    maxLength: 500,
    rows: 4,
    icon: '📚',
  },
  'honors-awards': {
    id: 'honors-awards',
    label: 'Honors & Awards',
    placeholder: 'Paste award details (title, issuer, date, significance, etc.)...',
    description: 'Official LinkedIn: Honors & awards (Accomplishments subsection). Highlight significance and selection criteria (recommended limit: 300 chars)',
    maxLength: 300,
    rows: 3,
    icon: '🏆',
  },
  'volunteer-experience': {
    id: 'volunteer-experience',
    label: 'Volunteer Experience',
    placeholder: 'Paste volunteer activity details (role, organization, timeline, contributions, etc.)...',
    description: 'Official LinkedIn: Volunteer experience. Show your contributions, impact, and transferable skills (recommended limit: 600 chars)',
    maxLength: 600,
    rows: 4,
    icon: '🤝',
  },
};

/**
 * Get configuration for a specific section
 */
export const getSectionConfig = (sectionType: SectionType): SectionConfig => {
  return SECTION_CONFIGS[sectionType];
};

/**
 * Get all section options (for dropdown selection)
 */
export const getSectionOptions = (): Array<{ value: SectionType; label: string; icon: string }> => {
  return Object.values(SECTION_CONFIGS)
    .filter(config => config.id !== 'general')
    .map(config => ({
      value: config.id,
      label: config.label,
      icon: config.icon,
    }));
};
