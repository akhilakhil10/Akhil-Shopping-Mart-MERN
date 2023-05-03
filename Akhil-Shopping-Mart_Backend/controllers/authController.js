const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');

const sendToken = require('../utils/jwtToken');

const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const crypto = require('crypto');
const cloudinary = require('cloudinary')
const sendEmail = require('../utils/sendEmail')

//Register a user => /api/v1/register

exports.registerUser = catchAsyncErrors(async (req, res, next) => {


    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: "scale"

    })
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    })

    sendToken(user, 200, res)

})

//login user =>/api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    console.log('user')
    //check if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400))
    }

    //Finding user in database
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }
    //check if passowrd is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }


    sendToken(user, 200, res)

})

//Forget password => /api/v1/password/forget
exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 404));

    }
    //Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });https://akhil-shopping-mart.onrender.com

    
    //Reset password URL
    
    var resetUrl = `${process.env.MY_RESET_URL}/password/reset/${resetToken}`;

    const message = `your password reset token is a follow:\n\n${resetUrl}\n\nIf you have not requested this email,then ignore it `

    try {
        await sendEmail({
            email: user.email,
            subject: 'Akhil Shoping mart Password reset token',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500))

    }

})
//reset password => /api/v1/password/reset/token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    //Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or expired', 400))
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Passwords do not match', 400))
    }

    //setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res)

})

// Get currently logged in user details   =>   /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

//update /change password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');


    //check previous password
    const isMatched = await user.comparePassword(req.body.oldPassword)



    if (!isMatched) {
        return next(new ErrorHandler('old password is incorrect', 400));

    }
    user.password = req.body.password;
    await user.save();
    sendToken(user, 200, res)

})

//update user profile => /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    // Update avatar
    if (req.body.avatar !== '') {
        const user = await User.findById(req.user.id)

        const image_id = user.avatar.public_id;
        const res = await cloudinary.v2.uploader.destroy(image_id);

        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        })

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })

})

//logout user => /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
     // Remove the token from local storage
  localStorage.removeItem('token');
    res.status(200).json({
        success: true,

        message: 'Logged out successfully'

    })

})

//Admin Routes

//Get All Users => / api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

//Get User Details => /api/v1/admin/users/:id

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id} `, 404))
    }
    res.status(200).json({
        success: true,
        user
    })
})

//update user profile => /api/v1/admin/user:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }


    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })

})
//delete User Details => /api/v1/admin/users/:id

exports.deleteUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id} `, 404))
    }

    //Remove avatar from cloudinary - TODO
    await user.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success: true,
        user
    })
})

//create new user address /api/v1/me/address
exports.createUserAddress = catchAsyncErrors(async (req, res, next) => {
    const { address, city, phoneNo, postalCode, country } = req.body;
  
    const newUserAddress = {
      address,
      city,
      phoneNo,
      postalCode,
      country
    };
    const user = await User.findById(req.user.id)
    user.UserAddresses.push(newUserAddress);

    await user.save({ validateBeforeSave: false });


    res.status(200).json({
        success:true
    });
    console.log(newUserAddress);
});

// Get user all address by   /api/v1/me/address
exports.alladdress = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        address:user.UserAddresses
    });

    console.log(user.UserAddresses);
});

// Get user address by ID by /api/v1/me/address/:id
exports.getAddressById = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    const address = user.UserAddresses.find(elem => elem._id.toString() === req.params.id);

    if (!address) {
        return res.status(404).json({
            success: false,
            message: 'Address not found'
        });
    }

    res.status(200).json({
        success: true,
        address
    });

    console.log(address);
});


// Get user all address by   /api/v1/me/address
exports.alladdress = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        address:user.UserAddresses
    });

    console.log(user.UserAddresses);
});

// Update user address by ID by /api/v1/me/address/:id
exports.updateAddressById = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    const address = user.UserAddresses.id(req.params.id);

    if (!address) {
        return res.status(404).json({
            success: false,
            message: 'Address not found'
        });
    }

    address.address = req.body.address || address.address;
    address.city = req.body.city || address.city;
    address.postalCode = req.body.postalCode || address.postalCode;
    address.country = req.body.country || address.country;
    address.phoneNo = req.body.phoneNo || address.phoneNo;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Address updated successfully',
        address
    });

    console.log(address);
});


// Delete user address by ID by /api/v1/me/address/:id
exports.deleteAddressById = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    const address = user.UserAddresses.id(req.params.id);

    if (!address) {
        return res.status(404).json({
            success: false,
            message: 'Address not found'
        });
    }

    address.deleteOne();

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Address deleted successfully'
    });

    console.log(`Address with ID ${req.params.id} has been deleted.`);
});
