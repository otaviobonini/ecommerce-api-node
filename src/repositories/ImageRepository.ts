import { ProductImage } from "@prisma/client";
import { IImageRepository } from "../types/IImageRepository.js";
import { prisma } from "../database/prisma.js";

export class ImageRepository implements IImageRepository {
  async uploadImage(productId: number, url: string): Promise<ProductImage> {
    return prisma.productImage.create({
      data: { productId, url, isPrimary: false },
    });
  }

  async deleteImage(imageId: number): Promise<ProductImage> {
    return prisma.productImage.delete({ where: { imageId } });
  }

  async setPrimaryImage(productId: number, imageId: number): Promise<void> {
    await prisma.productImage.updateMany({
      where: { productId, isPrimary: true },
      data: { isPrimary: false },
    });
    await prisma.productImage.update({
      where: { imageId },
      data: { isPrimary: true },
    });
  }

  async findImageById(imageId: number): Promise<ProductImage | null> {
    return prisma.productImage.findUnique({ where: { imageId } });
  }
}
