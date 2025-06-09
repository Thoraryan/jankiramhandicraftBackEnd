import { Router } from "express";
import {
  registerAdmin,
  login,
  getAllAdmins,
  EmailVerifcation,
  verifyOtp,
  ResetPassword,
  requestProfileUpdate,
  verifyProfileUpdateOtp,
} from "../Controllers/Admin.controller.js";

const router = Router();

router.route("/register").post(registerAdmin);
router.post("/login", login);
router.get("/all-admin", getAllAdmins);
router.post("/email-verification", EmailVerifcation);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", ResetPassword);
router.put("/update/:id", ResetPassword);
router.post("/admin/:id/request-update", requestProfileUpdate);
router.post("/admin/:id/verify-update", verifyProfileUpdateOtp);

export default router;
