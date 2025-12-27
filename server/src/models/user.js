import mongoose from "mongoose";
import { STUDENT , COLLEGE } from "../constants/roles.js"

const userSchema = new mongoose.Schema({
  name:{
    type:String ,
    required: [true, "User name is needed"],
  },

  email:{
    type: String,
    required: [true, " User email  is needed"],
    lowercase: true,
    validate:{
      validator: (value)=>{
        const emailRegex=/^\S+@\S+\.\S+$/;

        return emailRegex.test(value);

      },
      message: "Invalid email address.",
    }


  },

  phone: {
      type: String,
      required: false,
    },

    password:{
    type: String,
    required :[true,"password is required"],
    minLength:[6,"password must be 6 character"],
  },


  roles:{
    type: [String],
    default:[STUDENT],
    enum:[STUDENT, COLLEGE],
    
  },

  resetPasswordToken: {
    type: String,
  },


  resetPasswordExpire: {
    type: Date,
  },


  
  course: {
      type: String,
    },

  createdAt:{
    type: Date,
    default: Date.now(),
    immutable: true,
  },


  imageUrls:{
    type :[String],
  },

  

  address:{
    country:{
      type: String,
      default:"Nepal",
    },

    city:{
      type: String,

    },
    
  },
  


});


const model= mongoose.model("User",userSchema);

export default model;