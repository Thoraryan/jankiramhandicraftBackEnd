// Routes/customRequirement.route.js
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { addCustomRequirement, getCustomRequirements, deleteCustomRequirement } from '../Controllers/CustomRequirement.controller.js';

const router = Router();

// Routes
router.post('/custom-requirement', upload.single('image'), addCustomRequirement);
router.get('/custom-requirement', getCustomRequirements);
router.delete('/custom-requirement/:id', deleteCustomRequirement);

export default router;