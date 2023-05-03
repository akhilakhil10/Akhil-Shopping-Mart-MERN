const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter your Name'],

        maxlength: [30, 'Your name cannot exceed 30 Characters']
    },
    email: {
        type: String,
        required: [true, 'Please Enter your Email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid Email']
    },
    password: {
        type: String,
        required: [true, 'Please Enter your Password'],
        minlength: [8, 'Your Password must be longer than 8 characters'],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    UserAddresses:[
    {
        address: {
            type: String,
        },
        city: {
            type: String,
        },
        phoneNo: {
            type: String,
        },
        postalCode: {
            type: String,
        },
        country: {
            type: String,
        }
    }],
        createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date


})

//Encrypting password  before saving
userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10)

})


//comapare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

//Return JWT tocken
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}



//Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
    //Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    // hash and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    //set token expire time
    this.resetPasswordExpire = Date.now() + 60 * 60 * 1000

    return resetToken


}

module.exports = mongoose.model('User', userSchema);