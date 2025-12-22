import User from '../models/User.js';
import bcrypt from "bcryptjs";

const login = async (data)  =>{
  
  const user = await User.findOne({email: data.email});

  if(!user) throw {statusCode: 404 , message: "User not found."};

  const isPasswordMatch = bcrypt.compareSync(data.password , user.password);

  if(!isPasswordMatch) throw {message:"Incorrect Email or password."};
  
    
  
  return {_id:user._id,
    name:user.name,
    address:user.address,
    email:user.email};
    
};

const register = async(data) => {
//  const hash = data.password;

const user = await User.findOne({email: data.email});

  if(user) throw {statusCode: 404 , message: "User already exist."};

  const hashedPassword = bcrypt.hashSync(data.password);
  

  const registeredUser = await User.create({
    name:data.name,
    address:data.address,
    email:data.email,
    password:hashedPassword,
  });

  return {
    _id:registeredUser._id,
    name:registeredUser.name,
    address:registeredUser.address,
    email:registeredUser.email,

  }
};

export default {register , login};
