const express = require("express");
const colors = require("colors");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const fileupload = require("express-fileupload");
const morgan = require("morgan");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

dotenv.config({ path: "./config/config.env" });
connectDB();

app.use(cors());

const auth = require("./routes/auth");
const product = require("./routes/product");
const order = require("./routes/order");
const authSeller = require("./routes/authSeller");
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", auth);
app.use("/authSeller", authSeller);
app.use("/product", product);
app.use("/order", order);
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

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
