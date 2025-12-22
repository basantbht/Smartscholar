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
      required: true,
    },

    password:{
    type: String,
    required :[true,"password is required"],
    minLength:[6,"password most be 6 character"],
  },


  roles:{
    type: [String],
    default:[STUDENT],
    enum:[STUDENT, COLLEGE],
    
    

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

  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    required: [false , "User is required."],
    
    ref: "User",

  },

  address:{
    country:{
      type: String,
      default:"Nepal",
    },

    city:{
      type: String,
      required: [true,"user city is needed"],

    },
    
  },
  


});


const model= mongoose.model("User",userSchema);

export default model;