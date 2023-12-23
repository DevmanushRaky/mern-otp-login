import nodemailer from "nodemailer"
import Mailgen from "mailgen"
import ENV from "../config.js";


// creating smtp server for sending email 
const nodeConfig = {
    service: "Gmail",
    auth: {
        user: ENV.EMAIL,
        pass: ENV.PASSWORD
    }
};


let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    thme: "default",
    product:{
        name:"Mailgen",
        link:"https://mailge.js"
    }
})

export const registerMail= async(req, res) =>{
    const { username, userEmail, text , subject }= req.body()
    //  body of mail
    var email ={
        body:{
            name:username,
            intro: text || " welcome to Mern Otp project you are excited to have you on board.",
            outro: " Need help, or have questions, Justreply to this email, we\'d love to help."
        }
    }

    var emailBody = MailGenerator.generate(email);
    
    let message={
        from: ENV.EMAIL,
        to:userEmail,
        subject: subject || "Signup successfull",
        html:emailBody
    }

    // send the mail 
    transporter.sendMail(message)
    .then(()=>{
        return res.status(200).send({msg:"You should receive an email from us"})
    })
    .catch(error=>{
        res.status(500).send({error})
    })
}