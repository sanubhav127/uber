import { Router } from "express";
const router = Router();
import { checkAuthCaptain } from "../middlewares/auth.middleware.js";
import { getProfile, login, logout, signup } from "../controllers/captain.controller.js";

router.post("/signup" , signup);
router.post("/login" , login);
router.post("/logout" , checkAuthCaptain ,logout);
router.get("/profile", checkAuthCaptain, getProfile);
router.get("/caphome", checkAuthCaptain, getProfile);

export default router;