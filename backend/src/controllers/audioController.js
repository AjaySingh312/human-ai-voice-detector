import fs from "fs/promises";
import { analyzeAudio } from "../services/aiService.js";

export const analyzeAudioController = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: { message: "No audio file uploaded." },
      });
    }

    const { path: filePath, originalname, mimetype, size } = req.file;

    const analysis = await analyzeAudio({
      filePath,
      originalName: originalname,
      mimeType: mimetype,
      size,
    });

    // Clean up uploaded file after processing to avoid disk bloat
    try {
      await fs.unlink(filePath);
    } catch (cleanupErr) {
      console.warn("Failed to delete temp file:", cleanupErr.message);
    }

    return res.json({
      success: true,
      file: {
        name: originalname,
        mimeType: mimetype,
        size,
      },
      analysis,
    });
  } catch (err) {
    return next(err);
  }
};
