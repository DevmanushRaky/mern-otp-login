import { Router } from "express";
const router = Router();
// Import all controllers
import * as controller from "../controllers/controller.js"
import { registerMail } from "../controllers/mailer.js";
import Auth, {localVariables} from "../middleware/auth.js";

//   POST METHODS
router.route('/register').post(controller.register);  // register user
router.route('/registerMail').post(registerMail);  // send the mail 
router.route('/authenticate').post((controller.verifyUser, (req, res)=> res.end()));  // authenticate user
router.route('/login').post(controller.verifyUser, controller.login);  // login in otp

// GET METHODS
router.route('/user/:username').get(controller.getUser);   // user with username 
router.route('/generateOTP').get(controller.verifyUser,localVariables, controller.generateOTP);   // generate random otp
router.route('/verifyOTP').get(controller.verifyUser,controller.verifyOTP);  // verify generated otp
router.route('/createResetSession').get(controller.createResetSession); // reset all the variables

// PUT METHODS
router.route('/updateuser').put(Auth, controller.updateUser);   // update user 
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword);  // use to reset password



export default router;