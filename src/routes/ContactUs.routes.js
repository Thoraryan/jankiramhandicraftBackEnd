import express from "express";

import {
  addContactUs,
  getContactUsMessages,
  deleteContactUsMessage,
} from "../Controllers/ContactUs.controller.js";

const router = express.Router();

router.post("/contact-us", addContactUs);
router.get("/contact-us", getContactUsMessages);
router.delete("/contact-us/:id", deleteContactUsMessage);

export default router;
