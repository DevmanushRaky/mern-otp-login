import userModel from "../model/user.model.js";
import UserModel from "../model/user.model.js"
import bcrypt from "bcrypt"
import { jwt } from "jsonwebtoken"
import ENV from "../config.js"
import otpGenerator from "otp-generator"

//  middleware for verify user 
export async function verifyUser(req, res, next) {
    try {
        const { username } = req.method == "GET" ? req.query : req.body;

        //  check th euser existance
        let exist = await UserModel.findOne({ username });
        if (!exist) return res.status(401).send("Invalid Credentials or User not found");
        next()

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error" });
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
                            msg: "Login Succcessfull",
                            username: user.username,
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
    const { username } = req.params;
    try {
        if (!username) return res.status(501).send({ error: " Invalid Username" })

        UserModel.findOne({ username }, function (err, user) {
            if (err) return res.staus(500).send({ err })
            if (!user) return res.staus(501).send({ err: "Couldn't find the User" });

            // remove password form database
            // mongoose return unnecessary data with object so convert it into json
            const { password, ...rest } = Object.assign({}, user.toJSON());
            return res.status(201).send(user);

        })
    } catch (error) {
        return res.status(404).send({ error: "Can not find user data" })
    }
}


// update user info
export async function updateUser(req, res) {
    try {
        // const id = req.query.id;
        const { userId } = req.user;
        if (userId) {
            const body = req.body;

            // update the data
            UserModel.updateOne({ _id: id }, body, function (err, data) {
                if (err) throw err;
                return res.status(201).send({ msg: "Record Updated " });
            })
        } else {
            return res.status(401).send({ error: "user not found" });
        }

    } catch (error) {
        return res.status(401).send({ error });
    }
}

// generate otp
export async function generateOTP(req, res) {
    req.app.locals.OTP = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    res.status(201).send({ code: req.app.locals.OTP })

}

// verify otp 
export async function verifyOTP(req, res) {
    const { code } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null;  // reset the otop value
        req.app.locals.resetSession = true;  // start the session for reset password 

        return res.status(201).send({ msg: " Verify OTP successfully" })
    }
    return res.status(401).send({ error: " Invalid OTP" });
}

// successfully redirect user when OTP is valid
export async function createResetSession(req, res) {
    res.json("create reset session  route controller")
}

// reset password when user have valid session 
export async function resetPassword(req, res) {
    res.json(" reset password  route controller")
}





