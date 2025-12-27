
import express from "express";
import connectDB from "./src/config/database.js";


import config from "./src/config/config.js";
import authRouter from "./src/routes/authRoute.js";
import bodyParser from "body-parser";

 const app = express();
 connectDB();

 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));

 app.use("/api/auth",authRouter);
 


 app.listen(config.port, ()=>{
  console.log(`Server running at port ${config.port}`);
});
