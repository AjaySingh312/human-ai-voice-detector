import { Router } from 'express';
import { analyzeAudioController } from '../controllers/analyzeController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/analyze', upload.single('audio'), analyzeAudioController);

export default router;
