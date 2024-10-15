import mongoose from "mongoose";

const connectDB = async() => {
    try {
    const data = await mongoose.connect(process.env.MONGO_URL);
    // console.log("host :" + data.connection.host);
    // console.log("Database : " +  data.connection.name);  
    // console.log("db :"+data.connection.db);
    // console.log("collection:"+data.connection.collection);
    console.log("Successfully connected");                      
    } catch (error) {
        console.log(error);        
    }
}

export default connectDB