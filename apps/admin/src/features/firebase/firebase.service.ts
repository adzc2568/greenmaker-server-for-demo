import { Injectable } from '@nestjs/common';
import { getStorage } from 'firebase-admin/storage';
import { errorHandler } from 'common/methods/error-handler';

@Injectable()
export class FirebaseService {
  public readonly bucket = getStorage().bucket(
    'gs://mrgreen-dbf25.appspot.com',
  );

  constructor() {}

  public async uploadOne(
    path: string,
    buffer: Buffer,
  ): Promise<{
    data?: { BasePath: string };
    error?: Error;
  }> {
    return new Promise(async (resolve) => {
      const blob = this.bucket.file(path);
      const blobStream = blob.createWriteStream();

      blobStream.on('error', (error) => resolve({ error }));
      blobStream.on('finish', async () => {
        const file = this.bucket.file(path);
        const [metadata] = await file.getMetadata();
        const BasePath = encodeURIComponent(metadata.name);
        resolve({
          data: {
            BasePath,
          },
        });
      });

      blobStream.end(buffer);
    });
  }

  public async deleteOne(path: string) {
    try {
      const file = this.bucket.file(path);
      await file.delete(); // res 204 no-content
      return {};
    } catch (error) {
      return { error };
    }
  }
}
