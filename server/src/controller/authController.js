
import authService from "../service/authService.js";
import {createJWT } from "../utils/jwt.js";


const login = async (req , res)=>{
  try{
    const result = req.body;

    if(!result){
      return res.status(500).send("Insert the data first.");
    }

    if (!result.email) {
      return res.status(400).send("Email is required.");
    }

    if (!result.password) {
      return res.status(400).send("Password is required.");
    }

    const data = await authService.login(result);

    // generate jwt token

   const authToken = createJWT(data);

   res.cookie("authToken", authToken, {maxAge : 86400 * 1000});

  //  const output =await verifyJWT(token);

  //  console.log(output);

    res.json(data);


  }catch (error){
    res.status(error.statusCode || 500).send(error.message);

  };


}

const register = async (req, res) => {
  const result = req.body;

  try {
    if (!result.password) {
      return res.status(400).send("Password is required.");
    }

    if(!result.confirmPassword){
      return res.status(400).send("confirmed password is required.")
    }

    if(result.confirmPassword !== result.password){
      return res.status(400).send("password does not matched.")
    }


    const data = await authService.register(result);

    const authToken = createJWT(data);

   res.cookie("authToken", authToken, {maxAge : 86400 * 1000});


    res.status(201).json(data);
  } catch (error) {
    res.status(error.statusCode || 500).send(error.message);
  }
};

export default { register , login};
