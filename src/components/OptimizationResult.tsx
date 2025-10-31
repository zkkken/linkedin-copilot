/**
 * OptimizationResult Component
 *
 * 根据SectionType展示结构化的优化结果
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
  data: any;                    // 结构化数据或纯文本
}

type TabType = 'final' | 'suggestions';

/**
 * 优化建议展示组件
 */
const SuggestionsView: React.FC<{ suggestions: OptimizationSuggestion[] }> = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">
        暂无优化建议
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
                <strong className="text-[#0A66C2]">原因：</strong>{suggestion.reason}
              </p>
              <p className="text-sm text-gray-700">
                <strong className="text-[#0A66C2]">改进：</strong>{suggestion.improvement}
              </p>
              {suggestion.before && (
                <div className="mt-2 pl-3 border-l-2 border-red-300 bg-red-50 p-2 rounded">
                  <p className="text-xs text-red-700"><strong>修改前：</strong>{suggestion.before}</p>
                </div>
              )}
              {suggestion.after && (
                <div className="mt-1 pl-3 border-l-2 border-green-300 bg-green-50 p-2 rounded">
                  <p className="text-xs text-green-700"><strong>修改后：</strong>{suggestion.after}</p>
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
    setActiveTab('final'); // 切换字段时重置为最终版本tab
  }, [sectionType, data]);

  // 如果是降级处理（纯文本）
  if (data?.plainText || data?._fallback) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">优化结果</h3>
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
            ⚠️ AI未返回结构化数据，已降级为纯文本展示。您仍可使用此优化建议。
          </div>
        )}
      </div>
    );
  }

  // Tab切换按钮组件
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
        📋 最终版本
      </button>
      <button
        onClick={() => setActiveTab('suggestions')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTab === 'suggestions'
            ? 'border-b-2 border-[#0A66C2] text-[#0A66C2]'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        💡 优化建议
      </button>
    </div>
  );

  // 根据不同的SectionType渲染不同的结构
  switch (sectionType) {
    case 'headline':
      const headlineData = data as LinkedInHeadlineStructured;
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="mr-2">🎯</span>
              优化后的LinkedIn标题选项
            </h3>
          </div>

          <TabButtons />

          {activeTab === 'final' && (
            <>
              <p className="text-sm text-gray-600">
                AI生成了{headlineData.options?.length || 0}个优化选项，您可以选择最适合的一个：
              </p>
              {headlineData.options?.map((option, index) => (
                <StructuredField
                  key={index}
                  label={`选项 ${index + 1}`}
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
              优化后的个人简介
            </h3>
          </div>

          <TabButtons />

          {activeTab === 'final' && (
            <>
              <StructuredField
                label="完整简介"
                value={aboutData.optimizedText}
                maxLength={2600}
                icon="📝"
                multiline
              />
              {aboutData.keyPoints && aboutData.keyPoints.length > 0 && (
                <div className="p-3 bg-[#EAF3FF] border border-[#B3D6F2] rounded-lg">
                  <h4 className="text-sm font-semibold text-[#0A66C2] mb-2">✨ 关键亮点</h4>
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
            未能获取到结构化的工作经历，请尝试手动选择单段内容后重新优化。
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
              优化后的工作经历
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
                      title={experience.title || `第 ${index + 1} 段`}
                    >
                      第 {index + 1} 段
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-4 bg-[#EAF3FF] border border-[#B3D6F2] rounded-lg">
            <p className="text-sm text-[#0A66C2] font-medium mb-2">
              📋 以下字段可直接复制到LinkedIn工作经历编辑页面
            </p>
            <p className="text-xs text-[#0A66C2]">
              每个字段右上角都有独立复制按钮，方便逐个粘贴
            </p>
          </div>

          <StructuredField
            label="职位头衔 (Title)"
            value={activeExperience.title}
            maxLength={100}
            icon="🎯"
          />

          <StructuredField
            label="职位性质 (Employment Type)"
            value={activeExperience.employmentType}
            icon="⏰"
          />

          <StructuredField
            label="公司名称 (Company)"
            value={activeExperience.company}
            maxLength={100}
            icon="🏢"
          />

          {activeExperience.location && (
            <StructuredField
              label="地点 (Location)"
              value={activeExperience.location}
              icon="📍"
            />
          )}

          <StructuredField
            label="工作描述 (Description)"
            value={activeExperience.description}
            maxLength={2000}
            icon="📄"
            multiline
          />
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
              优化后的技能分类
            </h3>
          </div>
          {skillsData.categories?.map((category, catIndex) => (
            <div key={catIndex} className="p-4 bg-white border-2 border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-gray-800">{category.name}</h4>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(category.skills.join(', '))
                  }
                  className="p-1.5 rounded bg-[#EAF3FF] hover:bg-[#D8EAFE] text-[#0A66C2] transition-colors text-xs"
                  title="复制此类别所有技能"
                >
                  复制全部
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-3 py-1 bg-[#D8EAFE] text-[#0A66C2] rounded-full text-xs font-medium cursor-pointer hover:bg-[#C6DFF8] transition-colors"
                    onClick={() => navigator.clipboard.writeText(skill)}
                    title="点击复制"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      );

    case 'education':
      const educationData = data as LinkedInEducationStructured;
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="mr-2">🎓</span>
              优化后的教育经历
            </h3>
          </div>

          <StructuredField
            label="学位 (Degree)"
            value={educationData.degree}
            maxLength={100}
            icon="📚"
          />

          <StructuredField
            label="学校 (School)"
            value={educationData.school}
            maxLength={100}
            icon="🏫"
          />

          {educationData.fieldOfStudy && (
            <StructuredField
              label="专业领域 (Field of Study)"
              value={educationData.fieldOfStudy}
              icon="🔬"
            />
          )}

          {educationData.grade && (
            <StructuredField
              label="成绩 (Grade)"
              value={educationData.grade}
              icon="⭐"
            />
          )}

          <StructuredField
            label="亮点 (Highlights)"
            value={educationData.highlights}
            maxLength={600}
            icon="✨"
            multiline
          />

          {educationData.activities && (
            <StructuredField
              label="课外活动 (Activities)"
              value={educationData.activities}
              icon="🎯"
              multiline
            />
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
              优化后的证书认证 (Licenses & Certifications)
            </h3>
          </div>

          <StructuredField
            label="证书名称 (Name)"
            value={certData.name}
            maxLength={100}
            icon="📋"
          />

          <StructuredField
            label="颁发机构 (Organization)"
            value={certData.organization}
            maxLength={100}
            icon="🏢"
          />

          {certData.issueDate && (
            <StructuredField
              label="颁发日期 (Issue Date)"
              value={certData.issueDate}
              icon="📅"
            />
          )}

          {certData.credentialId && (
            <StructuredField
              label="证书ID (Credential ID)"
              value={certData.credentialId}
              icon="🔖"
            />
          )}

          <StructuredField
            label="适用场景/能力说明 (Description)"
            value={certData.description}
            maxLength={200}
            icon="💡"
            multiline
          />
        </div>
      );

    case 'projects':
      const projectData = data as LinkedInProjectStructured;
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="mr-2">🚀</span>
              优化后的项目经历
            </h3>
          </div>

          <StructuredField
            label="项目名称 (Name)"
            value={projectData.name}
            maxLength={100}
            icon="📌"
          />

          {projectData.role && (
            <StructuredField
              label="项目角色 (Role)"
              value={projectData.role}
              icon="👤"
            />
          )}

          {projectData.date && (
            <StructuredField
              label="项目时间 (Date)"
              value={projectData.date}
              icon="📅"
            />
          )}

          <StructuredField
            label="项目描述 (Description)"
            value={projectData.description}
            maxLength={1000}
            icon="📄"
            multiline
          />

          {projectData.technologies && projectData.technologies.length > 0 && (
            <div className="p-4 bg-[#EAF3FF] border border-[#B3D6F2] rounded-lg">
              <h4 className="text-sm font-semibold text-[#0A66C2] mb-2">🛠️ 技术栈</h4>
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
        </div>
      );

    case 'publications':
      const publicationData = data as LinkedInPublicationStructured;
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="mr-2">📚</span>
              优化后的出版物
            </h3>
          </div>

          <StructuredField
            label="标题 (Title)"
            value={publicationData.title}
            maxLength={100}
            icon="📖"
          />

          <StructuredField
            label="出版商/平台 (Publisher)"
            value={publicationData.publisher}
            maxLength={100}
            icon="🏢"
          />

          {publicationData.date && (
            <StructuredField
              label="发表日期 (Date)"
              value={publicationData.date}
              icon="📅"
            />
          )}

          <StructuredField
            label="简介 (Description)"
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
        </div>
      );

    case 'honors-awards':
      const awardData = data as LinkedInAwardStructured;
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="mr-2">🏆</span>
              优化后的荣誉奖项 (Honors & Awards)
            </h3>
          </div>

          <StructuredField
            label="奖项名称 (Title)"
            value={awardData.title}
            maxLength={100}
            icon="🏅"
          />

          <StructuredField
            label="颁发机构 (Issuer)"
            value={awardData.issuer}
            maxLength={100}
            icon="🏢"
          />

          {awardData.date && (
            <StructuredField
              label="获奖日期 (Date)"
              value={awardData.date}
              icon="📅"
            />
          )}

          <StructuredField
            label="获奖原因/意义 (Description)"
            value={awardData.description}
            maxLength={300}
            icon="✨"
            multiline
          />
        </div>
      );

    case 'volunteer-experience':
      const volunteerData = data as LinkedInVolunteerStructured;
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="mr-2">🤝</span>
              优化后的志愿经历 (Volunteer Experience)
            </h3>
          </div>

          <StructuredField
            label="志愿角色 (Role)"
            value={volunteerData.role}
            maxLength={100}
            icon="👤"
          />

          <StructuredField
            label="组织名称 (Organization)"
            value={volunteerData.organization}
            maxLength={100}
            icon="🏢"
          />

          {volunteerData.cause && (
            <StructuredField
              label="公益领域 (Cause)"
              value={volunteerData.cause}
              icon="💚"
            />
          )}

          {volunteerData.date && (
            <StructuredField
              label="时间 (Date)"
              value={volunteerData.date}
              icon="📅"
            />
          )}

          <StructuredField
            label="经历描述 (Description)"
            value={volunteerData.description}
            maxLength={600}
            icon="📄"
            multiline
          />
        </div>
      );

    case 'general':
    default:
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">优化结果</h3>
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
