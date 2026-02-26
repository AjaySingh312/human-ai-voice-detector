import fs from 'fs/promises';
import { env } from '../config/env.js';
import { formatBytes } from '../utils/fileUtils.js';

function buildPrompt(fileMeta) {
  return `You are an expert forensic audio analyst. Return concise JSON with fields: verdict, confidence (0-100), summary, indicators (array of strings), and recommendation.\n\nAudio metadata:\n- filename: ${fileMeta.originalname}\n- mime: ${fileMeta.mimetype}\n- size: ${formatBytes(fileMeta.size)}\n\nYou do not have the raw waveform, so base your assessment on metadata uncertainty and clearly acknowledge limitations.`;
}

async function analyzeWithExternalAI(fileMeta) {
  const response = await fetch(env.aiApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.aiApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an AI voice authenticity analyst.'
        },
        {
          role: 'user',
          content: buildPrompt(fileMeta)
        }
      ],
      temperature: 0.3
    })
  });

  if (!response.ok) {
    throw new Error(`External AI API error: ${response.status}`);
  }

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content;

  return {
    provider: 'external-ai',
    raw: rawText,
    parsed: rawText
  };
}

async function analyzeWithLocalHeuristic(filePath, fileMeta) {
  const stats = await fs.stat(filePath);
  const filename = fileMeta.originalname.toLowerCase();
  const suspiciousName = /(synthetic|clone|tts|generated|ai)/.test(filename);
  const mediumSize = stats.size > 400 * 1024 && stats.size < 8 * 1024 * 1024;

  const confidence = suspiciousName ? 78 : mediumSize ? 60 : 52;
  const verdict = suspiciousName ? 'Likely AI-generated' : 'Inconclusive';

  return {
    provider: 'local-heuristic',
    parsed: {
      verdict,
      confidence,
      summary:
        'This fallback model uses filename and file-size heuristics only. Plug in a real audio intelligence API key for production-grade analysis.',
      indicators: [
        `File size: ${formatBytes(stats.size)}`,
        suspiciousName
          ? 'Filename includes synthetic/AI keywords.'
          : 'No obvious synthetic keywords in filename.',
        'Heuristic mode enabled because AI API key is missing.'
      ],
      recommendation:
        'Run spectral and speaker-consistency checks using a dedicated audio forensics provider before making high-stakes decisions.'
    }
  };
}

export async function analyzeAudio(filePath, fileMeta) {
  if (env.aiApiKey) {
    try {
      return await analyzeWithExternalAI(fileMeta);
    } catch (error) {
      return {
        provider: 'external-ai-fallback',
        error: error.message,
        ...(await analyzeWithLocalHeuristic(filePath, fileMeta))
      };
    }
  }

  return analyzeWithLocalHeuristic(filePath, fileMeta);
}
