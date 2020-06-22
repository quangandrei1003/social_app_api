const mongoose = require('mongoose'); 

const config = require('config'); 

const db = config.get('mongoURI');

//connect to mongoDB

const connectDB = async () => {
    try {
       await mongoose.connect(db ,  { useUnifiedTopology: true , useNewUrlParser: true, useCreateIndex: true }); 
        console.log('Connected to MongoDB...');
        
    } catch (error) {
        console.error(error.message); 
        process.exit(1); 
        
    }
}

module.exports = connectDB; 