import User from '../models/User.js';
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";



const loginService = async (data)  =>{
  
  const user = await User.findOne({email: data.email});

  if(!user) throw {statusCode: 404 , message: "User not found."};

  const isPasswordMatch = bcrypt.compareSync(data.password , user.password);

  if(!isPasswordMatch) throw {message:"Incorrect Email or password."};
  
    
  
  return {_id:user._id,
    name:user.name,
    address:user.address,
    email:user.email};
    
};

const registerService = async(data) => {
//  const hash = data.password;

const user = await User.findOne({email: data.email});

  if(user) throw {statusCode: 404 , message: "User already exist."};

  const hashedPassword = bcrypt.hashSync(data.password);
  

  const registeredUser = await User.create({
    name:data.name,
    address:data.address,
    email:data.email,
    password:hashedPassword,
  });

  return {
    _id:registeredUser._id,
    name:registeredUser.name,
    address:registeredUser.address,
    email:registeredUser.email,

  }
};

const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash token before saving
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

  await user.save();
  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

  // Send email
  await sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    html: `
      <h3>Password Reset</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 15 minutes.</p>
    `,
  });

  return true;
};


const resetPasswordService = async (token, password) => {
  // Hash token
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // Find user
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired token");
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  // Clear reset fields
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return true;
};
   

export default {loginService ,registerService ,forgotPasswordService , resetPasswordService };
