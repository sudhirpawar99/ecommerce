const express  = require('express')
const { newOrder, getSingleOrder, getMyOrder, updateOrder, deleteOrder, getAllOrders } = require('../Controller/orederController')
const { isAuthenticatedUser, authRole } = require('../middleware/auth')
const router = express.Router()
router.route('/order/new').post(isAuthenticatedUser,newOrder);
router.route('/order/:id').get(isAuthenticatedUser,authRole('admin'),getSingleOrder);
router.route('/orders/me').get(isAuthenticatedUser,getMyOrder);
router.route('/admin/order').get(isAuthenticatedUser,authRole('admin'),getAllOrders);
router.route('/admin/order/:id')
.put(isAuthenticatedUser,authRole('admin'),updateOrder)
.delete(isAuthenticatedUser,authRole('admin'),deleteOrder);


module.exports = router