import { Router } from "express";
import { getUserDetails } from "./me.controller.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

const router = Router();

router.get("/me", authMiddleware, getUserDetails);

export default router;
