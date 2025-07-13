import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import DB from "./Config/Db.js";
import NotesRoutes from "./Routes/Notes.Route.js";
import UserRoutes from "./Routes/User.Route.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://notes-app-two-plum.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // if you're using cookies or auth headers
  })
);

DB();

const PORT = process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Notes App API");
});

app.use("/notes", NotesRoutes);
app.use("/users", UserRoutes);

app.listen(PORT, () => {
  console.log(`Server is Running on Port: ${PORT}`);
});
