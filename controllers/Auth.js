import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Otp from "../models/OTP.js";
import PasswordResetToken from "../models/PasswordResetToken.js";
import { sendMail } from "../utils/Email.js";
import { generateOTP } from "../utils/GenerateOtp.js";
import { sanitizeUser } from "../utils/SanitizeUser.js";
import { generateToken } from "../utils/GenerateToken.js";

export const signup = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    req.body.password = await bcrypt.hash(req.body.password, 10);
    const createdUser = new User(req.body);
    await createdUser.save();

    const secureInfo = sanitizeUser(createdUser);
    const token = generateToken(secureInfo);

    res.cookie("token", token, {
      sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.PRODUCTION === "true",
    });

    return res.status(201).json(secureInfo);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error occurred during signup, please try again later" });
  }
};

export const login = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser && (await bcrypt.compare(req.body.password, existingUser.password))) {
      const secureInfo = sanitizeUser(existingUser);
      const token = generateToken(secureInfo);

      res.cookie("token", token, {
        sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.PRODUCTION === "true",
      });

      return res.status(200).json(secureInfo);
    }

    res.clearCookie("token");
    return res.status(404).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Some error occurred while logging in, please try again later",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const otpRecord = await Otp.findOne({ user: user._id });
    if (!otpRecord) return res.status(404).json({ message: "OTP not found" });

    if (otpRecord.expiresAt < new Date()) {
      await Otp.findByIdAndDelete(otpRecord._id);
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (await bcrypt.compare(req.body.otp, otpRecord.otp)) {
      await Otp.findByIdAndDelete(otpRecord._id);
      const verifiedUser = await User.findByIdAndUpdate(
        user._id,
        { isVerified: true },
        { new: true }
      );
      return res.status(200).json(sanitizeUser(verifiedUser));
    }

    return res.status(400).json({ message: "OTP is invalid or expired" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Some error occurred" });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const user = await User.findById(req.body.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    await Otp.deleteMany({ user: user._id });

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpirationMinutes = parseInt(process.env.OTP_EXPIRATION_TIME, 10) || 15;
const expiresAt = new Date(Date.now() + otpExpirationMinutes * 60 * 1000);
    const newOtp = new Otp({
      user: user._id,
      otp: hashedOtp,
      expiresAt: expiresAt
    });
    await newOtp.save();

    await sendMail(
      user.email,
      "OTP Verification",
      `Your OTP for account verification is: <b>${otp}</b>. Do not share it with anyone.`
    );

    return res.status(201).json({ message: "OTP sent" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error occurred while resending OTP, please try again later" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "Email does not exist" });

    await PasswordResetToken.deleteMany({ user: user._id });

    const resetToken = generateToken(sanitizeUser(user), true);
    const hashedToken = await bcrypt.hash(resetToken, 10);

    const newToken = new PasswordResetToken({
      user: user._id,
      token: hashedToken,
      expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
    });
    await newToken.save();

    await sendMail(
      user.email,
      "Password Reset Link",
      `<p>Reset your password using <a href=${process.env.ORIGIN}/reset-password/${user._id}/${resetToken}>this link</a>. Link expires shortly.</p>`
    );

    return res.status(200).json({ message: `Password reset link sent to ${user.email}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error occurred while sending password reset mail" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).json({ message: "User does not exist" });

    const resetToken = await PasswordResetToken.findOne({ user: user._id });
    if (!resetToken) return res.status(404).json({ message: "Reset link is not valid" });

    if (resetToken.expiresAt < new Date()) {
      await PasswordResetToken.findByIdAndDelete(resetToken._id);
      return res.status(404).json({ message: "Reset link has expired" });
    }

    if (await bcrypt.compare(req.body.token, resetToken.token)) {
      await PasswordResetToken.findByIdAndDelete(resetToken._id);
      user.password = await bcrypt.hash(req.body.password, 10);
      await user.save();
      return res.status(200).json({ message: "Password updated successfully" });
    }

    return res.status(400).json({ message: "Reset link has expired or is invalid" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error occurred while resetting the password, please try again later" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      maxAge: 0,
      sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
      httpOnly: true,
      secure: process.env.PRODUCTION === "true",
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
  }
};

export const checkAuth = async (req, res) => {
  try {
    if (!req.user) return res.sendStatus(401);

    const user = await User.findById(req.user._id);
    return res.status(200).json(sanitizeUser(user));
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};
