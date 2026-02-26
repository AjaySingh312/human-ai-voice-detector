import fs from 'fs/promises';
import { analyzeAudio } from '../services/aiService.js';

export async function analyzeAudioController(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ message: 'No audio file uploaded.' });
  }

  try {
    const analysis = await analyzeAudio(req.file.path, req.file);

    res.status(200).json({
      message: 'Analysis completed successfully',
      file: {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size
      },
      analysis
    });
  } catch (error) {
    next(error);
  } finally {
    await fs.unlink(req.file.path).catch(() => {});
  }
}
