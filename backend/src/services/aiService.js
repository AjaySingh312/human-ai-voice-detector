import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ensure we load environment variables from the backend root no matter
// where the process is started.  `dotenv` uses `process.cwd()` by default,
// which can be the workspace root when running from VS Code tasks or the
// monorepo level.  Build an absolute path relative to this file instead.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "..", "..", ".env"),
});

import axios from "axios";
import fs from "fs/promises";


/**
 * Analyze audio using the Google Gemini API.
 *
 * Expects the following env vars (see .env.example):
 * - GEMINI_API_KEY       - Your Google AI Studio API key
 * - GEMINI_MODEL         - (optional) Model name, default: gemini-1.5-flash
 */
export const analyzeAudio = async ({ filePath, originalName, mimeType, size }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it to backend/.env to enable Gemini analysis."
    );
  }

  const model =
    process.env.GEMINI_MODEL && process.env.GEMINI_MODEL.trim().length > 0
      ? process.env.GEMINI_MODEL.trim()
      : "gemini-3-flash-preview";

  // Read and base64-encode the audio file
  const audioBuffer = await fs.readFile(filePath);
  const base64Audio = audioBuffer.toString("base64");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
    apiKey
  )}`;

  const systemPrompt =
    "You are an audio forensics assistant. You receive a short audio clip of a voice " +
    "and must estimate: (1) how clear the voice is, (2) how strong the background noise is, " +
    "(3) how likely it is that there is clear speech from a single speaker, and (4) whether " +
    "the voice feels more like a natural human voice or synthetic/AI-generated. " +
    "Return your answer strictly as compact JSON with the following shape and nothing else: " +
    "{ \"verdict\": string, \"metrics\": { \"voiceClarity\": number, \"noiseLevel\": number, \"speechProbability\": number }, \"insights\": string[] }. " +
    "All metric values should be between 0 and 100. The verdict should be one short sentence.";

  let parsed;

  try {
    const response = await axios.post(
      url,
      {
        contents: [
          {
            parts: [
              { text: systemPrompt },
              {
                inlineData: {
                  mimeType: mimeType || "audio/wav",
                  data: base64Audio,
                },
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 60_000,
      }
    );

    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      response.data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .filter(Boolean)
        .join(" ");

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    // Gemini may wrap JSON in markdown fences; strip common wrappers.
    const cleaned = text
      .trim()
      .replace(/^```json/i, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error("Gemini API error:", err.response?.data || err.message || err);
    throw new Error("Failed to analyze audio with Gemini. Please try again.");
  }

  const verdict = parsed.verdict || "Analysis available";
  const metrics = parsed.metrics || {};
  const insights = Array.isArray(parsed.insights) ? parsed.insights : [];

  return {
    verdict,
    metrics: {
      voiceClarity: Number.isFinite(metrics.voiceClarity)
        ? metrics.voiceClarity
        : 0,
      noiseLevel: Number.isFinite(metrics.noiseLevel) ? metrics.noiseLevel : 0,
      speechProbability: Number.isFinite(metrics.speechProbability)
        ? metrics.speechProbability
        : 0,
    },
    insights,
    meta: {
      fileName: originalName,
      mimeType,
      size,
      analyzedAt: new Date().toISOString(),
      model,
    },
  };
};
