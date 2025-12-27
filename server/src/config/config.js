import dotenv from "dotenv"

dotenv.config();

const config = {
 port:process.env.PORT || 5000,
 name:process.env.NAME || "",
 mongodb:process.env.MONGODB_URL,

 version :process.env.VERSION,
  jwtSecret: process.env.JWT_SECRET ,

};

export default config ;