import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/conn.js"
import router from "./router/route.js";

const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable("x-powered-by");


const port = process.env.PORT || 5000;

// http get request only for checking 
app.get('/', (req, res) => {
    res.status(201).json("home get request");
})

// api routes
app.use('/api',router)

// Start server only when we have valid connection  
connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`);
        })
    } catch (error) {
        console.log("Connot connect to the server")
    }
}).catch(error =>{
    console.log("Invalid database  connection ....!!");
})


