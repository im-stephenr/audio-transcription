const express = require("express");
const app = express();
const http = require("http");
const HttpError = require("./model/http-error");
const bodyParser = require("body-parser");
const path = require("path");
const AWS = require("aws-sdk");

const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// allow the front end to access uploads/images folder
app.use("/uploads/audios", express.static(path.join("uploads", "audios")));

// Allows us to communicate between different domain
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // * means allow any domain to access
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

// routes
const uploadRoutes = require("./router/upload-router");

// routes to controller
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res, next) => {
  res.send("HELLO WORLD!");
});

// Redirect error if url does not exist
app.use((req, res, next) => {
  const error = new HttpError("Could not find route", 404);
  throw error;
});

// if parameter is 4, express will recognize this as a special middleware, as a error middleware
// this is used to stop uploading a file if there's validation error
app.use((error, req, res, next) => {
  // if there is a file
  if (req.file) {
    // remove the file if signup is not successfully
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headersSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

// connect
app.listen(process.env.SERVER_PORT, () => {
  console.log("Connected to server port: ", process.env.SERVER_PORT);
});
