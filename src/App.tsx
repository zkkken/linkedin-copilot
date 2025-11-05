import { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { PrivacyConsent } from './components/PrivacyConsent';
import { CopyButton } from './components/CopyButton';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SectionSelector } from './components/SectionSelector';
import { CharacterCount } from './components/CharacterCount';
import { UserGuide } from './components/UserGuide';
import { InputModeSelector, type InputMode } from './components/InputModeSelector';
import { ScreenshotDisclaimer } from './components/ScreenshotDisclaimer';
import { OptimizationResult } from './components/OptimizationResult';
import { SettingsPage } from './components/SettingsPage';
import { generatePrompt, detectSectionType } from './utils/promptTemplates';
import { generateStructuredPrompt, parseStructuredResponse } from './utils/structuredPrompts';
import { getSectionConfig } from './utils/sectionConfigs';
import { captureCurrentTab, isLinkedInPage } from './utils/screenshotCapture';
import type { SectionType } from './types';
import { getProvider } from './providers/aiProviders';

type SectionEntriesMap = Partial<Record<SectionType, string[]>>;

const SECTION_KEYWORDS: Record<SectionType, string[]> = {
  general: [],
  headline: ['headline', 'professional headline', 'personal headline'],
  about: ['about', 'summary', 'profile', 'about me'],
  experience: [
    'work experience',
    'professional experience',
    'experience',
    'employment history',
    'career history',
    'work history',
    'career experience',
    'professional background'
  ],
  education: ['education', 'academic background'],
  'licenses-certifications': ['certifications', 'certification', 'licenses', 'license'],
  skills: ['skills', 'core skills', 'competencies', 'capabilities'],
  projects: ['projects', 'project experience', 'project highlights', 'portfolio projects'],
  publications: ['publications', 'papers', 'articles'],
  'honors-awards': ['awards', 'honors', 'achievements'],
  'volunteer-experience': ['volunteer experience', 'volunteer', 'volunteering history']
};

const normalizeHeading = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z\u4e00-\u9fa5\s&-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const detectSectionFromLine = (line: string): SectionType | null => {
  const trimmed = line.trim();
  if (!trimmed) return null;
  if (trimmed.length > 80) return null;
  if (/[.;！？。!?]/.test(trimmed)) return null;

  const normalized = normalizeHeading(trimmed);
  if (!normalized) return null;

  for (const [section, keywords] of Object.entries(SECTION_KEYWORDS) as [SectionType, string[]][]) {
    if (
      keywords.some(
        (keyword) =>
          normalized === keyword ||
          normalized.startsWith(keyword) ||
          (keyword.includes(' ') && normalized.includes(keyword))
      )
    ) {
      return section;
    }
  }
  return null;
};

const splitResumeSections = (text: string): SectionEntriesMap => {
  const sections: SectionEntriesMap = {};
  let currentSection: SectionType | null = null;
  let buffer: string[] = [];
  let emptyLineCount = 0;

  const pushBuffer = () => {
    if (!currentSection) return;
    const combined = buffer.join('\n').trim();
    if (!combined) {
      buffer = [];
      return;
    }
    if (!sections[currentSection]) {
      sections[currentSection] = [];
    }
    sections[currentSection]!.push(combined);
    buffer = [];
  };

  const lines = text.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const detected = detectSectionFromLine(line);

    if (detected) {
      pushBuffer();
      currentSection = detected;
      emptyLineCount = 0;
      continue;
    }

    if (!currentSection) {
      continue;
    }

    if (!line.trim()) {
      emptyLineCount += 1;
      if (emptyLineCount >= 2) {
        pushBuffer();
        emptyLineCount = 0;
      } else if (buffer.length && buffer[buffer.length - 1] !== '') {
        buffer.push('');
      }
      continue;
    }

    emptyLineCount = 0;
    buffer.push(line);
  }

  pushBuffer();

  return sections;
};

/**
 * Generate a meaningful preview label for an entry based on section type and content
 */
const generateEntryPreview = (sectionType: SectionType, entryContent: string, maxLength: number = 35): string => {
  const lines = entryContent.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return 'Empty entry';

  switch (sectionType) {
    case 'experience': {
      // Try to extract company name or job title from first few lines
      const titleLine = lines[0];
      const companyLine = lines.length > 1 ? lines[1] : '';

      // Common patterns: "Job Title at Company" or "Company - Job Title"
      if (titleLine.toLowerCase().includes(' at ')) {
        const parts = titleLine.split(/ at /i);
        return parts[0].substring(0, maxLength);
      }
      if (companyLine && companyLine.length > 0) {
        return companyLine.substring(0, maxLength);
      }
      return titleLine.substring(0, maxLength);
    }

    case 'education': {
      // Try to extract school name or degree
      const schoolOrDegree = lines[0];
      return schoolOrDegree.substring(0, maxLength);
    }

    case 'projects': {
      // Use project name (usually first line)
      const projectName = lines[0];
      return projectName.substring(0, maxLength);
    }

    case 'licenses-certifications': {
      // Use certification name
      const certName = lines[0];
      return certName.substring(0, maxLength);
    }

    case 'honors-awards': {
      // Use award title
      const awardTitle = lines[0];
      return awardTitle.substring(0, maxLength);
    }

    case 'volunteer-experience': {
      // Use role or organization
      const roleOrOrg = lines[0];
      return roleOrOrg.substring(0, maxLength);
    }

    case 'skills': {
      // Use category name if available, or first skill
      const category = lines[0];
      return category.substring(0, maxLength);
    }

    default: {
      // For other sections, use first line or first N characters
      const preview = lines[0].substring(0, maxLength);
      return preview || 'Entry';
    }
  }
};

function App() {
  // State management (project specific)
  const [resumeContent, setResumeContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [optimizedText, setOptimizedText] = useState('Waiting for AI optimization...');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  // Multi-section support state
  const [currentSection, setCurrentSection] = useState<SectionType>('about');
  const [sectionEntries, setSectionEntries] = useState<SectionEntriesMap>({});
  const [sectionEntryIndex, setSectionEntryIndex] = useState<Partial<Record<SectionType, number>>>({});
  const [isPdfSource, setIsPdfSource] = useState(false);
const [fullPdfText, setFullPdfText] = useState<string>(''); // 🆕 Store the full PDF text for AI analysis

  // Structured optimization result state
  const [structuredResult, setStructuredResult] = useState<any>(null);
  const useStructuredOutput = true; // Always use structured output

  // 🆕 Optimization result cache (issue #5 - quick switching)
  const [optimizedCache, setOptimizedCache] = useState<Partial<Record<SectionType, any>>>({});

  // Privacy consent state
  const [hasConsent, setHasConsent] = useState<boolean | null>(null); // null = unchecked, false = declined, true = accepted
  const [showConsentModal, setShowConsentModal] = useState(false);

  // User guide state
  const [showUserGuide, setShowUserGuide] = useState(false);

  // Settings page state
  const [showSettings, setShowSettings] = useState(false);

  // Input mode state
  const [inputMode, setInputMode] = useState<InputMode>('manual');

  // Screenshot feature state
  const [showScreenshotDisclaimer, setShowScreenshotDisclaimer] = useState(false);
  const [isLinkedIn, setIsLinkedIn] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // 🆕 Persisted state: restore on mount (issue #2)
  useEffect(() => {
    const restoreState = async () => {
      try {
        const result = await chrome.storage.local.get([
          'resumeContent',
          'jobDescription',
          'currentSection',
          'inputMode',
          'sectionEntries',
          'sectionEntryIndex',
          'isPdfSource',
          'fullPdfText',
          'uploadedFileName',
          'optimizedCache',
          'structuredResult',
          'optimizedText'
        ]);

        if (result.resumeContent) setResumeContent(result.resumeContent);
        if (result.jobDescription) setJobDescription(result.jobDescription);
        if (result.currentSection) {
          const restoredSection =
            result.currentSection === 'general' ? 'about' : result.currentSection;
          setCurrentSection(restoredSection);
        }
        if (result.inputMode) setInputMode(result.inputMode);
        if (result.sectionEntries) setSectionEntries(result.sectionEntries);
        if (result.sectionEntryIndex) setSectionEntryIndex(result.sectionEntryIndex);
        if (result.isPdfSource !== undefined) setIsPdfSource(result.isPdfSource);
        if (result.fullPdfText) setFullPdfText(result.fullPdfText);
        if (result.uploadedFileName) setUploadedFileName(result.uploadedFileName);
        if (result.optimizedCache) setOptimizedCache(result.optimizedCache);
        if (result.structuredResult) setStructuredResult(result.structuredResult);
        if (result.optimizedText) setOptimizedText(result.optimizedText);
      } catch (error) {
        console.error('Failed to restore state:', error);
      }
    };

    restoreState();

    // First-time user guidance
    const hasSeenGuide = localStorage.getItem('hasSeenUserGuide');
    if (!hasSeenGuide) {
      setShowUserGuide(true);
    }
  }, []);

  // 🆕 Persisted state: save key values (debounced)
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      chrome.storage.local.set({
        resumeContent,
        jobDescription,
        currentSection,
        inputMode,
        sectionEntries,
        sectionEntryIndex,
        isPdfSource,
        fullPdfText,
        uploadedFileName,
        optimizedCache,
        structuredResult,
        optimizedText
      }).catch(error => {
        console.error('Failed to save state:', error);
      });
    }, 1000); // 1 second debounce

    return () => clearTimeout(saveTimeout);
  }, [
    resumeContent,
    jobDescription,
    currentSection,
    inputMode,
    sectionEntries,
    sectionEntryIndex,
    isPdfSource,
    fullPdfText,
    uploadedFileName,
    optimizedCache,
    structuredResult,
    optimizedText
  ]);

  // Close user guide and save state
  const handleCloseUserGuide = () => {
    setShowUserGuide(false);
    localStorage.setItem('hasSeenUserGuide', 'true');
  };

  // Handle PDF text extraction
  const handlePDFTextExtracted = (text: string, fileName: string) => {
    const cleanedText = text.trim();
    setUploadedFileName(fileName);
    setFullPdfText(cleanedText); // 🆕 Store the complete PDF text

    const entries = splitResumeSections(cleanedText);
    setSectionEntries(entries);

    const defaultIndexes: Partial<Record<SectionType, number>> = {};
    (Object.keys(entries) as SectionType[]).forEach((section) => {
      defaultIndexes[section] = 0;
    });
    setSectionEntryIndex(defaultIndexes);

    // Keep current section selection (don't auto-switch)
    // Only update content if current section exists in extracted data
    if (entries[currentSection]) {
      const initialContent = entries[currentSection]![0];
      setResumeContent(initialContent);
    } else {
      // If current section not found, switch to first detected section
      const detectedType = detectSectionType(cleanedText);
      setCurrentSection(detectedType);
      const initialContent = entries[detectedType]?.[0] ?? cleanedText;
      setResumeContent(initialContent);
    }

    setIsPdfSource(true);
    setOptimizedText('PDF parsed successfully. Select the section to optimize, then click "Optimize".');
  };

  // Handle section change
  const handleSectionChange = (newSection: SectionType) => {
    console.log(`[Section Change] Switching from "${currentSection}" to "${newSection}"`);
    setCurrentSection(newSection);

    // 🆕 Prefer cached optimization result when available (issue #5)
    const cachedResult = optimizedCache[newSection];
    if (cachedResult) {
      console.log(`[Section Change] Found cached result for "${newSection}"`);
      setStructuredResult(cachedResult);
      setOptimizedText(''); // Clear previous plain-text output
    } else {
      setStructuredResult(null);
      // Only show "rerun" message if there was a previous optimization result
      if (optimizedText && !optimizedText.toLowerCase().includes('waiting') && !optimizedText.includes('PDF') && !optimizedText.includes('Screenshot') && !optimizedText.includes('analyzed')) {
        setOptimizedText('Section changed. Click "Optimize" to generate suggestions for this section.');
      }
    }

    if (isPdfSource) {
      const entries = sectionEntries[newSection];
      console.log(`[Section Change] Available entries for "${newSection}":`, entries?.length || 0);
      if (entries && entries.length > 0) {
        const currentIndex = sectionEntryIndex[newSection] ?? 0;
        const safeIndex = Math.min(currentIndex, entries.length - 1);
        setSectionEntryIndex((prev) => ({
          ...prev,
          [newSection]: safeIndex
        }));
        setResumeContent(entries[safeIndex]);
        console.log(`[Section Change] Loaded entry ${safeIndex} for "${newSection}", content length: ${entries[safeIndex].length} chars`);
      } else {
        setResumeContent('');
        console.log(`[Section Change] No content available for "${newSection}"`);
        // Show helpful message if no content for this section
        if (!cachedResult) {
          setOptimizedText(`No content found for "${newSection}" in the screenshot. Try capturing a different part of the page or enter content manually.`);
        }
      }
    }
  };

  const handleSectionEntrySelect = (section: SectionType, index: number) => {
    const entries = sectionEntries[section];
    if (!entries || !entries[index]) return;
    setSectionEntryIndex((prev) => ({
      ...prev,
      [section]: index
    }));
    setResumeContent(entries[index]);
  };

  // Handle privacy consent
  const handleConsentResponse = (agreed: boolean) => {
    setHasConsent(agreed);
    setShowConsentModal(false);

    if (agreed) {
      // Run AI optimization immediately after consent
      performOptimization();
    } else {
      // User declined
      setOptimizedText('You must accept the privacy terms before using AI optimization.');
    }
  };

  // Execute AI optimization (actual API call) with structured prompt
  const performOptimization = async () => {
    setIsLoading(true);
    const sectionConfig = getSectionConfig(currentSection);
    setOptimizedText(`Generating optimization suggestions for ${sectionConfig.label}...`);
    setStructuredResult(null);

    try {
      // Get current provider configuration
      const { aiProvider = 'userFirebase', aiProviderConfig = {} } =
        await chrome.storage.local.get(['aiProvider', 'aiProviderConfig']);

      const provider = getProvider(aiProvider);
      console.log('Using provider:', provider.name);

      // 🆕 Smart content selection: fall back to full PDF content when field is empty
      const contentToOptimize = resumeContent.trim()
        ? resumeContent
        : (isPdfSource && fullPdfText ? fullPdfText : resumeContent);

      // Check if we have content to optimize
      if (!contentToOptimize.trim()) {
        console.error('[Optimize] No content available for current section:', currentSection);
        setOptimizedText(`❌ No content available for "${currentSection}".\n\nPlease:\n1. Select a different section that was captured in the screenshot, or\n2. Enter content manually in the text area above.`);
        setIsLoading(false);
        return;
      }

      console.log('[Optimize] Content length:', contentToOptimize.length, 'chars');

      // Use structured prompt (returns JSON)
      const prompt = useStructuredOutput
        ? generateStructuredPrompt(currentSection, contentToOptimize, jobDescription)
        : generatePrompt(currentSection, contentToOptimize, jobDescription);

      console.log('Prompt type:', useStructuredOutput ? 'structured' : 'standard');

      // Call AI provider
      const text = await provider.generateContent(prompt, aiProviderConfig);

      console.log('Raw AI response:', text);

      if (useStructuredOutput) {
        // Parse structured JSON response
        const parsedData = parseStructuredResponse(text, currentSection);
        console.log('Parsed data:', parsedData);

        setStructuredResult(parsedData);
        setOptimizedText(''); // Clear previous plain-text output

        // 🆕 Cache the result (issue #5)
        setOptimizedCache((prev) => ({
          ...prev,
          [currentSection]: parsedData
        }));

      } else {
        // Standard plain-text format
        const formattedText = text
          .trim()
          .split('\n')
          .filter(line => line.trim())
          .map(line => line.trim())
          .join('\n');

        setOptimizedText(formattedText || text);
        setStructuredResult(null);
      }

    } catch (error) {
      console.error('AI Logic call failed:', error);
      setStructuredResult(null);

      if (error instanceof Error) {
        if (error.message.includes('quota') || error.message.includes('429')) {
          setOptimizedText('⚠️ API quota reached. Please try again later.\n\nIf you just created the Firebase project, wait a few minutes and try again.');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          setOptimizedText('⚠️ Network request failed. Check your connection and try again.');
        } else {
          setOptimizedText(`⚠️ AI optimization failed: ${error.message}\n\nConfirm that AI Logic is enabled inside the Firebase console.`);
        }
      } else {
        setOptimizedText('⚠️ AI optimization failed. Make sure AI Logic is enabled in Firebase and check your network connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Core trigger (updated - checks consent)
  const handleOptimize = async () => {
    // 🔧 Fix: allow optimization in PDF/screenshot mode using fullPdfText
    if (!resumeContent.trim() && !(isPdfSource && fullPdfText)) {
      alert('Please enter your resume content!');
      return;
    }

    // Check privacy consent status
    if (hasConsent === true) {
      // Consent granted - run optimization
      performOptimization();
    } else {
      // Not yet consented - show modal
      setShowConsentModal(true);
    }
  };

  // Handle screenshot button click
  const handleScreenshotClick = async () => {
    // Verify current tab is a LinkedIn page
    const isOnLinkedIn = await isLinkedInPage();
    setIsLinkedIn(isOnLinkedIn);

    // Show disclaimer
    setShowScreenshotDisclaimer(true);
  };

  // Handle screenshot disclaimer response
  const handleScreenshotConsent = async (agreed: boolean) => {
    setShowScreenshotDisclaimer(false);

    if (!agreed) {
      setOptimizedText('Screenshot capture canceled. Try manual input or PDF upload instead.');
      return;
    }

    // Consent received - begin capture and analysis
    await performScreenshotCapture();
  };

  // Perform screenshot capture and analysis
  const performScreenshotCapture = async () => {
    setIsCapturing(true);
    setIsLoading(true);
    setOptimizedText('Capturing screenshot...');

    try {
      // Get current provider configuration
      const { aiProvider = 'userFirebase', aiProviderConfig = {} } =
        await chrome.storage.local.get(['aiProvider', 'aiProviderConfig']);

      const provider = getProvider(aiProvider);

      // Check if provider supports vision
      if (!provider.supportsVision || !provider.analyzeImage) {
        setOptimizedText(
          `❌ Screenshot mode requires Vision API support\n\n` +
          `Current provider: ${provider.name}\n\n` +
          `💡 Supported providers:\n` +
          `• Firebase with Gemini\n` +
          `• OpenAI GPT-4o / GPT-4-turbo\n` +
          `• Anthropic Claude 3.5\n\n` +
          `Change provider in Settings ⚙️`
        );
        setIsCapturing(false);
        setIsLoading(false);
        return;
      }

      console.log('Using provider for screenshot:', provider.name);

      // 1. Capture screenshot
      const captureResult = await captureCurrentTab();
      setOptimizedText(`Screenshot captured. Analyzing with ${provider.name}...`);

      // 2. Build analysis prompt (extract text)
      const visionPrompt = `
Please analyze this LinkedIn profile screenshot and extract every visible piece of text.

Tasks:
1. Use OCR to capture all text in the image.
2. Identify and group LinkedIn profile sections (if visible):
   - Headline
   - About
   - Experience
   - Education
   - Skills
   - Projects
   - Licenses & Certifications
   - Honors & Awards
   - Volunteer Experience
3. Return ONLY JSON with the full text for each visible section.
4. If a section is not visible, set its value to an empty string "".
5. Preserve the original formatting, including line breaks and bullet characters.
`;

      // 3. Call provider's vision API for analysis
      const analysisResult = await provider.analyzeImage!(captureResult.dataUrl, visionPrompt, aiProviderConfig);

      // 4. Parse Vision API JSON response
      try {
        // Attempt to extract JSON (Vision API may return markdown)
        const jsonMatch = analysisResult.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('Unable to extract JSON from the Vision API response');
        }

        const extractedData = JSON.parse(jsonMatch[0]);
        console.log('Vision extracted keys:', Object.keys(extractedData));

        // 5. Store extracted text by section (PDF-style)
        const entries: SectionEntriesMap = {};
        let hasAnyContent = false;

        const normalizeVisionKey = (key: string) =>
          key
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^a-z]/g, '');

        const fieldMapping: Record<string, SectionType> = {
          headline: 'headline',
          about: 'about',
          experience: 'experience',
          education: 'education',
          skills: 'skills',
          projects: 'projects',
          licensescertifications: 'licenses-certifications',
          honorsawards: 'honors-awards',
          volunteerexperience: 'volunteer-experience',
        };

        const cleanSkillsText = (text: string) => {
          const lines = text
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .filter(
              (line) =>
                !/^skills$/i.test(line) &&
                !/^all\s/i.test(line) &&
                !/(industry knowledge|tools & technologies|interpersonal skills)/i.test(line)
            );
          return lines.join('\n');
        };

        for (const [rawKey, rawValue] of Object.entries(extractedData)) {
          const normalizedKey = normalizeVisionKey(rawKey);
          const sectionType = fieldMapping[normalizedKey];

          console.log(`[Screenshot] Processing key: "${rawKey}" -> normalized: "${normalizedKey}" -> section: "${sectionType}"`);

          if (!sectionType) {
            console.log(`[Screenshot] Skipping unknown key: "${rawKey}"`);
            continue;
          }

          let content = typeof rawValue === 'string' ? rawValue.trim() : '';
          if (sectionType === 'skills' && content) {
            content = cleanSkillsText(content);
          }
          if (content) {
            entries[sectionType] = [content];
            hasAnyContent = true;
            console.log(`[Screenshot] Added content for "${sectionType}", length: ${content.length} chars`);
          } else {
            console.log(`[Screenshot] Empty content for "${sectionType}"`);
          }
        }

        console.log(`[Screenshot] Total sections extracted:`, Object.keys(entries));

        if (!hasAnyContent) {
          throw new Error('No LinkedIn content could be identified in the screenshot');
        }

        // 6. Update state (similar to PDF mode)
        setSectionEntries(entries);
        setIsPdfSource(true); // mark as non-manual input source
        setFullPdfText(analysisResult); // keep raw Vision response as fallback

        // Set default indexes
        const defaultIndexes: Partial<Record<SectionType, number>> = {};
        (Object.keys(entries) as SectionType[]).forEach((section) => {
          defaultIndexes[section] = 0;
        });
        setSectionEntryIndex(defaultIndexes);

        // 7. DON'T auto-switch section - keep user's current selection
        // Only update content if current section exists in extracted data
        if (entries[currentSection]) {
          const content = entries[currentSection]![0];
          setResumeContent(content);
          console.log(`[Screenshot] Loaded content for section: ${currentSection}`);
        } else {
          // Current section not found, but don't switch - let user choose
          setResumeContent('');
          console.log(`[Screenshot] Current section "${currentSection}" not found in screenshot. Available sections:`, Object.keys(entries));
        }

        setOptimizedText('✅ Screenshot content analyzed! Select the section you want to optimize, then click "Optimize".');

      } catch (parseError) {
        console.error('Failed to parse Vision API response:', parseError);
        setOptimizedText(`⚠️ Screenshot analysis failed: ${parseError instanceof Error ? parseError.message : 'unknown error'}\n\nRaw response:\n${analysisResult}`);
      }

    } catch (error) {
      console.error('Screenshot analysis failed:', error);
      if (error instanceof Error) {
        if (error.message.toLowerCase().includes('permission')) {
          setOptimizedText('⚠️ Screenshot failed: missing permissions.\n\nGrant the extension the \"capture visible tab\" permission and try again.');
        } else if (error.message.includes('quota') || error.message.includes('429')) {
          setOptimizedText('⚠️ API quota reached. Please try again later.');
        } else {
          setOptimizedText(`⚠️ Screenshot analysis failed: ${error.message}\n\nTry manual input or PDF upload instead.`);
        }
      } else {
        setOptimizedText('⚠️ Screenshot analysis failed. Try manual input or PDF upload instead.');
      }
    } finally {
      setIsCapturing(false);
      setIsLoading(false);
    }
  };

  // Handle input mode change
  const handleInputModeChange = (mode: InputMode) => {
    setInputMode(mode);

    // 🔥 Reset state when switching modes to avoid interference
    setResumeContent('');
    setUploadedFileName('');
    setIsPdfSource(false);
    setSectionEntries({});
    setSectionEntryIndex({});
    setOptimizedCache({}); // clear cached optimizations
    setStructuredResult(null);
    setFullPdfText(''); // clear stored full PDF text

    if (mode === 'screenshot') {
      // When entering screenshot mode, reset previous status message
      setOptimizedText('Click "📸 Capture LinkedIn page" below to start the analysis.');
    } else if (mode === 'manual') {
      setOptimizedText('Paste or type your resume content, then click Optimize.');
    } else if (mode === 'pdf') {
      setOptimizedText('Upload a PDF file or paste your content to begin.');
    }
  };

  // UI remains unchanged to match project requirements
  const entriesForCurrentSection = sectionEntries[currentSection] ?? [];
  const activeEntryIndex = sectionEntryIndex[currentSection] ?? 0;
  const hasExtractedEntries = isPdfSource && entriesForCurrentSection.length > 0;

  return (
    <>
      {/* User guide modal */}
      {showUserGuide && <UserGuide onClose={handleCloseUserGuide} />}

      {/* Settings page modal */}
      {showSettings && <SettingsPage onClose={() => setShowSettings(false)} />}

      {/* Privacy consent modal */}
      {showConsentModal && <PrivacyConsent onConsent={handleConsentResponse} />}

      {/* Screenshot disclaimer modal */}
      {showScreenshotDisclaimer && (
        <ScreenshotDisclaimer
          onConsent={handleScreenshotConsent}
          isLinkedInPage={isLinkedIn}
        />
      )}

      <div className="w-[420px] font-sans bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
        {/* Header - LinkedIn style */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#0A66C2] rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">LinkedIn Safe Co-Pilot</h1>
                <p className="text-xs text-gray-500">AI-powered resume optimization</p>
              </div>
            </div>
            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              {/* Settings button */}
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg text-gray-600 hover:bg-[#EAF3FF] hover:text-[#0A66C2] transition-all"
                title="Settings & AI Provider"
                aria-label="Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {/* Help button */}
              <button
                onClick={() => setShowUserGuide(true)}
                className="p-2 rounded-lg text-gray-600 hover:bg-[#EAF3FF] hover:text-[#0A66C2] transition-all"
                title="View user guide"
                aria-label="View user guide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

      {/* Input mode selector */}
      <InputModeSelector
        selectedMode={inputMode}
        onModeChange={handleInputModeChange}
        disabled={isLoading}
      />

      {/* Render different inputs per mode */}
      {inputMode === 'pdf' && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              📄 Upload resume PDF
            </label>
            <span className="text-xs text-green-600 font-semibold">✓ Secure</span>
          </div>
          <p className="text-xs text-gray-500 mb-2">
            Processed locally—no data leaves the browser. Text is extracted automatically and aligned with the correct section.
          </p>
          <FileUpload
            onTextExtracted={handlePDFTextExtracted}
            disabled={isLoading}
          />
        </div>
      )}

      {inputMode === 'manual' && (
        <div className="mb-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-green-800 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <strong>Recommended mode</strong> - Safest and most compliant input method
            </p>
          </div>
        </div>
      )}

      {/* 🔄 Enhancement: put section selector first */}
      {/* Section selector */}
      <SectionSelector
        selectedSection={currentSection}
        onSectionChange={handleSectionChange}
        disabled={isLoading}
      />

      {/* 🔄 Enhancement: screenshot module follows section selector */}
      {inputMode === 'screenshot' && (
        <div className="mb-4 mt-4">
          <div className="bg-[#EAF3FF] border border-[#B3D6F2] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#0A66C2] flex items-center">
                <span className="text-2xl mr-2">📸</span>
                LinkedIn screenshot analysis
              </h3>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-bold">
                Experimental
              </span>
            </div>

            <p className="text-xs text-[#0A66C2] mb-3">
              Use Gemini Vision API to analyze your LinkedIn screenshot and extract<strong>「{getSectionConfig(currentSection).label}」</strong>content, then deliver tailored suggestions.
            </p>

            {/* 💡 Page Zoom Tip */}
            <div className="mb-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <h4 className="text-xs font-bold text-yellow-900 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                💡 Pro tip: Zoom out to capture more content
              </h4>
              <ul className="text-xs text-yellow-800 mt-2 space-y-1">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Press <kbd className="px-1.5 py-0.5 bg-white rounded border border-yellow-300 text-[11px] font-mono">Ctrl -</kbd> (Windows) or <kbd className="px-1.5 py-0.5 bg-white rounded border border-yellow-300 text-[11px] font-mono">Cmd -</kbd> (Mac) to zoom out</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Recommended zoom: <strong>67-75%</strong> for sections like Experience, Education, Skills</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Or use browser menu (⋮ → Zoom) to adjust page size</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span className="text-yellow-700">📸 Lower zoom = more content in one screenshot = better AI analysis</span>
                </li>
              </ul>
            </div>

            {/* 📌 Screenshot preparation guidance */}
            <div className="mb-3 p-3 bg-indigo-50 border-l-4 border-indigo-400 rounded space-y-2">
              <h4 className="text-xs font-bold text-indigo-900 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                📋 Before capturing, complete these steps
              </h4>
              <ol className="text-xs text-indigo-800 list-decimal list-inside space-y-1.5 ml-2">
                <li>
                  On LinkedIn, click<strong>「{getSectionConfig(currentSection).label}」</strong> in the top-right of the section「<span className="bg-indigo-100 px-1 rounded">✏️ Edit</span>」 button
                  <div className="text-[11px] text-indigo-700 ml-5 mt-1">
                    Open the edit dialog so the entire section is visible.
                  </div>
                </li>
                <li>
                  Make sure the edit dialog is open or the section is<strong>fully expanded</strong> (click "See more")
                  <div className="text-[11px] text-indigo-700 ml-5 mt-1">
                    Avoid collapsed sections so the screenshot captures everything.
                  </div>
                </li>
              </ol>
            </div>

            <button
              onClick={handleScreenshotClick}
              disabled={isLoading || isCapturing}
              className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all shadow-md flex items-center justify-center space-x-2 ${
                isLoading || isCapturing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#0A66C2] text-white hover:bg-[#004182] active:scale-98'
              }`}
            >
              {isCapturing ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>📸 Capture LinkedIn page</span>
                </>
              )}
            </button>

            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              ⚠️ Review the disclaimer before use. Best suited for your own LinkedIn profile.
            </div>
          </div>
        </div>
      )}

      {/* Dynamic content input */}
      {(() => {
        const config = getSectionConfig(currentSection);
        return (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {config.icon} {config.label}
                {uploadedFileName && <span className="text-xs text-green-600 ml-2">(Extracted from PDF)</span>}
              </label>
            </div>
            <p className="text-xs text-gray-500 mb-2">{config.description}</p>
            {isPdfSource && (
              hasExtractedEntries ? (
                <div className="mb-2 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex flex-wrap gap-2">
                    {entriesForCurrentSection.map((entryContent, index) => {
                      const isActive = index === activeEntryIndex;
                      const previewLabel = generateEntryPreview(currentSection, entryContent);
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSectionEntrySelect(currentSection, index)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-all ${
                            isActive
                              ? 'bg-[#0A66C2] text-white border-[#0A66C2] shadow-sm'
                              : 'bg-white text-[#0A66C2] border-[#0A66C2] hover:bg-[#EAF3FF]'
                          }`}
                          title={`${previewLabel} (Entry ${index + 1})`}
                        >
                          {previewLabel}
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs text-[#0A66C2]">
                    Auto-extracted {entriesForCurrentSection.length} entries
                  </span>
                </div>
              ) : (
                <div className="mb-2 p-3 bg-[#EAF3FF] border border-[#B3D6F2] rounded text-xs text-[#0A66C2]">
                  💡 AI will analyze the full PDF and surface details related to this section.
                </div>
              )
            )}

            {/* 🎯 Show textarea only in manual mode */}
            {inputMode === 'manual' ? (
              <>
                <textarea
                  value={resumeContent}
                  onChange={(e) => setResumeContent(e.target.value)}
                  rows={config.rows}
                  maxLength={config.maxLength}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] transition-all"
                  placeholder={config.placeholder}
                />
                {/* Character count */}
                <CharacterCount content={resumeContent} sectionType={currentSection} />
              </>
            ) : (
              /* PDF/Screenshot modes: show helper text instead of textarea */
              <div className="mt-2 p-4 bg-[#EAF3FF] border border-[#B3D6F2] rounded-lg">
                {/* 🔧 Show "extracted/analyzed" only after successful parsing */}
                {inputMode === 'pdf' ? (
                  // PDF mode
                  uploadedFileName && fullPdfText ? (
                    <>
                      <p className="text-sm text-[#0A66C2] font-medium mb-1">
                        📋 PDF content extracted
                      </p>
                      <p className="text-xs text-[#0A66C2]">
                        {isPdfSource && hasExtractedEntries
                          ? `Showing entry ${activeEntryIndex + 1} of ${entriesForCurrentSection.length}`
                          : 'Click Optimize below to generate LinkedIn recommendations'
                        }
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-[#0A66C2] text-center">
                      📁 Upload a PDF file first
                    </p>
                  )
                ) : (
                  // Screenshot mode
                  Object.keys(sectionEntries).length > 0 || resumeContent.trim() ? (
                    <>
                      <p className="text-sm text-[#0A66C2] font-medium mb-1">
                        📋 Screenshot content analyzed
                      </p>
                      <p className="text-xs text-[#0A66C2]">
                        Click Optimize below to generate LinkedIn recommendations
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-[#0A66C2] text-center">
                      📸 Capture a LinkedIn screenshot first
                    </p>
                  )
                )}
              </div>
            )}
          </div>
        );
      })()}

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            🎯 Target job description
          </label>
          <span className="text-xs text-gray-500">Optional - recommended</span>
        </div>
        <p className="text-xs text-gray-500 mb-2">
          Adding a job description lets the AI pull keywords and improve ATS alignment.
        </p>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] transition-all"
          placeholder="For example: We are seeking an experienced software engineer skilled in React, TypeScript, and Node.js..."
        />
      </div>

      {/* Main optimize button - manual and PDF modes only */}
      {inputMode !== 'screenshot' && (
        <button
          onClick={handleOptimize}
          disabled={isLoading || (!resumeContent.trim() && !(isPdfSource && fullPdfText))}
          className={`w-full mt-6 py-3 px-4 rounded-lg text-sm font-semibold transition-all shadow-md ${
            isLoading || (!resumeContent.trim() && !(isPdfSource && fullPdfText))
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#0A66C2] text-white hover:bg-[#004182] active:scale-98 shadow-blue-200'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Optimizing...
            </span>
          ) : (
            '✨ Optimize with Gemini AI'
          )}
        </button>
      )}

      {/* Screenshot mode hint */}
      {inputMode === 'screenshot' && (
        <div className="mt-6 p-4 bg-[#EAF3FF] border border-[#B3D6F2] rounded-lg">
          <p className="text-sm text-[#0A66C2] text-center font-semibold">
            💡 In screenshot mode, click "📸 Capture LinkedIn page" above to analyze.
          </p>
        </div>
      )}

      {/* Optimization output area - structured component */}
      <div className="mt-6">
        {isLoading ? (
          <div className="p-8 rounded-lg border-2 border-[#B3D6F2] bg-[#EAF3FF]">
            <LoadingSpinner />
            <p className="text-center text-sm text-[#0A66C2] mt-3">
              {optimizedText}
            </p>
          </div>
        ) : structuredResult ? (
          // Render structured results
          <div className="space-y-4">
            <OptimizationResult
              sectionType={currentSection}
              data={structuredResult}
            />

            {/* Usage tips */}
            <div className="mt-4 space-y-2">
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-xs text-green-800 font-medium flex items-start mb-2">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Optimization complete! How to use:
                </p>
                <ol className="text-xs text-green-700 ml-6 space-y-1">
                  <li>1. Each field has a dedicated copy button in the top-right corner.</li>
                  <li>2. Click copy and paste the text into the corresponding LinkedIn field.</li>
                  <li>3. Character limits already match LinkedIn requirements.</li>
                  <li>4. Adjust the copy to reflect your actual experience.</li>
                </ol>
              </div>
              <div className="p-3 bg-[#EAF3FF] border border-[#B3D6F2] rounded-md">
                <p className="text-xs text-[#0A66C2] flex items-start">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  💡 Tip: Treat AI suggestions as references. Ensure accuracy before updating LinkedIn.
                </p>
              </div>
            </div>
          </div>
        ) : optimizedText ? (
          // Show plain-text results or waiting/error states
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#0A66C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Optimization Result
              </h2>
              {!optimizedText.includes('⚠️') && !optimizedText.toLowerCase().includes('waiting') && !optimizedText.includes('PDF') && (
                <CopyButton text={optimizedText} disabled={isLoading} />
              )}
            </div>

            <div className={`p-4 rounded-lg border-2 min-h-[120px] ${
              optimizedText.includes('⚠️')
                ? 'bg-red-50 border-red-200'
                : optimizedText.toLowerCase().includes('waiting') || optimizedText.includes('PDF')
                ? 'bg-[#EAF3FF] border-[#B3D6F2]'
                : 'bg-white border-gray-200 shadow-sm'
            }`}>
              <div className={`text-sm leading-relaxed ${
                optimizedText.includes('⚠️')
                  ? 'text-red-800'
                  : optimizedText.toLowerCase().includes('waiting') || optimizedText.includes('PDF')
                  ? 'text-[#0A66C2]'
                  : 'text-gray-800'
              }`}>
                {optimizedText.split('\n').map((line, index) => (
                  <p key={index} className={`${line.startsWith('•') ? 'ml-2 mb-3' : 'mb-2'}`}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
      </div>
    </>
  );
}

export default App;
