const express = require('express');
const router = express.Router();

const {registerUser,loginUser,allUsers, forgetPassword,getUserDetails,resetPassword,updatePassword,getUserProfile,updateProfile,logout, updateUser, deleteUserDetails,createUserAddress,alladdress,getAddressById,updateAddressById,deleteAddressById}=require('../controllers/authController')
const {isAuthenticatedUser,authorizeRoles}= require('../middlewares/auth')

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgetPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/logout').get(logout);

router.route('/me').get(isAuthenticatedUser,getUserProfile);
router.route('/password/update').put(isAuthenticatedUser,updatePassword);
router.route('/me/update').put(isAuthenticatedUser,updateProfile);

router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'),allUsers)
router.route('/admin/users/:id').get(isAuthenticatedUser,authorizeRoles('admin'),getUserDetails)
                                .put(isAuthenticatedUser,authorizeRoles('admin'),updateUser)
                                .delete(isAuthenticatedUser,authorizeRoles('admin'),deleteUserDetails)

router.route('/me/address').put(isAuthenticatedUser,createUserAddress)
.get(isAuthenticatedUser,alladdress)
router.route('/me/address/:id').get(isAuthenticatedUser,getAddressById)
.put(isAuthenticatedUser,updateAddressById)
.delete(isAuthenticatedUser,deleteAddressById)



module.exports = router; 