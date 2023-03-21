const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Name"],
        trim :true
    },
    description:{
        type:String,
        required:[true,"Please Enter product Description"]
    },
    price:{
        type:Number,
        required:[true,"Please Enter Product Price"],
        maxLength:[8,"price cannot exceed 8 charcter"]
    },
    ratings:{
        type:Number,
        default:0
    },
    Images:[{
        publicId:{
            type:String,
            require:true
        },
        url:{
            type:String,
            require:true
        }
    }],
    category:{
        type:String,
        required:[true,"Please Enter Product Category"]

    },
    stock:{
        type:Number,
        required:[true,"Please Enter Prodcu Stock"],
        maxLength :[4,"stock cannot exceed 4 charatcer"],
        default :1
    },
    numOfReview:{
        type:Number,
        default :0
    },
    review:[{
        user :{
            type: mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        name:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true
        },
        comment:{
            type:String,
            required:true
        }
    }],
    user :{
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default :Date.now
    }
})
module.exports = mongoose.model('product',productSchema);