import express from "express";
import "dotenv/config";
import connect from "./db/connect.js";
import userRouter from "./routes/users.route.js";
const app = express();

const PORT = process.env.PORT || 8000;

app.use(
  express.json({
    limit: "50MB",
  })
);

app.use("/api/v1/rablo", userRouter);

const callback = async (err) => {
  if (err) throw err;
  console.log(`App is listening to the PORT ${PORT}`);
  // connect to the database
  await connect();
};

app.listen(PORT, callback);
