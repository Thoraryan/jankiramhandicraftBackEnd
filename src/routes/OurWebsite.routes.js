import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  updateOurWebsite,
  createOurWebsiteAdd,
  createOurWebsite,
  getOurWebsite,
  deleteOurWebsite,
  StatusUpdate,
} from "../Controllers/OurWebsite.controller.js";

const router = Router();

router.post("/our-website-add", upload.single("video"), createOurWebsiteAdd);
router.get("/our-website/:id", createOurWebsite);
router.get("/our-website", getOurWebsite);
router.delete("/our-website/:id", deleteOurWebsite);
router.put("/ourwebsite-edit/:id", upload.single("video"), updateOurWebsite);
router.patch("/ourwebsite-status/:id", StatusUpdate);

export default router;
