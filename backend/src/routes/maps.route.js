import { Router } from "express";
import { geocodeAddress, routes } from "../controllers/maps.controller.js";
const router = Router();

router.get("/geocode", geocodeAddress);
router.get("/route", routes);

export default router;