    import { sendMail } from "../Mail/mail.send.js";
import { User } from "../models/user.model.js";
    import { generateJWTToken } from "../utils/jwtToken.js"
    import bcrypt from "bcryptjs"
    import { v2 as cloudinary } from "cloudinary"

    export const register = async (req, res, next) => {
        try {
            const { fullName, email, password, confirmPassword } = req.body;
            console.log(req.body)

            if (!fullName || !email || !password || !confirmPassword) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required"
                })
            }
            console.log("1st checkpoint")
            
            if (password !== confirmPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Password and Confirm password should be same."
                })
            }
            
            console.log("2st checkpoint")
            const emailRegex = /^\S+@\S+\.\S+$/
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email format."
                })
            }
            
            console.log("3st checkpoint")
            if (password.length < 8) {
                return res.status(400).json({
                    success: false,
                    message: "Password must be at least 8 characters long."
                })
            }
            console.log("4st checkpoint")
            
            const isEmailAlreadyUsed = await User.findOne({ email });
            
            console.log("5st checkpoint")
            if (isEmailAlreadyUsed) {
                return res.status(400).json({
                    success: false,
                    message: "Email is already registered."
                })
            }
            console.log("6st checkpoint")
            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            await sendMail({email});
            
            const user = new User({
                fullName,
                email,
                password: hashedPassword,
            });
            

            await user.save();
            console.log("7st checkpoint")


            // send verification email

            const token = await generateJWTToken(user._id, res);

            return res.status(201).json({
                success: true,
                message: "Account created. Login here!",
                _id: user._id,
                fullName: user.fullName,
                email: user.email
            });


        } catch (error) {
            console.log("Error in create user", error)
            return res
                .status(500)
                .json({ success: false, message: "Account creation failed." })
        }

    };

    export const login = async (req, res, next) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide email and password."
                });
            }

            const emailRegex = /^\S+@\S+\.\S+$/
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email format."
                })
            }

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Credentials."
                })
            }

            const isPasswordMatched = await bcrypt.compare(password, user.password);

            if (!isPasswordMatched) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Credentials."
                })
            }

            // generateJWTToken(user, "User logged in successfully", 200, res)
        } catch (error) {

        }
    };