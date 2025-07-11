const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true  
    },
    phone:{
        type:String,
        required:true  
    },
    password:{
        type:String,
        required:true  
    },
    isAdmin:{
        type:Boolean,
        default:false, 
    },
    otp:{
        type:String,
    },
    pic:{
        type:String,
    },
    pic_url:{
        type:String,
    },
    loginotpcount:{
        type:Number,
    },
    role:{
        type:String,
    },
    createdby:{
        type:String,
    },
    status:{
        type:String,  
    },
    resetToken:{
        type:String,  
    },
    tokenExpire:{
        type:String,  
    },
    authkey:{
        type:String,  
    },
});

//imp 
userSchema.pre('save', async function(next){
   const user = this;
    if(!user.isModified('password')){
            next();
    }
    try {
        const saltRound = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(user.password, saltRound);
        user.password = hash_password;
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (password){
  return bcrypt.compare(password, this.password);
}
userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userId: this.id.toString(), // ✅ fixed key
        email: this.email,
      
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
  } catch (error) {
    console.error("Token generation error:", error);
  }
};


const User = new mongoose.model("admin", userSchema);
module.exports = User;