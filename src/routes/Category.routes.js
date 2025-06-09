import { Router } from "express";
import {
  addCategory,
  getAllCategorys,
  deleteCategory,
  updateCategory,
  getSingleCategory,
  updateSubCategory,
  getSingleSubCategory,
  deleteSubCategory,
  AddSubCategory,
  StatusUpdateCategory,
  StatusUpdateSubCategory
} from "../Controllers/Category.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/category-add", upload.single("image"), addCategory);
router.get("/categorys", getAllCategorys);
router.put("/category-edit/:id", upload.single("image"), updateCategory);
router.put("/sub-category-add/:id", upload.single("image"), AddSubCategory);
router.put(
  "/category/:categoryId/subcategory/:subCategoryId",
  upload.single("image"),
  updateSubCategory
);
router.post(
  "/sub-category/:categoryId",
  upload.single("image"),
  AddSubCategory
);
router.get("/category/:id", getSingleCategory);
router.delete("/category-delete/:id", deleteCategory);
router.delete(
  "/sub-category-delete/:categoryId/:subCategoryId",
  deleteSubCategory
);
router.get(
  "/category/:categoryId/subcategory/:subCategoryId",
  getSingleSubCategory
);
router.patch("/category-status/:id", StatusUpdateCategory);
router.patch("/subcategory-status/:id", StatusUpdateSubCategory);

export default router;
