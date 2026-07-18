import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { env } from "../schemas/env.schema.js";
import { IS3Gateway } from "../interfaces/IS3Gateway.js";

export class S3Gateway implements IS3Gateway {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
      region: env.BUCKET_REGION,
    });
  }

  async uploadFile(
    buffer: Buffer,
    key: string,
    mimetype: string,
  ): Promise<string> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: env.BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
      }),
    );
    // CDN_URL é a URL base do CloudFront (ex: https://xxx.cloudfront.net);
    // o bucket fica privado atrás do OAC e toda entrega passa pelo CDN
    return `${env.CDN_URL}/${key}?v=${Date.now()}`;
  }

  async deleteFile(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: env.BUCKET_NAME,
        Key: key,
      }),
    );
  }
}
