// 1. 导入 Firebase App SDK
import { initializeApp } from "firebase/app";
// 2. 导入最新的 Firebase AI SDK
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

// 3. 您的 Firebase 项目配置 (来自您的控制台)
const firebaseConfig = {
  apiKey: "AIzaSyBovSw6r0EJcgiDmbuYF-fmAe2F_ahYg-M",
  authDomain: "hackthon-d6c87.firebaseapp.com",
  projectId: "hackthon-d6c87",
  storageBucket: "hackthon-d6c87.firebasestorage.app",
  messagingSenderId: "802867061983",
  appId: "1:802867061983:web:e17d94a6576399c8b1b56a",
  measurementId: "G-217M2SM7N1"
};

// 4. 初始化 Firebase App
const firebaseApp = initializeApp(firebaseConfig);

// 5. 初始化 Gemini Developer API 后端服务
const ai = getAI(firebaseApp, { 
    backend: new GoogleAIBackend(),
  useLimitedUseAppCheckTokens: true 
});

// 6. 创建一个生成模型实例并导出，供您的 React 组件使用
//    (使用您计划中的 'gemini-2.5-flash' 模型)
export const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

/**
 * 使用 Gemini Vision API 分析截图
 * @param imageDataUrl base64 编码的图片数据 URL
 * @param prompt 分析提示词
 * @returns AI 分析结果
 */
export async function analyzeScreenshot(
  imageDataUrl: string,
  prompt: string
): Promise<string> {
  try {
    // 提取 base64 数据（移除 data:image/png;base64, 前缀）
    const base64Data = imageDataUrl.split(',')[1];

    // 使用 Gemini 模型进行图片分析
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
    console.error("Vision API 调用失败:", error);
    if (error instanceof Error) {
      throw new Error(`图片分析失败: ${error.message}`);
    }
    throw new Error('图片分析失败，请重试');
  }
}