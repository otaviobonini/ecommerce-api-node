import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "../schemas/env.schema.js";

const bucketName = env.BUCKET_NAME;
const bucketRegion = env.BUCKET_REGION;
const awsAccessKeyId = env.AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  },
  region: bucketRegion,
});

const params = {
  Bucket: bucketName,
  Key: fileOriginalName,
  Body: fileBuffer,
  ContentType: fileMimetype,
};

export const command = new PutObjectCommand(params);

await s3.send(command);
