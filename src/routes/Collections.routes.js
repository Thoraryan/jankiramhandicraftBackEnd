import express from "express";
import {
    createCollection,
    getAllCollections,
    deleteCollection,
    getSingleCollection,
    updateCollection,
    StatusUpdate
} from "../Controllers/Collections.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/collection", upload.single("image"), createCollection);
router.put("/collection/:id", upload.single("image"), updateCollection);
router.get("/collections", getAllCollections);
router.get("/collection/:id", getSingleCollection);
router.delete("/collection/:id", deleteCollection);
router.patch("/collection-status/:id", StatusUpdate);

export default router;
