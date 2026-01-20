import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db";
import app from "./app";
import { ErrorHandler } from "./middlewares/ErrorHandlerMiddleware";

//Port Num
const PORT = process.env.PORT || 5000;


// Connect to the database before starting the server
connectDB();


app.use(ErrorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port localhost://${PORT}`);
});