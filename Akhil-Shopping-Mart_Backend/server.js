const app = require('./app');
const connectDatabase = require('./config/database');

const cloudinary = require('cloudinary');
const dotenv = require('dotenv');


const PORT = process.env.PORT || 10000;


//Handle uncaught exception
process.on('uncaughtException',err=>{
  console.log(`ERROR:${err.stack}`);
  console.log('Shutting down due to uncaugth exception');
  process.exit(1);
});

// dotenv.config({ path: 'config/config.env' });
dotenv.config({ path: '/etc/secrets/config.env' })

connectDatabase();

//Setting up cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});



// Listen for requests on the specified port
const server = app.listen(PORT, () => {
  console.log(`Server started on PORT : ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
})

//handle Unhandled promise rejections
process.on('unhandledRejection', err => {
  console.log(`Error:${err.stack}`);
  console.log('Shutting down the server due to Unhandled Promise rejection');
  server.close(() => {
    process.exit(1);
  });
});
