
import { GoogleGenAI, Type } from "@google/genai";

// Always use named parameter for apiKey and use process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDailyQuote = async (): Promise<{ quote: string; author: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate an inspiring, short educational quote for high school students. Return the quote and the author as a JSON object.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: { type: Type.STRING },
            author: { type: Type.STRING }
          },
          required: ["quote", "author"]
        }
      }
    });

    // Access the .text property directly
    const data = JSON.parse(response.text || "{}");
    return data;
  } catch (error) {
    console.error("Error fetching quote:", error);
    return {
      quote: "The beautiful thing about learning is that no one can take it away from you.",
      author: "B.B. King"
    };
  }
};

export const getAdmissionChatResponse = async (query: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an AI assistant for Queen Marvellous College Admissions. Answer the following student/parent query warmly: "${query}"`,
      config: {
        systemInstruction: `You represent Queen Marvellous College, a prestigious and welcoming institution located at Pastor Tihunnu Street, Ikoga Zebbe, Ikoga Badagry. Our core values are Excellence, Integrity, and Innovation. 
        If anyone asks for contact details: 
        - Address: Pastor Tihunnu Street, Ikoga Zebbe, Ikoga Badagry.
        - Phone: 07015002169.
        Be professional, helpful, and encourage them to visit our campus.`
      }
    });
    return response.text || "I'm sorry, I couldn't process your request. Please contact our front desk at 07015002169.";
  } catch (error) {
    return "Our admissions team at Ikoga Badagry will get back to you shortly. You can reach us at 07015002169.";
  }
};
