import jwt from "jsonwebtoken";
import ENV from "../config.js"

//  auth middleware
export default async function Auth(req, res, next) {
    try {
        // access authorize header for validate user
        const token = req.headers.authorization.split("")[1];  // remove bearer word 

        //  retrive the user details for the logged in user
        const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);
        req.user = decodedToken
        // res.json(decodedToken);

        next()

    } catch (error) {
        res.status(401).send({ ERROR: "AUTHENTICATION FAIL" });
    }
}


// for generate otp and verify otp
export function localVariables(req, res, next){
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next()
}