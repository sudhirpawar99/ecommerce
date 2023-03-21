const ErrorHandler = require("../utils/errorHandler");
const catchSyncErr = require("../middleware/catchSyncErr");
const User = require('../models/userModal');
const sendToken = require("../utils/sendToekn");
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto')
exports.registerUser = catchSyncErr(async(req,res,next)=>{
const {name,email,password} = req.body;
const user = await User.create({
    name,
    email,
    password,
    awtar:{
        public_id :"testId",
        url:"test_Url"
    }
});
const token = user.getJWTToken()
// res.status(201).json({
//     success : true,
//     user,
//     token
// }) 
sendToken(user,201,res)
})

//Login user
exports.loginUser = catchSyncErr(async(req,res,next)=>{
    console.log(req.body)
    const {email,password} = req.body;
    //checking email and password empty or not
    
    if(!email || !password){
       return next(new ErrorHandler("Please Email and password",400))
    }
    
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password"));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }
    const token = user.getJWTToken();
    
    // res.status(200).json({
    //     success:true,
    //     token
    // })
    sendToken(user,200,res)
})

//logout user
exports.logOut = catchSyncErr(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"Logged Out",
    })
})

//forgot Password
exports.forgotPassword = catchSyncErr(async(req,res,next)=>{
    const user =await User.findOne({email:req.body.email})
    if(!user){
        return next(new ErrorHandler("user not found",401))
    }
    //get reset Password tokem
   const resetToken = user.getResetPasswrodToekn();
   await user.save({validateBeforeSave:false})
    console.log(resetToken)
   const resetLink = `${req.protocol}://${req.get("host")}/api/v1/reset_password/${resetToken}`;

   const message = `Your reset Password token is:-\n\n${resetLink}\n\nIf you have not required this email then please igonre it`;
   try{
    await sendEmail({
        email:user.email,
        subject :"Mern Ecommerce password recovery",
        message
    })
    res.status(200).json({
        success:true,
        messgae :`email send to ${user.email} successfully`
    })
   }catch(err){
       user.resetPasswordToke = undefined;
       user.resetPasswordExpire =undefined;
       user.save();
       return next(new ErrorHandler(err.message,500))
   }
})

//Reset Password Functionality
exports.resetPassword = catchSyncErr(async(req,res,next)=>{
    const resetPasswordToekn  =crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({resetPasswordToekn,resetPasswordExpire:{$gt:Date.now()}})
    if(!user){
        return next(new ErrorHandler("Reset password token is invalid or expired",400))
    }
    if(req.body.password !=req.body.confirmPassword)
    {
        return next(new ErrorHandler("password should be same",400))
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire  =undefined;
    user.save();
    sendToken(user,200,res)
})

//Get user details
exports.getUserDetails = catchSyncErr(async (req,res,next)=>{
    console.log(req.user)
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user
    })
  
})

//Update Password when login
exports.updatePassword = catchSyncErr(async (req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect",400))
    }
    if(req.body.newPassword!=req.body.confirmPassword){
        return next(new ErrorHandler("password should be same",400))
    }
    user.password = req.body.newPassword;
   await user.save();
    
    // res.status(200).json({
    //     success:true,
    //     message:"password updated successfully",
    //     user
    // })
    sendToken(user,200,res);
  
})

//update user profile

exports.updateDetails = catchSyncErr(async(req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        userFindAndModify:false
    })
    res.status(200).json({
        success :true,
        user
    })
})

//get all user(admin)
exports.getAllUser = catchSyncErr(async(req,res,next)=>{
    const users = await User.find();
    res.status(200).json({
        success:true,
        users
    })
})

//get single user (admin)
exports.getSingleUser = catchSyncErr(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler("user not found"))
    }
    res.status(200).json({
        success:true,
        user
    })
})

//Update User Detail from admin
exports.updateRoles = catchSyncErr(async(req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role : req.body.role
    }
    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        userFindAndModify:false
    })
    res.status(200).json({
        success :true,
        user
    })
})

//Delete user from admin
exports.deleteUser = catchSyncErr(async(req,res,next)=>{
    const user = await User.findById(req.user.id)
    if(!user){
        return next(new ErrorHandler("User not found"))
    }
    await user.remove();
    res.status(200).json({
        success :true
    })
})