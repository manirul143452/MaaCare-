
import { GoogleGenAI, Type } from "@google/genai";

// Initialize GoogleGenAI with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using gemini-flash-lite-latest for low-latency, high-speed responses.
const LOW_LATENCY_MODEL = 'gemini-flash-lite-latest';
// Using gemini-3-flash-preview for multimodal tasks (Vision + Text)
const MULTIMODAL_MODEL = 'gemini-3-flash-preview';

export const getAICompanionResponse = async (
  history: { role: 'user' | 'assistant', content: string }[], 
  message: string, 
  imageData?: { data: string, mimeType: string }
) => {
  const parts: any[] = [{ text: message || "Please analyze the attached image and provide guidance based on the context of pregnancy or childcare." }];
  
  if (imageData) {
    parts.push({
      inlineData: {
        data: imageData.data,
        mimeType: imageData.mimeType
      }
    });
  }

  const response = await ai.models.generateContent({
    model: imageData ? MULTIMODAL_MODEL : LOW_LATENCY_MODEL,
    contents: [
      ...history.map(h => ({ 
        role: h.role === 'user' ? 'user' : 'model', 
        parts: [{ text: h.content }] 
      })),
      { role: 'user', parts: parts }
    ],
    config: {
      systemInstruction: `You are MaaCare AI, a compassionate and expert multimodal companion for mothers and parents. 
      
      VISION CAPABILITIES:
      - If the user provides an image (e.g., a skin rash, a baby's symptom, a nutrition label, or an ultrasound), analyze it with extreme care.
      - Act as a TRIAGE tool. Describe what you see objectively before offering supportive advice.
      - For medical concerns (like rashes), suggest possible causes (e.g., "This looks like it could be heat rash") but emphasize you cannot diagnose.
      - If the image is unclear, ask the user for a better photo in bright, natural light.
      
      SAFETY & PERSONA:
      - Always include a clear disclaimer: "I am an AI assistant, not a doctor. This analysis is for informational purposes only."
      - If symptoms look severe (based on the image or text), strongly advise contacting a pediatrician or emergency services immediately.
      - Keep responses empathetic, concise, and evidence-based.
      - Use formatting (bullet points) for better readability.`,
    }
  });
  
  return response.text;
};

export const checkSymptoms = async (symptoms: string) => {
  const response = await ai.models.generateContent({
    model: LOW_LATENCY_MODEL,
    contents: `Analyze these symptoms for a mother or child: ${symptoms}`,
    config: {
      systemInstruction: "You are a medical triage assistant. Analyze symptoms provided and suggest possible next steps (e.g., monitor, call a doctor, go to ER). ALWAYS prioritize safety and emphasize that this is not a diagnosis. Use a structured, clear, and very concise format for rapid delivery.",
    }
  });
  return response.text;
};

export const getWeeklyDeepDive = async (week: number) => {
  const response = await ai.models.generateContent({
    model: LOW_LATENCY_MODEL,
    contents: `Provide a "Superpower Fact" for pregnancy week ${week}.`,
    config: {
      systemInstruction: "You are a friendly pregnancy expert. Focus on the 'magic' of development. Keep it extremely brief (max 2 sentences).",
    }
  });
  return response.text;
};

export const generateCommunityTips = async (category: string = "General Parenting") => {
  const response = await ai.models.generateContent({
    model: LOW_LATENCY_MODEL,
    contents: `Generate 3 trending parenting discussion topics for a community forum specifically about "${category}".`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            author: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "content", "author", "tags"]
        }
      }
    }
  });
  const jsonStr = response.text?.trim();
  return jsonStr ? JSON.parse(jsonStr) : [];
};

export const generateNutritionTips = async (stage: string = "Trimester 2") => {
  const response = await ai.models.generateContent({
    model: LOW_LATENCY_MODEL,
    contents: `Generate 3 personalized nutrition tips for a mother in ${stage}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            title: { type: Type.STRING },
            content: { type: Type.STRING }
          },
          required: ["category", "title", "content"]
        }
      }
    }
  });
  const jsonStr = response.text?.trim();
  return jsonStr ? JSON.parse(jsonStr) : [];
};
