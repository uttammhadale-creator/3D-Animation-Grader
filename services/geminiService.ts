import { GoogleGenAI, Type } from "@google/genai";
import { RUBRIC_DATA } from "../constants";
import { AnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert Professor of 3D Animation. Grade this submission based on the rubric.
Output a score and a concise critique for each category.

IMPORTANT: All critiques and comments MUST be in Simplified Chinese.

Rubric:
${RUBRIC_DATA.map(r => `- ${r.id} (${r.maxScore}pts): ${r.description}`).join('\n')}

Output JSON:
{
  "scores": { "theme": number, ... },
  "reasoning": { "theme": "string", ... },
  "overallComment": "string"
}
`;

export const analyzeAnimationFrames = async (
  base64Images: string[],
  projectDescription: string
): Promise<AnalysisResult> => {
  // Always use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Prepare contents by combining images and text in one array definition
  // This allows TypeScript to correctly infer the union type for the array elements
  const parts = [
    ...base64Images.map(img => ({
      inlineData: {
        data: img.replace(/^data:image\/\w+;base64,/, ""),
        mimeType: "image/jpeg"
      }
    })),
    {
      text: `Grade this animation. Description: ${projectDescription || "None"}.`
    }
  ];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scores: {
              type: Type.OBJECT,
              properties: RUBRIC_DATA.reduce((acc, curr) => ({
                ...acc,
                [curr.id]: { type: Type.INTEGER }
              }), {}),
              required: RUBRIC_DATA.map(r => r.id)
            },
            reasoning: {
              type: Type.OBJECT,
              properties: RUBRIC_DATA.reduce((acc, curr) => ({
                ...acc,
                [curr.id]: { type: Type.STRING }
              }), {}),
              required: RUBRIC_DATA.map(r => r.id)
            },
            overallComment: { type: Type.STRING }
          },
          required: ["scores", "reasoning", "overallComment"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};