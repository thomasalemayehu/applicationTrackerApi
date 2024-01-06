const express = require("express");

const app = express();

const dotEnv = require("dotenv");
dotEnv.config();

const coloredConsole = require("cli-color");

const morgan = require("morgan");
const helmet = require("helmet");

const PORT = process.env.PORT || 3000;
const ENV = process.env.ENV || "DEVELOPMENT";
const cors = require("cors");

const connectToDB = require("./config/db.config");

const rateLimiter = require("./config/rate.config");

require("express-async-errors");
//
const errorMiddleware = require("./middleware/error.middleware");
const pageNotFoundMiddleware = require("./middleware/pageNotFound.middleware");
const authenticationMiddleware = require("./middleware/authentication.middleware");
//
const authRoutes = require("./routes/auth.routes");
const jobApplicationRoutes = require("./routes/jobApplication.routes");
// const path = require("path");

//
app.use(rateLimiter);
app.use(cors());
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "public", "index.htm"));
});
app.use("/auth", authRoutes);
app.use("/applications/", authenticationMiddleware, jobApplicationRoutes);

app.use(errorMiddleware);

app.use("*", pageNotFoundMiddleware);

app.listen(PORT, () => {
  connectToDB().then(() => {
    console.log(
      coloredConsole.bgGreen.black.italic(` Sever is live at ${PORT} ...`)
    );
  });
});
