import { v2 } from 'cloudinary';
import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload-ts';

@Injectable()
export class CloudinaryService {
  constructor() {
    v2.config({
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      cloud_name: process.env.CLOUDINARY_NAME,
    });
  }

  async uploadFile(file: FileUpload) {
    const { createReadStream } = file;
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = v2.uploader.upload_stream(
        { folder: 'uploads' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      createReadStream().pipe(stream);
    });
    return uploadResult;
  }
}
