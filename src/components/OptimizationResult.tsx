/**
 * OptimizationResult Component
 *
 * 根据SectionType展示结构化的优化结果
 */

import { StructuredField } from './StructuredField';
import { CopyButton } from './CopyButton';
import type {
  SectionType,
  LinkedInExperienceStructured,
  LinkedInHeadlineStructured,
  LinkedInAboutStructured,
  LinkedInSkillsStructured
} from '../types';

interface OptimizationResultProps {
  sectionType: SectionType;
  data: any;                    // 结构化数据或纯文本
}

export const OptimizationResult: React.FC<OptimizationResultProps> = ({
  sectionType,
  data
}) => {
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
          <StructuredField
            label="完整简介"
            value={aboutData.optimizedText}
            maxLength={2600}
            icon="📝"
            multiline
          />
          {aboutData.keyPoints && aboutData.keyPoints.length > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">✨ 关键亮点</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {aboutData.keyPoints.map((point, index) => (
                  <li key={index}>• {point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );

    case 'experience':
      const expData = data as LinkedInExperienceStructured;
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="mr-2">💼</span>
              优化后的工作经历
            </h3>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 font-medium mb-2">
              📋 以下字段可直接复制到LinkedIn工作经历编辑页面
            </p>
            <p className="text-xs text-blue-700">
              每个字段右上角都有独立复制按钮，方便逐个粘贴
            </p>
          </div>

          <StructuredField
            label="职位头衔 (Title)"
            value={expData.title}
            maxLength={100}
            icon="🎯"
          />

          <StructuredField
            label="职位性质 (Employment Type)"
            value={expData.employmentType}
            icon="⏰"
          />

          <StructuredField
            label="公司名称 (Company)"
            value={expData.company}
            maxLength={100}
            icon="🏢"
          />

          {expData.location && (
            <StructuredField
              label="地点 (Location)"
              value={expData.location}
              icon="📍"
            />
          )}

          <StructuredField
            label="工作描述 (Description)"
            value={expData.description}
            maxLength={2000}
            icon="📄"
            multiline
          />
        </div>
      );

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
                  className="p-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors text-xs"
                  title="复制此类别所有技能"
                >
                  复制全部
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium cursor-pointer hover:bg-blue-200 transition-colors"
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
