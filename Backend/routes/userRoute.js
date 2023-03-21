const express = require('express')
const { isAuthenticatedUser, authRole } = require('../middleware/auth');
const {registerUser, loginUser, logOut, forgotPassword, resetPassword, getUserDetails, updatePassword, updateDetails, getAllUser, getSingleUser, updateRoles, deleteUser} =require('../Controller/userController')
const router = express.Router()
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logOut);
router.route("/forgot_password").post(forgotPassword);
router.route("/reset_password/:token").put(resetPassword);
router.route("/me").get(isAuthenticatedUser,getUserDetails);
router.route("/password/update").put(isAuthenticatedUser,updatePassword);
router.route("/updateDetails").put(isAuthenticatedUser,updateDetails);
router.route("/admin/allUser").get(isAuthenticatedUser,authRole('admin'),getAllUser);
router.route("/admin/user/:id")
.get(isAuthenticatedUser,authRole('admin'),getSingleUser)
.put(isAuthenticatedUser,authRole('admin'),updateRoles)
.delete(isAuthenticatedUser,authRole('admin'),deleteUser);
module.exports = router;
