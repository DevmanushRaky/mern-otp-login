import { Router } from "express";
const router = Router();

// Import all controllers
import * as controller from "../controllers/controller.js"

//   POST METHODS
router.route('/register').post(controller.register);  // register user
// router.route('/registerMail').post();  // send the mail 
router.route('/authenticate').post((res, res)=> res.setEncoding.end());  // authenticate user
router.route('/login').post(controller.login);  // login in otp

// GET METHODS
router.route('/user/:username').get(controller.getUser);   // user with username 
router.route('/generateOTP').get(controller.generateOTP);   // generate random otp
router.route('/verifyOTP').get(controller.verifyOTP);  // verify generated otp
router.route('/createResetSession').get(controller.createResetSession); // reset all the variables

// PUT METHODS
router.route('/updateuser').put(controller.updateUser);   // update user 
router.route('/resetPassword').put(controller.resetPassword);  // use to reset password



export default router;