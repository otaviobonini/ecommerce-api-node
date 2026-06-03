import { ProductImage } from "@prisma/client";

export interface IImageRepository {
  uploadImage(productId: number, url: string): Promise<ProductImage>;
  deleteImage(imageId: number): Promise<ProductImage>;
  setPrimaryImage(productId: number, imageId: number): Promise<void>;
  findImageById(imageId: number): Promise<ProductImage | null>;
}
