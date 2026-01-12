import { User } from "../models/user.model.js";
import { generateJWTToken } from "../utils/jwtToken.js";
import bcrypt from "bcryptjs";
import { sendMail } from "../Mail/mail.send.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, role, phone } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm password should be same.",
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    // avoid allowing ADMIN from client request
    const allowedRoles = ["STUDENT", "COLLEGE"];
    const finalRole = allowedRoles.includes(role) ? role : "STUDENT";

    const isEmailAlreadyUsed = await User.findOne({ email });
    if (isEmailAlreadyUsed) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await sendMail({ email });

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: finalRole,
      phone: phone || undefined,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.log("Error in register:", error);
    return res.status(500).json({
      success: false,
      message: "Account creation failed.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials.",
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials.",
      });
    }

    const token = generateJWTToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token, // optional
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};
