// 1. Import Firebase App SDK
import { initializeApp } from "firebase/app";
// 2. Import the Firebase AI SDK
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

// 3. Firebase project configuration (from your console)
const firebaseConfig = {
  apiKey: "AIzaSyBovSw6r0EJcgiDmbuYF-fmAe2F_ahYg-M",
  authDomain: "hackthon-d6c87.firebaseapp.com",
  projectId: "hackthon-d6c87",
  storageBucket: "hackthon-d6c87.firebasestorage.app",
  messagingSenderId: "802867061983",
  appId: "1:802867061983:web:e17d94a6576399c8b1b56a",
  measurementId: "G-217M2SM7N1"
};

// 4. Initialize Firebase App
const firebaseApp = initializeApp(firebaseConfig);

// 5. Initialize Gemini Developer API backend service
const ai = getAI(firebaseApp, {
  backend: new GoogleAIBackend(),
  useLimitedUseAppCheckTokens: true
});

// 6. Create and export a generative model instance for React components
export const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

/**
 * Analyze a screenshot using Gemini Vision API
 * @param imageDataUrl base64-encoded image data URL
 * @param prompt analysis prompt
 * @returns AI analysis result
 */
export async function analyzeScreenshot(
  imageDataUrl: string,
  prompt: string
): Promise<string> {
  try {
    // Remove the data:image/png;base64, prefix
    const base64Data = imageDataUrl.split(',')[1];

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Data
        }
      },
      { text: prompt }
    ]);

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Vision API call failed:", error);
    if (error instanceof Error) {
      throw new Error(`Screenshot analysis failed: ${error.message}`);
    }
    throw new Error('Screenshot analysis failed. Please try again.');
  }
}
