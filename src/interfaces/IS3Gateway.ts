export interface IS3Gateway {
  uploadFile(buffer: Buffer, key: string, mimetype: string): Promise<string>;
  deleteFile(key: string): Promise<void>;
}
