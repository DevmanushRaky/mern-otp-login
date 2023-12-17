import userModel from "../model/user.model.js";
import UserModel from "../model/user.model.js"
import bcrypt from "bcrypt"

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
    res.json("login route controller")
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





