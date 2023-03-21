const mongoose = require('mongoose')
const dbConnection = ()=>{
    mongoose.connect(process.env.DBURL,{useNewUrlParser:true,useUnifiedTopology:true
    }).then((data)=>{
        console.log(`Database connected on:${data.connection.port}`);
    })
    //Catch block commented because we handled unhandled promised in server.js
    // .catch((err)=>{
    //     console.log(err)
    // })
}
module.exports = dbConnection;