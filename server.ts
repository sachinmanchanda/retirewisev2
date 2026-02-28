import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set server timeout to 5 minutes (300,000 ms)
  app.use((req, res, next) => {
    res.setTimeout(300000, () => {
      console.log('Request has timed out.');
      res.status(408).send('Request has timed out.');
    });
    next();
  });

  app.use(express.json());

  // API health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Secure AI Advisor Endpoint
  app.post("/api/advice", async (req, res) => {
    try {
      const { data, country, requiredCorpus, balanceAtRetirement, additionalSavings, model = 'gemini' } = req.body;

      const prompt = `
        As a professional financial advisor, analyze the following retirement plan and provide concise, actionable advice.
        
        Context:
        Country: ${country.name} (Currency: ${country.currencyCode})
        Withdrawal Strategy: ${data.strategy === 'block' ? `Bucket strategy (Bucket Size: ${data.blockSize} years)` : 'Normal (Direct Withdrawal)'}

        Data:
        Current Age: ${data.currentAge}
        Retirement Age: ${data.retirementAge}
        Current Savings: ${country.currencySymbol}${data.currentSavings}
        Monthly Contribution: ${country.currencySymbol}${data.monthlyContribution} (${data.contributionType === 'step-up' ? `Step-up: Increases by ${data.stepUpRate}% annually` : 'Fixed amount'})
        Expected Annual Return: ${data.expectedReturn}%
        Expected Inflation: ${data.inflationRate}%
        Planned Spending in Retirement: ${country.currencySymbol}${data.monthlySpending}/month (${country.currencySymbol}${data.monthlySpending * 12}/year) (Current Value)
        Life Expectancy: ${data.lifeExpectancy}
        
        Calculated Metrics:
        Projected Balance at Retirement (at age ${data.retirementAge}): ${country.currencySymbol}${balanceAtRetirement.toLocaleString()}
        Estimated Required Corpus at Retirement: ${country.currencySymbol}${requiredCorpus.toLocaleString()}
        Savings Shortfall: ${country.currencySymbol}${(requiredCorpus - balanceAtRetirement).toLocaleString()}
        Additional Monthly Savings Needed (Fixed): ${country.currencySymbol}${additionalSavings.fixed.toLocaleString()}
        Additional Monthly Savings Needed (Step-up at ${data.stepUpRate}% annual growth): ${country.currencySymbol}${additionalSavings.stepUp.toLocaleString()}
        
        Please provide:
        1. A summary of the plan's feasibility considering the ${country.name} context.
        2. 3-4 specific recommendations to improve the outcome, including thoughts on the chosen ${data.strategy} strategy.
        3. A brief risk assessment.
        
        Format the response as Markdown.
      `;

      if (model === 'grok') {
        const grokKey = process.env.XAI_API_KEY;
        console.log("XAI_API_KEY present:", !!grokKey);
        if (!grokKey) {
          return res.status(500).json({ error: "XAI_API_KEY is not set in the server environment variables." });
        }

        const grokResponse = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${grokKey.trim()}`
          },
          body: JSON.stringify({
            model: "grok-2-1212", 
            messages: [
              { role: "system", content: "You are a professional financial advisor." },
              { role: "user", content: prompt }
            ],
            temperature: 0.7
          })
        });

        if (!grokResponse.ok) {
          const errorText = await grokResponse.text();
          let errorMessage = "Grok API error";
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error?.message || errorData.message || JSON.stringify(errorData);
          } catch (e) {
            errorMessage = `Grok API error (${grokResponse.status}): ${errorText}`;
          }
          console.error("Grok API Error Response:", errorText);
          throw new Error(errorMessage);
        }

        const grokResult = await grokResponse.json();
        return res.json({ text: grokResult.choices[0].message.content });
      } else {
        // Default to Gemini
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          return res.status(500).json({ 
            error: "GEMINI_API_KEY is not set in the server environment variables." 
          });
        }

        const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [{ parts: [{ text: prompt }] }],
        });

        res.json({ text: response.text || "The AI returned an empty response." });
      }
    } catch (error: any) {
      console.error("Server AI Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Debug: Log unknown API calls
  app.all("/api/*", (req, res) => {
    console.warn(`Unknown API call: ${req.method} ${req.url}`);
    res.status(404).json({ error: "Route not found", url: req.url });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

  return app;
}

const appPromise = startServer();

export default async (req: any, res: any) => {
  const app = await appPromise;
  app(req, res);
};
