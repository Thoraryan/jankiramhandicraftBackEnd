import express from "express";
import {
  createContent,
  updateContent,
  getContentByKey,
  getAllContents,
  deleteContent,
  getContentById,
  StatusUpdate,
} from "../Controllers/Content.controller.js";

const router = express.Router();

router.post("/content", createContent);
router.put("/content/:id", updateContent);
router.get("/content/:key", getContentByKey);
router.get("/contents", getAllContents);
router.get("/content-id/:id", getContentById);
router.delete("/content/:id", deleteContent);
router.patch("/content-status/:id", StatusUpdate);

export default router;
