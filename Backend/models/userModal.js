const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
    name :{
        type: String,
        required: [true,"Please Enter name"],
        maxlength :[20,"name cannot exceed 20 charatcer"],
        minlength :[2,"name must have 2 charatcer"],
    },
    email:{
        type:String,
        required:[true,"please enter the email"],
        unique:true,
        validate:[validator.isEmail,"please enter valid email"]
    },
    password:{
        type:String,
        required:[true,"please enter password"],
        minlength:[8,"password should have minlength 8 character"],
        select:false
    },
    awtar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user",
    },

    resetPasswordToken:String,
    resetPasswordExpire:Date
})
userSchema.pre('save',async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password =await bcrypt.hash(this.password,10)
});
//Create a method getJWTToken in user schema which is used to get JWTTOKEN this is custom method we can give any name at getJWTToken.
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
};

//Compaire password when user enter password at time of login .
userSchema.methods.comparePassword = async function(enterdPassword){
    return await bcrypt.compare(enterdPassword,this.password)
};
//Genrate Forgot Password token
userSchema.methods.getResetPasswrodToekn = function(){
const resetToken =crypto.randomBytes(20).toString("hex");
this.resetPasswordToken =crypto.createHash("sha256").update(resetToken).digest("hex");
this.resetPasswordExpire = Date.now()+15*60*1100;
return resetToken;
}
module.exports = mongoose.model("User",userSchema);