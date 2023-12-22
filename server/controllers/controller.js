import userModel from "../model/user.model.js";
import UserModel from "../model/user.model.js"
import bcrypt from "bcrypt"
import { jwt } from "jsonwebtoken"
import ENV from "../config.js"

//  middleware for verify user 

export async function verifyUser(req, res, next){
    try {
        const { username} = req.method == "GET" ? req.query : req.body;

        //  check th euser existance
         let exist = await UserModel.findOne({username});
         if(!exist) return res.status(401).send("Invalid Credentials or User not found");
         next()

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error"}) ;       
    }
}



// register user 
export async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body();

        // check the existing user 
        const existingUserName = new Promise((resolve, reject) => {
            UserModel.findOne({ username }, function (err, user) {
                if (err) reject(new Error(err))
                if (user) reject({ error: "Please provide unique username" });

                resolve()
            })
        });

        // check the existing email 
        const existingEmail = new Promise((resolve, reject) => {
            UserModel.findOne({ email }, function (err, email) {
                if (err) reject(new Error(err))
                if (email) reject({ error: "Please provide unique Email" });

                resolve()
            })
        });

        Promise.all([existingUserName, existingEmail])
            .then(() => {
                if (password) {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {
                            const user = new userModel({
                                username,
                                password: hashedPassword,
                                profile: profile || '',
                                email
                            });

                            // return save result as a response 
                            user.save()
                                .then(result => res.status(201).send({ msg: "user register successfully" }))
                                .catch(error => res.status(500).send({ error }))

                        }).catch(error => {
                            return res.status(500).send({
                                error: "Enable to hashed password"
                            })
                        })
                }
            }).catch(error => {
                return res.status(500).send({ error })
            })


    } catch (error) {
        return res.status(500).send(error)
    }
}


// login user 
export async function login(req, res) {
    const { username, password } = req.body();
    try {
        UserModel.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {
                        if (passwordCheck) return res.status(400).send({ error: " Don't hve Password" })

                        // Create jwt token
                        const token = jwt.sign({
                            userId: user._Id,
                            username: user.username,
                        }, ENV.JWT_SECRET, { expiresIn: "24h" });

                        return res.status(200).send({
                            msg:"Login Succcessfull",
                            username:user.username,
                            token
                        });


                    })
                    .catch(error => {
                        return res.status(400).send({ error: "Password does not match" })
                    })
            })
            .catch(error => {
                return res.status(404).send({ error: "Username not found" });
            })



    } catch (error) {
        return res.status(500).send({ error });
    }



}


// get user 
export async function getUser(req, res) {
    res.json("getuser route controller")
}


// update user info
export async function updateUser(req, res) {
    res.json("update user route controller")
}

// generate otp
export async function generateOTP(req, res) {
    res.json("generate otp route controller")
}

// verify otp 
export async function verifyOTP(req, res) {
    res.json("verifyOTP route controller")
}

// successfully redirect user when OTP is valid
export async function createResetSession(req, res) {
    res.json("create reset session  route controller")
}

// reset password when user have valid session 
export async function resetPassword(req, res) {
    res.json(" reset password  route controller")
}





