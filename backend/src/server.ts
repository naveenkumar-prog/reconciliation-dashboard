import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route";
import uploadRoutes from "./routes/upload.route";
import reconciliationRoutes from "./routes/reconciliation.route";
import dashboardRoutes from "./routes/dashboard.route";
import llmRoutes from "./routes/llm.route";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reconciliation", reconciliationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/llm", llmRoutes);

app.get("/", (_, res) => {
  res.send("API Running");
});

app.listen(5000, () => {
  console.log("Server running");
});


