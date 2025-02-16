const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async() => {
    try{
        console.log(`Attempting to connect to DB`);
        await mongoose.connect(process.env.MONGO_URI, {
        }).then( () => {
            console.log(`MongoDB connected`)
        }).catch( (err) => {
            console.log(`Error while connecting to MongoDB : ${JSON.stringify(err)}`)
        });
    }catch(error){
        console.log(`Unable to connect to DB : ${error.message}`);
        
    }
}

module.exports = connectDB;