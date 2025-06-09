import { asyncHandeler } from "../utils/asyncHandeler.js";
import bcrypt from "bcryptjs";
import { Admin } from "../Modals/Admin.modal.js";
import { fileURLToPath } from "url";
import path from "path";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import dotenv from "dotenv";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_if_not_set";
const JWT_EXPIRES_IN = "2h"; // 1 hour expiry

// Register Login
const registerAdmin = asyncHandeler(async (req, res) => {
  const { userName, email, password } = req.body;

  // Validate request data
  if (!userName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if the admin already exists
  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return res.status(400).json({ message: "Admin already exists" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new admin
  const admin = await Admin.create({
    userName,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    message: "Admin registered successfully",
    data: {
      id: admin._id,
      userName: admin.userName,
      email: admin.email,
    },
  });
});

// Admin Login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  res.status(200).json({
    message: "Login successful",
    data: {
      id: admin._id,
      userName: admin.userName,
      email: admin.email,
      token, // send JWT token
    },
  });
};

const getAllAdmins = asyncHandeler(async (req, res) => {
  const admins = await Admin.find({}, "userName email password createdAt");

  res.status(200).json({
    message: "Admin users fetched successfully",
    data: admins,
  });
});

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".hbs",
      partialsDir: path.join(__dirname, "Views"),
      defaultLayout: false,
    },
    viewPath: path.join(__dirname, "Views"),
    extName: ".hbs",
  })
);

const sendEmail = async (email, subject, template, context) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    template,
    context,
  };

  await transporter.sendMail(mailOptions);
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// This function handles creating or updating a user with the OTP and sending email
const EmailVerifcation = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("----", email);

    if (!email) return res.status(400).json({ message: "Email is required" });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const generatedOtp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    // Save OTP and expiry in DB
    admin.otp = generatedOtp;
    admin.otpExpiry = otpExpiry;
    await admin.save();

    // Send OTP email
    await sendEmail(email, "Your OTP Code", "users-verification", {
      email: email,
      otp: generatedOtp,
    });

    res.status(201).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Verify OTP entered by Admin
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (admin.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > admin.otpExpiry) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // OTP valid
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reset Password
const ResetPassword = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and new password are required" });
  }

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  // Check if OTP was verified
  if (!admin.isVerified) {
    return res.status(403).json({ message: "OTP not verified" });
  }

  // Allow password reset
  admin.password = await bcrypt.hash(password, 10);
  admin.otp = null;
  admin.otpExpiry = null;
  admin.isVerified = false; // Reset verification after password reset

  await admin.save();

  res.status(200).json({ message: "Password reset successful" });
};

const requestProfileUpdate = async (req, res) => {
  try {
    const adminId = req.params.id;
    const { userName, email, password } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Save changes temporarily in a separate field or in-memory —
    // but simplest is to save them in admin document as "pendingUpdate"
    admin.pendingUpdate = {
      userName: userName || admin.userName,
      email: email || admin.email,
      password: password ? await bcrypt.hash(password, 10) : null,
    };

    // Generate OTP and expiry
    const generatedOtp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min

    admin.otp = generatedOtp;
    admin.otpExpires = otpExpiry;

    await admin.save();

    // Send OTP email
    await sendEmail(
      admin.email,
      "Your OTP Code for Profile Update",
      "users-verification",
      {
        email: admin.email,
        otp: generatedOtp,
      }
    );

    res
      .status(200)
      .json({
        message: "OTP sent to your email, please verify to complete update",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyProfileUpdateOtp = async (req, res) => {
  try {
    const adminId = req.params.id;
    const { otp } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (!otp || otp !== admin.otp || Date.now() > admin.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP is valid, apply pending update
    if (admin.pendingUpdate) {
      admin.userName = admin.pendingUpdate.userName;
      admin.email = admin.pendingUpdate.email;
      if (admin.pendingUpdate.password) {
        admin.password = admin.pendingUpdate.password;
      }

      // Clear pending update and OTP fields
      admin.pendingUpdate = undefined;
      admin.otp = undefined;
      admin.otpExpires = undefined;

      await admin.save();

      return res.status(200).json({ message: "Profile updated successfully" });
    } else {
      return res.status(400).json({ message: "No pending update found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  registerAdmin,
  login,
  getAllAdmins,
  EmailVerifcation,
  verifyOtp,
  ResetPassword,
  requestProfileUpdate,
  verifyProfileUpdateOtp,
};
