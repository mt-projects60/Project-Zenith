import express, { type Express } from "express";
import cors from "cors";
import router from "./routes/index.js";
import { seedDatabase } from "./lib/seed.js";

const app: Express = express();

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

seedDatabase();

export default app;
