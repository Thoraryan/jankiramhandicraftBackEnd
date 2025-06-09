import { Router } from "express";
import { addVisitor, getAllVisitors,deleteVisitor } from "../Controllers/Visitor.controller.js";

const router = Router();

router.post("/visitor", addVisitor);
router.get("/visitor", getAllVisitors);
router.delete("/visitor/:id", deleteVisitor); 

export default router;
