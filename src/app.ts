import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import type { Application } from "express";
import routes from "./index.routes.js";
import { env } from "./constants/env"
import { connectMongo } from "./config/mongo.js";

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

const PORT = env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
