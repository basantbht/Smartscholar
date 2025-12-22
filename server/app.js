
import express from "express";
import config from "./src/config/config.js";
import authRouter from "./src/routes/authRoute.js";

 const app = express();

 app.use("/api/auth",authRouter);

 app.listen(config.port, ()=>{
  console.log(`Server running at port ${config.port}`);
});
