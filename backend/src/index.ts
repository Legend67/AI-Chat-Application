// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";

// import chatRouter from "./routes/chat";

// dotenv.config(); // load env variables

// /* -------------------- EXPRESS APP -------------------- */

// const app = express();

// app.use(cors());
// app.use(express.json());

// /* -------------------- ROUTES -------------------- */
// app.use("/chat", chatRouter);

// /* -------------------- HEALTH CHECK -------------------- */
// app.get("/", (_req, res) => {
//   res.send("AI Support Chat Backend is running!");
// });

// /* -------------------- SERVER -------------------- */
// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`Backend running on http://localhost:${PORT}`);
// });


import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import chatRouter from "./routes/chat";

dotenv.config();

/* -------------------- EXPRESS APP -------------------- */

const app = express();

app.use(
  cors({
    origin: "*", // you can restrict later to Vercel domain
    credentials: true
  })
);

app.use(express.json());

/* -------------------- ROUTES -------------------- */
app.use("/chat", chatRouter);

/* -------------------- HEALTH CHECK -------------------- */
app.get("/", (_req, res) => {
  res.send("AI Support Chat Backend is running!");
});

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
