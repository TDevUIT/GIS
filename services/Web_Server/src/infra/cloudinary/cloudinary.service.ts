/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
import { Injectable, Logger } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import * as streamifier from 'streamifier';
import type { File as MulterFile } from 'multer';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  uploadFile(file: MulterFile): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) return reject(error);
          if (!result)
            return reject(
              new Error('Cloudinary upload failed: No result returned.'),
            );
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  uploadBuffer(
    buffer: Buffer,
    publicId?: string,
    folder?: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const options: any = { resource_type: 'auto' };
      if (publicId) options.public_id = publicId;
      if (folder) options.folder = folder;

      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) {
            this.logger.error('Cloudinary uploadBuffer error:', error);
            return reject(error);
          }
          if (!result) {
            this.logger.error('Cloudinary uploadBuffer returned no result.');
            return reject(
              new Error('Cloudinary upload failed: No result returned.'),
            );
          }
          this.logger.log(
            `Buffer uploaded via uploadBuffer: ${result.public_id}`,
          );
          resolve(result);
        },
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }
  uploadVideo(file: MulterFile): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'video' },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) return reject(error);
          if (!result)
            return reject(
              new Error('Cloudinary upload failed: No result returned.'),
            );
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  deleteFile(publicId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }
}
