import multer from 'multer';
import path from 'path';

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'src/uploads');
    },
    filename(req, file, cb) {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  }),
  limits: {
    fileSize: 25 * 1024 * 1024
  },
  fileFilter(req, file, cb) {
    const isAudio = file.mimetype.startsWith('audio/');
    if (!isAudio) {
      return cb(new Error('Only audio files are allowed.'));
    }

    cb(null, true);
  }
});

export default upload;
