import { Router } from "express";
import { addProductRequestQuery, getProductRequests, deleteProductRequest } from '../Controllers/ProductRequestQuery.controller.js'

const router = Router();

router.post('/product-request', addProductRequestQuery);
router.get("/product-request", getProductRequests);
router.delete("/product-request/:id", deleteProductRequest);

export default router;
