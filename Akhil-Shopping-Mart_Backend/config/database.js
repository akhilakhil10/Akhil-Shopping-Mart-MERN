const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        family: 4,
    }).then(con => {
        console.log(`MongoDb database connected with HOST : ${con.connection.host}  `)
    })

}

module.exports = connectDatabase