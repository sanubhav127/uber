import { Router } from "express";
const router = Router();
import { getProfile, login, logout, signup } from "../controllers/user.controller.js";
import { checkAuthUser } from "../middlewares/auth.middleware.js";

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", checkAuthUser ,logout);

router.get("/profile", checkAuthUser , getProfile);

router.get("/home", checkAuthUser, getProfile);

export default router;