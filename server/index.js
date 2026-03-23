import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing in .env");
  process.exit(1);
}

console.log("✅ Gemini API Key Loaded");

// Initialize new GenAI SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/diagnose", async (req, res) => {
  try {
    console.log("Incoming body:", req.body);

    const { pet, symptoms } = req.body;

    if (!symptoms) {
      return res.status(400).json({ error: "Symptoms required" });
    }

    const prompt = `
You are a veterinary AI assistant.

Pet Details:
Name: ${pet?.name}
Species: ${pet?.species}
Breed: ${pet?.breed}
Age: ${pet?.age}
Weight: ${pet?.weight} kg
Notes: ${pet?.healthNotes}

Current Readings:
${symptoms}

Provide:
1. Health status
2. Possible risks
3. Recommendations
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    res.json({
      diagnosis: response.text,
    });

  } catch (error) {
    console.error("❌ Diagnosis Error:", error);
    res.status(500).json({ error: "Diagnosis failed" });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
