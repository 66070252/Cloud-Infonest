import multer from 'multer';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import path from 'path';

// 1. ตั้งค่าการเชื่อมต่อ S3
// (โค้ดนี้จะอ่านกุญแจจาก process.env ที่เราตั้งไว้ใน .env)
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
  }
});

// 2. ตั้งค่า multer-s3
const uploadMiddleware = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    acl: 'public-read', // ตั้งค่าไฟล์ให้อ่านได้แบบสาธารณะ
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // สร้างชื่อไฟล์ใหม่ที่ไม่ซ้ำกัน
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      cb(null, 'infonest-' + uniqueSuffix + extension);
    }
  })
});

export default uploadMiddleware;