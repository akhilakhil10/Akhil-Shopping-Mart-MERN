const express  = require('express');
const app = express();
const cookieparser = require('cookie-parser');
const bodyparser = require('body-parser')
const cloudinary = require('cloudinary')
const fileUpload = require('express-fileupload')
const dotenv = require('dotenv');
const path = require('path')
const cors = require('cors');
const erroeMiddleware = require('./middlewares/error')

// if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'config/config.env' })

// dotenv.config({ path: 'config/config.env' })
dotenv.config({ path: '/etc/secrets/config.env' })
  
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(cookieparser());
app.use(fileUpload());



//Import all routes

const products = require('./routes/product');
const auth = require('./routes/auth');
const order = require('./routes/order');
const payment = require('./routes/payment');



app.use('/api/v1', products);
app.use('/api/v1', auth);
app.use('/api/v1',order);
app.use('/api/v1', payment);

// if (process.env.NODE_ENV === 'PRODUCTION') {
//     app.use(express.static(path.join(__dirname, '../build')))

//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, '../build/index.html'))
//     })
// }

//middleware to handle errors
app.use(erroeMiddleware);


module.exports = app 
