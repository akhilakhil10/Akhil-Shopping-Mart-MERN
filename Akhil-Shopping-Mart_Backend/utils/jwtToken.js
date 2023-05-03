//create and send token and save in the cookie
const sendToken = (user,statusCode,res)=>{
    
     console.log('user:', user);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
  console.log('JWT_EXPIRES_TIME:', process.env.JWT_EXPIRES_TIME);

    //create Jwt token
    const token = user.getJwtToken();
    



    //options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
       

    };
    console.log(token);
   
    res.status(statusCode).cookie('token',token,options).json({
        
        success:true,
        token,
        user
    });
      
    

}

module.exports = sendToken;

