import UserModel from '../model/User.model.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js'
import otpGenerator from 'otp-generator';

/** middleware for verify user */

export async function verifyUser(req, res, next) {
    try {
        // Determine the source of the username based on the HTTP method
        const { username } = req.method === "GET" ? req.query : req.body;

        // Check if the username is provided
        if (!username) {
            return res.status(400).send({ error: "Username is required." });
        }

        // Check the user existence in the database
        const existingUser = await UserModel.findOne({ username });

        // If the user doesn't exist, return a 404 error
        if (!existingUser) {
            return res.status(404).send({ error: "User not found." });
        }

        // Attach the user information to the request for further use if needed
        req.user = existingUser;

        // Continue to the next middleware or route
        next();
    } catch (error) {
        // Log the error for debugging purposes


        // Return a generic 500 error response
        return res.status(500).send({ error: "Internal Server Error" });
    }
}


/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/

export async function register(req, res) {


    try {
        const { username, password, profile, email } = req.body;


        // Check for existing username
        const existingUsername = await UserModel.findOne({ username }).exec();

        // Check for existing email
        const existingEmail = await UserModel.findOne({ email }).exec();

        if (existingUsername) {
            return res.status(409).send({ error: "Please use a unique username" });
        }

        if (existingEmail) {
            return res.status(409).send({ error: "Please use a unique email" });
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new UserModel({
                username,
                password: hashedPassword,
                profile: profile || '',
                email
            });



            // Save user to the database
            const result = await user.save();


            return res.status(201).send({ msg: "User registered successfully" });
        }

    } catch (error) {

        return res.status(500).send({ error: "Internal Server Error" });
    }
}











/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req, res) {

    const { username, password } = req.body;

    try {

        UserModel.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {

                        if (!passwordCheck) return res.status(400).send({ error: "Don't have Password" });

                        // create jwt token
                        const token = jwt.sign({
                            userId: user._id,
                            username: user.username
                        }, ENV.JWT_SECRET, { expiresIn: "24h" });

                        return res.status(200).send({
                            msg: "Login Successful...!",
                            username: user.username,
                            token
                        });

                    })
                    .catch(error => {
                        return res.status(400).send({ error: "Password does not Match" })
                    })
            })
            .catch(error => {
                return res.status(404).send({ error: "Username not Found" });
            })

    } catch (error) {
        return res.status(500).send({ error });
    }
}


/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {
    const { username } = req.params;


    try {
        if (!username) return res.status(501).send({ error: "Invalid Username" });

        // Use async/await to wait for the Mongoose query to complete
        const user = await UserModel.findOne({ username }).exec();

        if (!user) return res.status(501).send({ error: "Couldn't Find the User" });

        // Remove password from user
        const { password, ...rest } = user.toJSON();

        return res.status(201).send(rest);
    } catch (error) {

        return res.status(404).send({ error: "Cannot Find User Data" });
    }
}



/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req, res) {
    try {
        // const id = req.query.id;
        const { userId } = req.user;

        if (userId) {
            const body = req.body;

            // update the data
            await UserModel.updateOne({ _id: userId }, body);

            return res.status(201).send({ msg: "Record Updated...!" });
        } else {
            return res.status(401).send({ error: "User Not Found...!" });
        }
    } catch (error) {
        return res.status(500).send({ error: "Error updating user" });
    }
}


/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    res.status(201).send({ code: req.app.locals.OTP })
}


/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
    const { code } = req.query;

    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ msg: 'Verify Successsfully!' })
    }
    return res.status(400).send({ error: "Invalid OTP" });
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        return res.status(201).send({ flag: req.app.locals.resetSession })
    }
    return res.status(440).send({ error: "Session expired!" })
}


// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
    try {
        if (!req.app.locals.resetSession) {
          
            return res.status(404).send({ error: "Session expired!" });
        }

        const { username, password } = req.body;

        try {
            const user = await UserModel.findOne({ username });

            if (!user) {
              
                return res.status(404).send({ error: "Username not Found" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await UserModel.updateOne({ username: user.username }, { password: hashedPassword });

            req.app.locals.resetSession = false; // reset session
        
            return res.status(201).send({ msg: "Record Updated...!" });

        } catch (error) {
           
            return res.status(500).send({ error: "Error updating password" });
        }

    } catch (error) {
       
        return res.status(401).send({ error });
    }
}
