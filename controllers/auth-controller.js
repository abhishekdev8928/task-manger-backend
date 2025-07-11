const User = require("../models/user-model");
const crypto = require('crypto'); // for generating tokens
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const speakeasy = require("speakeasy");

const home = async (req,res)=>{
    try {
        res
        .status(200)
        .send("Welcome to mernstack using new router controller ");

    } catch (error) {
        console.log(error);
    }
};

const register = async (req,res)=>{
    try {
       
        const { username, email, phone, password } = req.body;
  
        const userExist = await User.findOne({ email });
        
        if(userExist){
            return res.status(400).json({msg:"Email already exist"});

        }

        // const saltRound = 10;
        // const hash_password = await bcrypt.hash(password, saltRound);
        const userCreated =  await User.create( { username, email, phone, password } );
        res.status(201).json({
            msg:userCreated,
            token: await userCreated.generateToken(),
             userId:userCreated._id.toString(),
        });

    } catch (error) {
     res.status(500).json(error);
    }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "Email does not exist" });
    }

    const isMatch = await userExist.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ extraDetails: "Invalid password" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    await User.updateOne(
      { email },
      {
        $set: {
          otp: otp,
          loginotpcount: 1,
        },
      }
    );

    const token = await userExist.generateToken(); // ✅ await the token properly

    res.status(200).json({
      success: true,
      msg: "Login successful",
      token, // ✅ REQUIRED by frontend
      email,
      user: {
        id: userExist._id,
        username: userExist.username,
        email: userExist.email,
      
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//otp logic
const authverify = async (req, res) => {
    try {
        const { email, otp } = req.body;
    
        // Check if user exists
        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(400).json({ message: "User does not exist." });
        }

        // Validate OTP length
        if (!otp) {
            return res.status(400).json({ message: "OTP must be 6 digits." });
        }

        // Check for secret in authkey
        const authkey = userExist.authkey;

        if (!authkey) {
            return res.status(400).json({ message: "Auth key or secret is missing." });
        }
        const { secret } = authkey;

        // Verify OTP using speakeasy
        const validated = speakeasy.totp.verify({
            secret: userExist.authkey,
            encoding: 'base32',
            token: otp, // Replace with the OTP entered by the user
            window: 1, // Allow for time drift
        });
        const token = await userExist.generateToken();
        if (!validated) {
            res.status(200).json({
                msg: 'Invalid OTP',
              
            });
        }else{
            res.status(200).json({
                msg: validated,
                token:token,
            });
        }
        

        // Generate and return token if OTP is valid
       
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


//resend otp 

const resendverify = async (req,res)=>{
    try {
        const {email} = req.body;
        const userExist = await User.findOne({email});
        console.log(userExist);
        if(!userExist){
            return res.status(400).json({message:"User not exist"});
        }

        if(userExist.loginotpcount != 4){
            const rand = Math.floor(100000 + Math.random() * 900000);
            const result = await User.updateOne({email},{
                $set:{
                    otp:rand,
                    loginotpcount: userExist.loginotpcount + 1,
                }
            },{
                new:true,
            });

            res.status(200).json({
                msg:"Otp Sent Successfully",
                userId:userExist._id.toString(),
            });
        }else{
            res.status(401).json({message:"Limit exceeded Try after Some time"});
        }
  
    } catch (error) {
     res.status(500).json(error);
    }
};
//forgot email verify
const logout = async (req, res) => {
  try {
    // Optional: clear cookies if you're using any (like JWT in cookies)
    // res.clearCookie("token");

    // Just send a success message — most logout logic is on the frontend
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
        const userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(401).json({ message: "User does not exist" });
        }

        // Create nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
             secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: "digihost2021@gmail.com",
                pass: "lvrncususaqdsopy",
            },
        });

        // Generate a token and expiration time
        const token = crypto.randomBytes(32).toString("hex");
        const tokenExpire = Date.now() + 3600000; // Token expires in 1 hour

        // Save token and expiration to user in the database
        userExist.resetToken = token;
        userExist.tokenExpire = tokenExpire;
        await userExist.save();

        // Construct reset link
        const resetLink = `http://localhost:3000/auth/resetpassword/${token}`;

        // Send email
        await transporter.sendMail({
            from: '"DigiHost 👻" <digihost2021@gmail.com>', // sender address
            to: email, // recipient's email
            subject: "Password Reset Request",
            text: `You requested a password reset. Please click the link to reset your password: ${resetLink}`,
        });

        res.status(200).json({
            message: "Email sent successfully. Please check your email to reset your password.",
        });
    } catch (error) {
        console.error("Error in forgot password function:", error);
        res.status(500).json({ message: "An error occurred while processing the request." });
    }
};

// reset password

const resetpassword = async (req,res)=>{
    try {
        const {email, password, cpassword} = req.body;
        const userExist = await User.findOne({email});
        console.log(userExist);
        if(!userExist){
            return res.status(400).json({message:"User not exist"});
        }else{
            if(password == cpassword){
                const saltRound = 10;
                const hash_password = await bcrypt.hash(cpassword, saltRound);
                const result = await User.updateOne({email},{
                    $set:{
                        password: hash_password,
                    }
                },{
                    new:true,
                });

                res.status(200).json({
                    msg:"Password Changed Successfully",
                    userId:userExist._id.toString(),
                });
            }else{
                return res.status(401).json({message:"Password and Confirm password is not matching"});
            }
       
        }
  
    } catch (error) {
     res.status(500).json(error);
    }
};
// user logic
const user = async(req, res) =>{
   try {
     const userData = req.user;
    //  console,log(userData)
    res.status(200).json({userData});
   } catch (error) {
    console.log(`error from the user route ${error}`);
   }
}

const verifyResetToken = async (req, res) => {
    const { token } = req.body;
   
    const user = await User.findOne({
        resetToken: token,
        tokenExpire: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) {
        return res.status(400).json({ valid: false });
    }

    return  res.status(200).json({
        valid:true,
        email:user.email,
    });
   
};


module.exports = { home, register, login, user , authverify, resendverify, forgot, resetpassword, verifyResetToken,logout};