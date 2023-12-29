import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/conn.js";
import router from "./router/route.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use(morgan('tiny'));
app.disable("x-powered-by");

const port = process.env.PORT || 5000;

// http get request only for checking 
app.get('/', (req, res) => {
    res.status(201).json("home get request");
})

// API routes
app.use('/api', router);

// Start server only when we have a valid connection  
connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server connected to http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.log("Invalid database connection....!!");
  });
