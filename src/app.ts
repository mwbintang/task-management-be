import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import type { Application } from "express";
import routes from "./index.routes.js";
import { env } from "./constants/env"
import { connectMongo } from "./config/mongo.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { Request, Response } from "express";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Connect to database
connectMongo();

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.use("/api", routes);
app.use(errorHandler);
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});


const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
