const express = require("express");
const colors = require("colors");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

dotenv.config({ path: "./config/config.env" });
connectDB();

const auth = require("./routes/auth");
const authSeller = require("./routes/authSeller");
app.use(express.json());

app.use("/auth", auth);
app.use("/authSeller", authSeller);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.red.bold
  );
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: {err.message}`.white);
  //Close the server and exit the process
  server.close(() => {
    process.exit(1);
  });
});
