const app = require('./app');
const dotenv =  require('dotenv');
const dbConnection = require('./config/database');
//dot env confirgution
dotenv.config({path:'Backend/config/config.env'})

//bello code for database connection
dbConnection();


//handled varible not defined error(uncaught exception)
process.on('uncaughtException',(err)=>{
    console.log(`error:${err.message}`);
    console.log("shutting down the server due to uncaught exception");
    process.exit(1)
})
const server = app.listen(process.env.PORT,()=>{
    console.log(`servere working on ${process.env.PORT}`)
})

//unhandled Promise rejection
process.on('unhandledRejection',(err)=>{
    console.log(`error:${err.message}`);
    console.log("shutting down the server");
    server.close(()=>{
        console.log('closing the server');
    })
})