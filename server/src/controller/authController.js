
import authService from "../service/authService.js";
import {createJWT } from "../utils/jwt.js";


const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email) {
      return res.status(400).send("Email is required.");
    }

    if (!password) {
      return res.status(400).send("Password is required.");
    }

    const data = await authService.loginService({ email, password });

    const authToken = createJWT(data);

    res.cookie("authToken", authToken, { maxAge: 86400 * 1000 });
    res.json(data);

  } catch (error) {
    res.status(error.statusCode || 500).send(error.message);
  }
};


const register = async (req, res) => {
  try {
    const {
      email,
      password,
      confirmPassword,
      address
    } = req.body || {};

    if (!email) {
      return res.status(400).send("Email is required.");
    }

    if (!password) {
      return res.status(400).send("Password is required.");
    }

    if (!confirmPassword) {
      return res.status(400).send("Confirmed password is required.");
    }

    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match.");
    }

    const data = await authService.registerService({
      email,
      password,
      address
    });

    const authToken = createJWT(data);

    res.cookie("authToken", authToken, { maxAge: 86400 * 1000 });
    res.status(201).json(data);

  } catch (error) {
    res.status(error.statusCode || 500).send(error.message);
  }
};

// const forgotPassword = async (req, res) => {
//   console.log("BODY:", req.body);
//   res.send("Check console");
// };

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await authService.forgotPasswordService(email);

    res.status(200).json({ message: "Reset link sent to email" });

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body || {};

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    await authService.resetPasswordService(token, password);

    res.status(200).json({ message: "Password reset successful" });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export default { register , login , forgotPassword , resetPassword};
