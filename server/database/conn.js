import mongoose from "mongoose";
// import ENV from "../config.js";  // localhost

async function connect() {

  // Use default environment variable or "default_mongo_uri" if not available
  // const ATLAS_URI =  ENV.ATLAS_URI;    // for local host 
const ATLAS_URI = process.env.ATLAS_URI 

  try {
    mongoose.set('strictQuery', true);
    const db = await mongoose.connect(ATLAS_URI);
    console.log("Database Connected");
    return db;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error; // Throw the error to indicate that the connection failed
  }
}

export default connect;
