const ErrorHandler = require("../utils/errorHandler");
const catchSyncErr = require("./catchSyncErr");
const jwt = require('jsonwebtoken');
const User = require("../models/userModal");
exports.isAuthenticatedUser = catchSyncErr(async(req,res,next)=>{
    const {token} = req.cookies;
    // console.log(token);
    if(!token){
        next(new ErrorHandler("Please Login to access to this resource",401));
    }

    const decodedData = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id)
    // console.log("user at auth:")
    // console.log(req.user);
    next()
})

exports.authRole = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
           return next(new ErrorHandler(`Role:${req.user.role} is not allowed to access this resousrc`,401));
        }
        next();
    }
}