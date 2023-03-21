//this is controller function which is used to get all products
//Import Product Model

const Product = require("../models/productModel");
var {ObjectId} = require('mongodb');

//This is custom error handler we defined for error hadnling . previously we handle error manually but now we commented code
//code of error handling and put ErrorHanlder code in next()
const ErrorHandler = require("../utils/errorHandler");

//This catchsyncErr is custom try-catch block created using promises and using catchSyncErr we wrapped our function
const catchSyncErr = require("../middleware/catchSyncErr");
const ApiFeatures = require("../utils/apifeatures");
//Create Product using request
exports.createProduct = catchSyncErr(async(req,res,next)=>{
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success :true,
        product
    })
});

//Get All Product from database
exports.getAllProduct = catchSyncErr(async (req,res,next)=>{
    // return next(new ErrorHandler("just temp error",500))
    const resultPage =8 ;
   const count = await Product.count()
   const apifeature = new ApiFeatures(Product.find(),req.query)
   .search()
   .filter()
   .pagination(resultPage);
    const allProduct = await apifeature.query;
    res.status(201).json({
        success :true,
        allProduct,
        count,
        resultPage
    })
});
//Get A single Product from database
exports.getProduct =  catchSyncErr(async (req,res,next)=>{
    console.log(req.params.id)
    let product = await Product.findById(req.params.id);
    
    if(!product){
        return next(new ErrorHandler("product not found",404))
        // res.status(500).json({
        //     success:false,
        //     message:"product not found"
        // })
    }
    res.status(200).json({
        success:true,
        product
    })
});
//Update Product 
exports.updateProduct = catchSyncErr(async(req,res,next)=>{
let product =await Product.findById(ObjectId(req.params.id))
    if(!product){
        return next(new ErrorHandler("product not found",404))
        // return res.status(500).json(
        //     {
        //         success :false,
        //         message: "product not found"
        //     }
        // )
    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body),{
        new :true,
        runValidators:true,
        useFindAndModify:false
    }
    res.status(200).json({
        success :true,
        product
    })
});

//Delete Prouct
exports.deletProduct = catchSyncErr(async(req,res,next)=>{
    let product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler("product not found",404))
        // res.status(500).json({
        //     success:false,
        //     message:"product not found"
        // })
    } 
     await product.remove();
     res.status(200).json({
         success:true,
         message:"Product delete successfully"

     })
});
//add review to product
exports.createProductReview = catchSyncErr(async(req,res,next)=>{
    const {rating,comment,productId} = req.body;
    
    const review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }
    const product = await Product.findById(productId)
    console.log(product)
    const isReviewd = product.review.find(rev=>rev.user.toString() ===req.user._id.toString())
    console.log(product)
    if(isReviewd){
        product.review.forEach(rev=>{
            if(rev.user.toString()===req.user._id.toString()){
                (rev.rating =rating),(rev.comment=comment)
            }
        })
    }else{
        product.review.push(review)
        product.numOfReview = product.review.length
    }
    let avg = 0;
     product.review.forEach(rev=>{
        avg+=rev.rating
    })
    product.ratings = avg/product.review.length;
    await product.save({
        validateBeforeSave:false
    })
    res.status(200).json({
        success:true
    })
})

//Get all review of product
exports.getAllReview = catchSyncErr(async(req,res,next)=>{
    const product = await Product.findById(req.query.id)
    if(!product){
        return next(new ErrorHandler("product not found",404))
    }
    res.status(200).json({
        success:true,
        review: product.review
    })
})

//delete review 
exports.deleteReview = catchSyncErr(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId)
    if(!product){
        return next(new ErrorHandler("product not found",404))
    }
    const review = product.review.filter((rev)=>rev._id.toString()!==req.query.id.toString())
    let avg = 0;
    review.forEach((rev)=>{
        avg+= rev.rating;
    })
    const numOfReview = review.length;
    const ratings = avg/review.length
    await Product.findByIdAndUpdate(req.query.productId,{
        review,
        ratings,
        numOfReview
    },{
        new:true,
        runValidators:true,
        userFindAndModify:false
    })
    res.status(200).json({
        success:true
    })
})