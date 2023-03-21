const Order = require("../models/orderModel");
const ErrorHandler = require("../utils/errorHandler");
const catchSyncErr = require("../middleware/catchSyncErr");
const Product = require("../models/productModel");
//create new order
exports.newOrder = catchSyncErr(async(req,res,next)=>{
    const {shippingInfo,
        orderItem,
        paymentInfo,
        itmePrice,
        taxPrice,
        shippingPrice,
        totalPrice} = req.body
    const order = await Order.create({
        shippingInfo,
        orderItem,
        paymentInfo,
        itmePrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt :Date.now(),
        user:req.user._id
    })
    res.status(201).json({
        success:true,
        order
    })
})

//get Single order
exports.getSingleOrder = catchSyncErr(async(req,res,next)=>{

    const order = await Order.findById(req.params.id).populate("user","name email");
    console.log(order)
    if(!order){
        return next(new ErrorHandler("oder not found",404))
    }
    res.status(200).json({
        success:"true",
        order        
    })
})
//get login user order
exports.getMyOrder = catchSyncErr(async(req,res,next)=>{
    const orders = await Order.find({user:req.user._id});
    if(!orders){
        return next(new ErrorHandler("oder not found",404))
    }
    res.status(200).json({
        success:"true",
        orders       
    })
})

//Get All order from admin
exports.getAllOrders = catchSyncErr(async(req,res,next)=>{
    const orders = await Order.find();
    let totalAmount = 0;
    console.log(orders)
    orders.forEach(order=>{
        totalAmount += order.totalPrice;
    })
    console.log(totalAmount)
    res.status(200).json({
        success:"true",
        totalAmount,
        orders       
    })
})

//update order status
exports.updateOrder = catchSyncErr(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(order.orderStatus ==="Delivered"){
        return next(new ErrorHandler("you have alredy deliverd this order",400))
    }
    // console.log(order)
    order.orderItem.forEach(async order=>{
        await updateStock(order.product,order.quantity)
    })
    order.orderStatus = req.body.status;
    if(req.body.status ==="Deliverd"){
        order.deliverdAt = Date.now();
    }
    order.save({validateBeforeSave:false})
    res.status(200).json({
        success:"true",
        order      
    })
})
//update stock using order quantity
async function updateStock(id,quantity){
    const product = await Product.findById(id);
    console.log(id)
    product.stock -=quantity;
   await product.save({validateBeforeSave:false})
}

//Delete order from admin
exports.deleteOrder = catchSyncErr(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("oder not found",404))
    }
    await order.remove();
    res.status(200).json({
        success:true
    })
})
