const express = require('express');
const { getAllProduct,createProduct,updateProduct ,deletProduct, getProduct, createProductReview, deleteReview, getAllReview} = require('../Controller/productController');
const { isAuthenticatedUser, authRole } = require('../middleware/auth');

//create the object of route using express.router method
const router = express.Router();

// create route for product using getAllProduct controller.
router.route('/product').get(getAllProduct);

//Route for creating new Product
router.route('/admin/product/new').post(isAuthenticatedUser,authRole('admin'),createProduct);

//Updadte the Product using id
router.route('/admin/product/:id')
.put(isAuthenticatedUser,authRole('admin'),updateProduct)
.delete(isAuthenticatedUser,authRole('admin'),deletProduct);

//Delete the Product using id
router.route('/product/:id').get(getProduct);//router.route('/product/:id').put(updateProduct).delete(deletProduct);
//review
router.route('/review').put(isAuthenticatedUser,createProductReview)
router.route('/reviews').get(getAllReview).delete(isAuthenticatedUser,deleteReview);

module.exports = router;