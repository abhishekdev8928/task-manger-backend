const crypto = require('crypto');
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const speakeasy = require("speakeasy");
const { Employee } = require("../models/employee-model"); // ✅ Destructured properly

const home = async (req, res) => {
  try {
    res.status(200).send("Welcome to mernstack using new router controller ");
  } catch (error) {
    console.log(error);
  }
};

const register = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    const userExist = await Employee.findOne({ email });
    if (userExist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const userCreated = await Employee.create({
      name: username,
      email,
      phone,
      password,
      role: 'user', // default role if needed
    });

    res.status(201).json({
      msg: userCreated,
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    });

  } catch (error) {
    res.status(500).json(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await Employee.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "Email does not exist" });
    }

    const isMatch = await userExist.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ extraDetails: "Invalid password" });
    }

    const token = await userExist.generateToken();

    res.status(200).json({
      success: true,
      msg: "Login successful",
      token,
      email,
      user: {
        id: userExist._id,
        role: userExist.role,
        email: userExist.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const authverify = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const userExist = await Employee.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "User does not exist." });
    }

    if (!otp) {
      return res.status(400).json({ message: "OTP must be 6 digits." });
    }

    const validated = speakeasy.totp.verify({
      secret: userExist.authkey, // using authkey as base32
      encoding: 'base32',
      token: otp,
      window: 1,
    });

    const token = await userExist.generateToken();
    if (!validated) {
      res.status(200).json({ msg: 'Invalid OTP' });
    } else {
      res.status(200).json({ msg: validated, token });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const resendverify = async (req, res) => {
  try {
    const { email } = req.body;
    const userExist = await Employee.findOne({ email });

    if (!userExist) {
      return res.status(400).json({ message: "User not exist" });
    }

    if (userExist.loginotpcount != 4) {
      const rand = Math.floor(100000 + Math.random() * 900000);
      await Employee.updateOne({ email }, {
        $set: {
          otp: rand,
          loginotpcount: (userExist.loginotpcount || 0) + 1,
        }
      });

      res.status(200).json({
        msg: "OTP Sent Successfully",
        userId: userExist._id.toString(),
      });
    } else {
      res.status(401).json({ message: "Limit exceeded. Try after some time" });
    }

  } catch (error) {
    res.status(500).json(error);
  }
};

const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "User logged out successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message
    });
  }
};

const forgot = async (req, res) => {
  try {
    const { email } = req.body;
    const userExist = await Employee.findOne({ email });

    if (!userExist) {
      return res.status(401).json({ message: "User does not exist" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "digihost2021@gmail.com",
        pass: "lvrncususaqdsopy",
      },
    });

    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpire = new Date(Date.now() + 3600000);

    userExist.resetToken = token;
    userExist.tokenExpire = tokenExpire;
    await userExist.save();

    const resetLink = `http://localhost:3000/auth/resetpassword/${token}`;

    await transporter.sendMail({
      from: '"DigiHost 👻" <digihost2021@gmail.com>',
      to: email,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${resetLink}`,
    });

    res.status(200).json({
      message: "Email sent successfully. Please check your inbox.",
    });
  } catch (error) {
    console.error("Error in forgot password function:", error);
    res.status(500).json({ message: "An error occurred while processing the request." });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { email, password, cpassword } = req.body;
    const userExist = await Employee.findOne({ email });

    if (!userExist) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if (password !== cpassword) {
      return res.status(401).json({ message: "Password and Confirm password do not match" });
    }

    const saltRound = 10;
    const hash_password = await bcrypt.hash(cpassword, saltRound);

    await Employee.updateOne({ email }, {
      $set: { password: hash_password }
    });

    res.status(200).json({
      msg: "Password Changed Successfully",
      userId: userExist._id.toString(),
    });

  } catch (error) {
    res.status(500).json(error);
  }
};

const user = async (req, res) => {
  try {
    const userData = req.user;
    res.status(200).json({ userData });
  } catch (error) {
    console.log(`error from the user route ${error}`);
  }
};

const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await Employee.findOne({
      resetToken: token,
      tokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ valid: false });
    }

    res.status(200).json({
      valid: true,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Token validation error", error });
  }
};

module.exports = {
  home,
  register,
  login,
  user,
  authverify,
  resendverify,
  forgot,
  resetpassword,
  verifyResetToken,
  logout
};
