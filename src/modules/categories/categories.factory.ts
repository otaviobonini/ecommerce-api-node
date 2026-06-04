// categories.factory.ts
// This factory is responsible for creating the CategoriesController with all its dependencies.

import { S3Gateway } from "../../providers/S3Gateway.js";
import { CategoriesRepository } from "../../repositories/CategoriesRepository.js";
import { CategoriesController } from "./CategoriesController.js";
import { CategoriesService } from "./CategoriesService.js";

export function makeCategoriesController() {
  return new CategoriesController(
    new CategoriesService(new CategoriesRepository(), new S3Gateway()),
  );
}
