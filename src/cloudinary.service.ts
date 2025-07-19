import { v2 } from 'cloudinary';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor() {
    v2.config({
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      cloud_name: process.env.CLOUDINARY_NAME,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const stream = v2.uploader.upload_stream(
        { folder: 'uploads/' },
        (err, result) => {
          if (err) return reject(err);
          resolve(result?.secure_url as string);
        },
      );

      Readable.from(file.buffer).pipe(stream);
    });
  }
}
