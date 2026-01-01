import jwt from "jsonwebtoken"

export const generateJWTToken = async (userId,res) => {
    const token = jwt.sign({ userId },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: "7d",
        }
    );

    res.cookie("token", token, {
        httOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

   return {token}
}