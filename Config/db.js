import mongoose from "mongoose";

const ConnectDB = async ()=>{
    try {
        await mongoose.connect(process.env.mongoDB_URL)
        console.log("Database Connection completed")
    } catch (error) {
        console.log("Database Connection Failed")
    }
}

export default ConnectDB