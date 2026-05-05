/**
 * scripts/list-models.mjs
 * Simple script to check which Gemini models are available for the current API key.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
  try {
    console.log("Checking models for API key...");
    const models = await genAI.listModels();
    console.log("Available models:");
    models.models.forEach((m) => {
      console.log(`- ${m.name} (supports: ${m.supportedGenerationMethods.join(", ")})`);
    });
  } catch (err) {
    console.error("Error listing models:", err.message);
  }
}

main();
