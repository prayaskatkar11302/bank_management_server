import express from "express"
import dotenv from "dotenv"
import ConnectDB from "./Config/db.js"
import userRoutes from "./Routers/user.router.js"
import transactionRoutes from "./Routers/transaction.router.js"
import cors from "cors"
import path from "path";
import { fileURLToPath } from "url";


dotenv.config()

const app = express()


const port = process.env.PORT || 5000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);
ConnectDB()

app.use("/api/v1/auth",userRoutes)
app.use("/api/v1/transaction",transactionRoutes)

app.listen(port,()=>{
    console.log(`Server is running at ${port}`)
})

