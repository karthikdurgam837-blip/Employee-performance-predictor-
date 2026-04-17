import { GoogleGenAI } from "@google/genai";
import { Employee } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getManagerialInsights(employee: Employee): Promise<string> {
  const prompt = `
    As an AI HR Consultant, analyze the following employee performance data and provide a concise, professional recommendation (2-3 sentences).
    
    Data:
    - Name: ${employee.name}
    - Department: ${employee.department}
    - Tenure: ${employee.tenureMonths} months
    - Review Score: ${employee.lastReviewScore}/5
    - Projects Completed: ${employee.projectsCompleted}
    - Training Hours: ${employee.trainingHours}
    - Predicted Performance: ${employee.predictedPerformance} (${(employee.predictionProbability! * 100).toFixed(1)}% confidence)
    
    Focus on specific actions like:
    - Should they be considered for promotion?
    - Do they need specific training?
    - Is there a risk of plateauing?
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text ?? "Unable to generate insights at this time.";
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Error connecting to AI service. Please try again later.";
  }
}
