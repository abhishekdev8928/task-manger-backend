const mongoose = require("mongoose");
const URI = "mongodb+srv://abhisheksharma:2hUsnH6khUfPSHDj@task-manager.ppwbavp.mongodb.net/task-manager";
// const URI = "mongodb+srv://digihost2021:E1IBiNmZzhWtKDyB@cluster0.c1qye.mongodb.net/test";
// mongoose.connect(URI);

const connectDB = async () => {
    try {

       await mongoose.connect(URI);
       console.log('connection successful to DB');
        
    } catch (error) {

        console.error(error,"databse connection failed");
        process.exit(0);
        
    }
};

module.exports = connectDB; 
