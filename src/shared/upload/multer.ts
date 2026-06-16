import multer from "multer";
import { env } from "../../config/env";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, env.UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: env.MAX_FILE_SIZE,
  },
});
