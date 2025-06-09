import { Router } from "express";
import {
  addProduct,
  getAllProducts,
  getSingleProduct,
  editProduct,
  deleteProduct,
  StatusUpdate,
} from "../Controllers/Product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/product-add", upload.array("images"), addProduct);
router.put("/product-edit/:id", upload.array("images"), editProduct);
router.get("/products", getAllProducts);
router.delete("/product/:id", deleteProduct);
router.get("/get-product/:id", getSingleProduct);
router.patch("/product-status/:id", StatusUpdate);

export default router;
