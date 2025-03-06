import express from "express";
import { getComponentData } from "../controllers/componentController.js";

const router = express.Router();

router.get("/component_2", (req, res) => getComponentData(req, res, "component_2"));
router.get("/component_4", (req, res) => getComponentData(req, res, "component_4"));
router.get("/component_6", (req, res) => getComponentData(req, res, "component_6"));

export default router;
