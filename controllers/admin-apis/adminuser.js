import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import User from "../../models/adminSchema/adminuserschema.js";

const JWT_SECRET = process.env.JWT_SECRET;
const resend = new Resend(process.env.RESEND_API_KEY);

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const token = authHeader.split(" ")[1];

    if (!JWT_SECRET) {
      return res.status(500).json({ message: "Server configuration error" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
      return res.status(401).json({
        message: "Invalid or expired token",
        error: jwtError.message,
      });
    }

    if (!decoded.userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await User.findById(decoded.userId).select(
      "-password -otp -otpExpiresAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Authentication failed",
      error: err.message,
    });
  }
};

const getAdminProfile = async (req, res) => {
  try {
    console.log("=== Get Admin Profile ===");
    console.log("req.user exists:", !!req.user);

    if (!req.user) {
      console.error("❌ req.user is not set");
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = req.user;
    console.log("✅ Sending user profile:", user._id);

    res.status(200).json({
      message: "User profile retrieved successfully",
      user: user,
    });
  } catch (error) {
    console.error("❌ Get user profile error:", error);
    res.status(500).json({
      message: "Server error while fetching user profile",
      error: error.message,
    });
  }
};

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const sendOTPEmail = async (email, otp) => {
  try {
    await resend.emails.send({
      from: "noreply@stonerva.com",
      to: email,
      subject: "One Time Password (OTP) for your account verification",
      html: `
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px; margin: 40px auto; border: 1px solid #eaeaea; border-radius: 6px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 24px 32px;">
              <h2 style="margin-bottom: 10px; color: #333333;">Hi</strong>,</h2>
              <p style="margin: 10px 0 20px; font-size: 15px; color: #444444;">
                Welcome! Please use the verification code below to complete your account setup.
              </p>
              <h1 style="text-align: center; font-size: 36px; letter-spacing: 6px; margin: 30px 0; color: #000000;">
                ${otp}
              </h1>
              <p style="font-size: 14px; color: #555555; font-weight: bold; margin-top: 30px; text-align: center">
                Please take a moment to review the details of this request:
              </p>
              <p style="margin-top: 25px; font-size: 14px; color: #444; text-align: center">
                Do not share your OTP with anyone under any circumstances.
              </p>
              <p style="margin-top: 25px; font-size: 14px; color: #444; text-align: center">
                This OTP will expire in 5 minutes.
              </p>
              <p style="margin-top: 40px; font-size: 14px; color: #333333;">
                <strong style="color: #6a1b9a;">Team Fimon</strong>
              </p>
            </td>
          </tr>
        </table>
      `,
    });
    return true;
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    return false;
  }
};

const verifyOtpForAdmin = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).json({ message: "Email and OTP are required" });

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp)
    return res.status(401).json({ message: "Invalid OTP" });

  if (user.otpExpiresAt < new Date())
    return res.status(410).json({ message: "OTP expired" });

  // Clear OTP fields
  user.otp = null;
  user.otpExpiresAt = null;
  user.email_verified = true;
  await user.save();

  // Generate token
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: "1h",
  });
  console.log(user);

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      userId: user?._id,
      name: user?.name,
      email: user?.email,
      email_verified: user?.email_verified,
    },
  });
};

const resendOtpForAdmin = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  user.otp = otp;
  user.otpExpiresAt = otpExpiresAt;
  await user.save();

  console.log(`🔁 Resent OTP for ${email}: ${otp}`);

  res.status(200).json({ message: "New OTP sent." });
};

const loginAdminUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid password" });

  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

  user.otp = otp;
  user.otpExpiresAt = otpExpiresAt;
  await user.save();

  const emailSent = await sendOTPEmail(email, otp);
  if (!emailSent) {
    return res
      .status(500)
      .json({ message: "Failed to send verification code" });
  }
  console.log(`🔐 OTP for ${email}: ${otp}`);

  res.status(200).json({
    message:
      "Password verified. OTP has been sent to your register email and phone number!",
    email: user.email,
  });
};

const registerAdminUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      currentUser: name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "Admin registered successfully. Please log in." });
  } catch (error) {
    console.error("Error during admin registration:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
};

export {
  verifyOtpForAdmin,
  resendOtpForAdmin,
  loginAdminUser,
  getAdminProfile,
  registerAdminUser,
  authMiddleware,
};
