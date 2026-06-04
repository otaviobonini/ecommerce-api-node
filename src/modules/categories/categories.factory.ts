// categories.factory.ts
// This factory is responsible for creating the CategoriesController with all its dependencies.

import { CategoriesRepository } from "../../repositories/CategoriesRepository.js";
import { CategoriesController } from "./CategoriesController.js";
import { CategoriesService } from "./CategoriesService.js";

export function makeCategoriesController() {
  return new CategoriesController(
    new CategoriesService(new CategoriesRepository()),
  );
}
