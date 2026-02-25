import { GoogleGenAI } from "@google/genai";
import { RetirementData, Country } from "../types";

export async function getRetirementAdvice(
  data: RetirementData, 
  country: Country, 
  requiredCorpus: number,
  additionalSavings: { fixed: number; stepUp: number }
) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const response = await fetch("/api/advice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        data,
        country,
        requiredCorpus,
        additionalSavings,
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch advice from server");
    }

    const result = await response.json();
    return result.text;
  } catch (error: any) {
    console.error("Error fetching AI advice:", error);
    return `Error: ${error.message || "I couldn't connect to the AI advisor right now."}`;
  }
}