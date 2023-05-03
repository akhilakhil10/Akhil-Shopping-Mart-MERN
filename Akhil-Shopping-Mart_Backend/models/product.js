const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'PLease enter Product name'],
        trim: true,
        maxLength: [500, 'Producr name cannot exceed 500 characters']
    },
    originalprice: {
        type: Number,
        required: [true, 'PLease enter Product original price'],
        maxLength: [5, 'Producr name cannot exceed 5 characters'],
        default: 0.0
    },
    price: {
        type: Number,
        required: [true, 'PLease enter Product selling price'],
        maxLength: [5, 'Producr name cannot exceed 5 characters'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'PLease enter Product description']
    },
    rating: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, 'PLease select category for this product'],
        enum: {
            values: [
                'Mobiles',
                'Cameras',
                'Laptops',
                'Headphones',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Home',
            ],
            message: 'Please select correct category for product'


        }
    },
    seller: {
        type: String,
        required: [true, 'Please enter product seller']
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        maxLength: [10, 'Product name cannot exceed 10 characters'],
        default: 0
    },
    numofReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true

            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    sale: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Product', productSchema);