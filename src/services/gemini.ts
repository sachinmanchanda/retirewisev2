import { RetirementData, Country } from "../types";

export async function getRetirementAdvice(
  data: RetirementData, 
  country: Country, 
  requiredCorpus: number,
  balanceAtRetirement: number,
  additionalSavings: { fixed: number; stepUp: number }
) {
  try {
    const response = await fetch("/api/advice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data,
        country,
        requiredCorpus,
        balanceAtRetirement,
        additionalSavings,
      }),
    });

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
