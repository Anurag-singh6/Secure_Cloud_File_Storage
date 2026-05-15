import mongoose from "mongoose";

const connectdb = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo connected as ", conn.connection.host);
        console.log("MongoDb connected ", conn.connection.name);
    } catch(error){
        console.log(error);
        process.exit(1);
    }
};

export default connectdb;