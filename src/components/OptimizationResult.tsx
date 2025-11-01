/**
 * OptimizationResult Component
 *
 * Display structured optimization results per section type
 */

import { useEffect, useState } from 'react';
import { StructuredField } from './StructuredField';
import { CopyButton } from './CopyButton';
import type {
  SectionType,
  OptimizationSuggestion,
  LinkedInExperienceStructured,
  LinkedInHeadlineStructured,
  LinkedInAboutStructured,
  LinkedInSkillsStructured,
  LinkedInEducationStructured,
  LinkedInCertificationStructured,
  LinkedInProjectStructured,
  LinkedInPublicationStructured,
  LinkedInAwardStructured,
  LinkedInVolunteerStructured
} from '../types';

interface OptimizationResultProps {
  sectionType: SectionType;
  data: any;                    // Structured data or plain text
}

type TabType = 'final' | 'suggestions';

/**
 * Optimization suggestions view component
 */
const SuggestionsView: React.FC<{ suggestions: OptimizationSuggestion[] }> = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">
        No optimization suggestions yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {suggestions.map((suggestion, index) => (
        <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-[#0A66C2] text-white rounded-full flex items-center justify-center text-xs font-bold">
              {index + 1}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-[#0A66C2] text-white text-xs font-semibold rounded">
                  {suggestion.type}
                </span>
              </div>
              <p className="text-sm text-gray-700">
                <strong className="text-[#0A66C2]">Reason: </strong>{suggestion.reason}
              </p>
              <p className="text-sm text-gray-700">
                <strong className="text-[#0A66C2]">Improvement: </strong>{suggestion.improvement}
              </p>
              {suggestion.before && (
                <div className="mt-2 pl-3 border-l-2 border-red-300 bg-red-50 p-2 rounded">
                  <p className="text-xs text-red-700"><strong>Before: </strong>{suggestion.before}</p>
                </div>
              )}
              {suggestion.after && (
                <div className="mt-1 pl-3 border-l-2 border-green-300 bg-green-50 p-2 rounded">
                  <p className="text-xs text-green-700"><strong>After: </strong>{suggestion.after}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const OptimizationResult: React.FC<OptimizationResultProps> = ({
  sectionType,
  data
}) => {
  const [activeExperienceIndex, setActiveExperienceIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>('final');

  useEffect(() => {
    setActiveExperienceIndex(0);
    setActiveTab('final'); // Reset to final tab when switching sections
  }, [sectionType, data]);

  // Handle downgraded plain-text responses
  if (data?.plainText || data?._fallback) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Optimization Result</h3>
          <CopyButton text={data.plainText} />
        </div>
        <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
          <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
            {data.plainText.split('\n').map((line: string, index: number) => (
              <p key={index} className={line.startsWith('•') ? 'ml-2 mb-2' : 'mb-2'}>
                {line}
              </p>
            ))}
          </div>
        </div>
        {data._fallback && (
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
            ⚠️ AI did not return structured data. Showing plain-text fallback that you can still use.
          </div>
        )}
      </div>
    );
  }

  // Tab toggle component
  const TabButtons = () => (
    <div className="flex border-b border-gray-200 mb-4">
      <button
        onClick={() => setActiveTab('final')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTab === 'final'
            ? 'border-b-2 border-[#0A66C2] text-[#0A66C2]'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        📋 Final version
      </button>
      <button
        onClick={() => setActiveTab('suggestions')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTab === 'suggestions'
            ? 'border-b-2 border-[#0A66C2] text-[#0A66C2]'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        💡 Suggestions
      </button>
    </div>
  );

  // Render different layouts for each section type
  switch (sectionType) {
    case 'headline':
      const headlineData = data as LinkedInHeadlineStructured;
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="mr-2">🎯</span>
              Optimized LinkedIn headline options
            </h3>
          </div>

          <TabButtons />

          {activeTab === 'final' && (
            <>
              <p className="text-sm text-gray-600">
                AI generated {headlineData.options?.length || 0} optimized option(s). Pick the one that fits best:
              </p>
              {headlineData.options?.map((option, index) => (
                <StructuredField
                  key={index}
                  label={`Option ${index + 1}`}
                  value={option}
                  maxLength={220}
                  icon="💡"
                />
              ))}
            </>
          )}

          {activeTab === 'suggestions' && (
            <SuggestionsView suggestions={headlineData.suggestions || []} />
          )}
        </div>
      );

    case 'about':
      const aboutData = data as LinkedInAboutStructured;
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="mr-2">👤</span>
              Optimized About section
            </h3>
          </div>

          <TabButtons />

          {activeTab === 'final' && (
            <>
              <StructuredField
                label="Full narrative"
                value={aboutData.optimizedText}
                maxLength={2600}
                icon="📝"
                multiline
              />
              {aboutData.keyPoints && aboutData.keyPoints.length > 0 && (
                <div className="p-3 bg-[#EAF3FF] border border-[#B3D6F2] rounded-lg">
                  <h4 className="text-sm font-semibold text-[#0A66C2] mb-2">✨ Key highlights</h4>
                  <ul className="text-sm text-[#0A66C2] space-y-1">
                    {aboutData.keyPoints.map((point, index) => (
                      <li key={index}>• {point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {activeTab === 'suggestions' && (
            <SuggestionsView suggestions={aboutData.suggestions || []} />
          )}
        </div>
      );

    case 'experience': {
      const experienceCandidates = Array.isArray((data as any)?.experiences)
        ? (data as any).experiences
        : Array.isArray(data)
        ? data
        : data
        ? [data]
        : [];

      const experienceList = experienceCandidates.filter(
        (item: any): item is LinkedInExperienceStructured =>
          item &&
          typeof item.title === 'string' &&
          typeof item.company === 'string' &&
          typeof item.description === 'string'
      );

      if (!experienceList.length) {
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            Structured experience data was not detected. Select a single entry and try again.
          </div>
        );
      }

      const safeIndex = Math.min(activeExperienceIndex, experienceList.length - 1);
      const activeExperience = experienceList[safeIndex];

      return (
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="mr-2">💼</span>
              Optimized experience entry
            </h3>
            {experienceList.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {experienceList.map((experience: LinkedInExperienceStructured, index: number) => {
                  const isActive = index === safeIndex;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveExperienceIndex(index)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-all ${
                        isActive
                          ? 'bg-[#0A66C2] text-white border-[#0A66C2] shadow-sm'
                          : 'bg-white text-[#0A66C2] border-[#0A66C2] hover:bg-[#EAF3FF]'
                      }`}
                      title={experience.title || `Entry ${index + 1}`}
                    >
                      Entry {index + 1}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <TabButtons />

          {activeTab === 'final' && (
            <>
              <div className="p-4 bg-[#EAF3FF] border border-[#B3D6F2] rounded-lg">
                <p className="text-sm text-[#0A66C2] font-medium mb-2">
                  📋 Copy these fields directly into the LinkedIn experience editor
                </p>
                <p className="text-xs text-[#0A66C2]">
                  Each field has an individual copy button for easy pasting.
                </p>
              </div>

              <StructuredField
                label="Job Title"
                value={activeExperience.title}
                maxLength={100}
                icon="🎯"
              />

              <StructuredField
                label="Employment Type"
                value={activeExperience.employmentType}
                icon="⏰"
              />

              <StructuredField
                label="Company"
                value={activeExperience.company}
                maxLength={100}
                icon="🏢"
              />

              {activeExperience.location && (
                <StructuredField
                  label="Location"
                  value={activeExperience.location}
                  icon="📍"
                />
              )}

              <StructuredField
                label="Description"
                value={activeExperience.description}
                maxLength={2000}
                icon="📄"
                multiline
              />
            </>
          )}

          {activeTab === 'suggestions' && (
            <SuggestionsView suggestions={activeExperience.suggestions || []} />
          )}
        </div>
      );
    }

    case 'skills':
      const skillsData = data as LinkedInSkillsStructured;
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="mr-2">⚡</span>
              Optimized skill groups
            </h3>
          </div>

          <TabButtons />

          {activeTab === 'final' && (
            <>
              {skillsData.categories?.map((category, catIndex) => (
                <div key={catIndex} className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-gray-800">{category.name}</h4>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(category.skills.join(', '))
                      }
                      className="p-1.5 rounded bg-[#EAF3FF] hover:bg-[#D8EAFE] text-[#0A66C2] transition-colors text-xs"
                      title="Copy all skills in this group"
                    >
                      Copy all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-[#D8EAFE] text-[#0A66C2] rounded-full text-xs font-medium cursor-pointer hover:bg-[#C6DFF8] transition-colors"
                        onClick={() => navigator.clipboard.writeText(skill)}
                        title="Click to copy"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'suggestions' && (
            <SuggestionsView suggestions={skillsData.suggestions || []} />
          )}
        </div>
      );

    case 'education':
      const educationData = data as LinkedInEducationStructured;
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="mr-2">🎓</span>
              Optimized education entry
            </h3>
          </div>

          <TabButtons />

          {activeTab === 'final' && (
            <>
              <StructuredField
                label="Degree"
                value={educationData.degree}
                maxLength={100}
                icon="📚"
              />

              <StructuredField
                label="School"
                value={educationData.school}
                maxLength={100}
                icon="🏫"
              />

              {educationData.fieldOfStudy && (
                <StructuredField
                  label="Field of Study"
                  value={educationData.fieldOfStudy}
                  icon="🔬"
                />
              )}

              {educationData.grade && (
                <StructuredField
                  label="Grade"
                  value={educationData.grade}
                  icon="⭐"
                />
              )}

              <StructuredField
                label="Highlights"
                value={educationData.highlights}
                maxLength={600}
                icon="✨"
                multiline
              />

              {educationData.activities && (
                <StructuredField
                  label="Activities"
                  value={educationData.activities}
                  icon="🎯"
                  multiline
                />
              )}
            </>
          )}

          {activeTab === 'suggestions' && (
            <SuggestionsView suggestions={educationData.suggestions || []} />
          )}
        </div>
      );

    case 'licenses-certifications':
      const certData = data as LinkedInCertificationStructured;
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="mr-2">📜</span>
              Optimized licenses & certifications
            </h3>
          </div>

          <TabButtons />

          {activeTab === 'final' && (
            <>
              <StructuredField
                label="Certification Name"
                value={certData.name}
                maxLength={100}
                icon="📋"
              />

              <StructuredField
                label="Issuing Organization"
                value={certData.organization}
                maxLength={100}
                icon="🏢"
              />

              {certData.issueDate && (
                <StructuredField
                  label="Issue Date"
                  value={certData.issueDate}
                  icon="📅"
                />
              )}

              {certData.credentialId && (
                <StructuredField
                  label="Credential ID"
                  value={certData.credentialId}
                  icon="🔖"
                />
              )}

              <StructuredField
                label="Applicability / capability summary"
                value={certData.description}
                maxLength={200}
                icon="💡"
                multiline
              />
            </>
          )}

          {activeTab === 'suggestions' && (
            <SuggestionsView suggestions={certData.suggestions || []} />
          )}
        </div>
      );

    case 'projects':
      const projectData = data as LinkedInProjectStructured;
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="mr-2">🚀</span>
              Optimized project entry
            </h3>
          </div>

          <TabButtons />

          {activeTab === 'final' && (
            <>
              <StructuredField
                label="Project Name"
                value={projectData.name}
                maxLength={100}
                icon="📌"
              />

              {projectData.role && (
                <StructuredField
                  label="Project Role"
                  value={projectData.role}
                  icon="👤"
                />
              )}

              {projectData.date && (
                <StructuredField
                  label="Timeline"
                  value={projectData.date}
                  icon="📅"
                />
              )}

              <StructuredField
                label="Project Description"
                value={projectData.description}
                maxLength={1000}
                icon="📄"
                multiline
              />

              {projectData.technologies && projectData.technologies.length > 0 && (
                <div className="p-4 bg-[#EAF3FF] border border-[#B3D6F2] rounded-lg">
                  <h4 className="text-sm font-semibold text-[#0A66C2] mb-2">🛠️ Tech stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {projectData.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[#D8EAFE] text-[#0A66C2] rounded text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'suggestions' && (
            <SuggestionsView suggestions={projectData.suggestions || []} />
          )}
        </div>
      );

    case 'publications':
      const publicationData = data as LinkedInPublicationStructured;
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="mr-2">📚</span>
              Optimized publication
            </h3>
          </div>

          <TabButtons />

          {activeTab === 'final' && (
            <>
              <StructuredField
                label="Title"
                value={publicationData.title}
                maxLength={100}
                icon="📖"
              />

              <StructuredField
                label="Publisher"
                value={publicationData.publisher}
                maxLength={100}
                icon="🏢"
              />

              {publicationData.date && (
                <StructuredField
                  label="Publication Date"
                  value={publicationData.date}
                  icon="📅"
                />
              )}

              <StructuredField
                label="Summary"
                value={publicationData.description}
                maxLength={500}
                icon="📝"
                multiline
              />

              {publicationData.url && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                  <p className="text-xs text-gray-600">🔗 URL: {publicationData.url}</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'suggestions' && (
            <SuggestionsView suggestions={publicationData.suggestions || []} />
          )}
        </div>
      );

    case 'honors-awards':
      const awardData = data as LinkedInAwardStructured;
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="mr-2">🏆</span>
              Optimized honors & awards entry
            </h3>
          </div>

          <TabButtons />

          {activeTab === 'final' && (
            <>
              <StructuredField
                label="Award Title"
                value={awardData.title}
                maxLength={100}
                icon="🏅"
              />

              <StructuredField
                label="Issuer"
                value={awardData.issuer}
                maxLength={100}
                icon="🏢"
              />

              {awardData.date && (
                <StructuredField
                  label="Award Date"
                  value={awardData.date}
                  icon="📅"
                />
              )}

              <StructuredField
                label="Recognition Summary"
                value={awardData.description}
                maxLength={300}
                icon="✨"
                multiline
              />
            </>
          )}

          {activeTab === 'suggestions' && (
            <SuggestionsView suggestions={awardData.suggestions || []} />
          )}
        </div>
      );

    case 'volunteer-experience':
      const volunteerData = data as LinkedInVolunteerStructured;
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="mr-2">🤝</span>
              Optimized volunteer experience
            </h3>
          </div>

          <TabButtons />

          {activeTab === 'final' && (
            <>
              <StructuredField
                label="Volunteer Role"
                value={volunteerData.role}
                maxLength={100}
                icon="👤"
              />

              <StructuredField
                label="Organization"
                value={volunteerData.organization}
                maxLength={100}
                icon="🏢"
              />

              {volunteerData.cause && (
                <StructuredField
                  label="Cause"
                  value={volunteerData.cause}
                  icon="💚"
                />
              )}

              {volunteerData.date && (
                <StructuredField
                  label="Date"
                  value={volunteerData.date}
                  icon="📅"
                />
              )}

              <StructuredField
                label="Experience Description"
                value={volunteerData.description}
                maxLength={600}
                icon="📄"
                multiline
              />
            </>
          )}

          {activeTab === 'suggestions' && (
            <SuggestionsView suggestions={volunteerData.suggestions || []} />
          )}
        </div>
      );

    default:
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Optimization Result</h3>
            <CopyButton text={data.plainText || ''} />
          </div>
          <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
            <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
              {(data.plainText || '').split('\n').map((line: string, index: number) => (
                <p key={index} className={line.startsWith('•') ? 'ml-2 mb-2' : 'mb-2'}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      );
  }
};
