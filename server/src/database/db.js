import mongoose from "mongoose";

export const dbConnection = async() => {
    await mongoose.connect(process.env.MONGO_URI, {
        dbName: "smartscholar"
    }).then(() => {
        console.log("Database Connected")
    }).catch((err) => {
        console.log(`Error connecting to databae: ${err.message || err}`)
    })
}