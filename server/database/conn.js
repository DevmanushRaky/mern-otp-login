import mongoose from "mongoose";
import ENV from "../config.js";  

async function connect() {


  try {
    mongoose.set('strictQuery', true);
    const db = await mongoose.connect(ENV.ATLAS_URI);
    console.log("Database Connected");
    return db;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error; // Throw the error to indicate that the connection failed
  }
}

export default connect;
