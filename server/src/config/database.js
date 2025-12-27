import mongoose from "mongoose";
import config from "./config.js";

function connectDB(){
  mongoose.connect(config.mongodb).then(()=>{
    console.log("DB connected.");

  })
  

}

export default connectDB ;