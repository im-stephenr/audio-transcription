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
  // Create an S3 client for IDrive Cloud
  const endpoint = new AWS.Endpoint("s5d8.ldn.idrivee2-36.com");
  AWS.config.update({ region: "eu-west-2" });
  const s3 = new AWS.S3({
    endpoint: endpoint,
    accessKeyId: "ju49ylDrQjPNil2eYIEe",
    secretAccessKey: "iyUXwxZJmAogUCh1sBvqBqhgw8Xv2acr4lfG7nCz",
  });

  // list of objects in bucket 'my-bucket' params
  var params = {
    Bucket: "audio-files",
  };

  // list object call
  s3.listObjects(params, async function (err, data) {
    if (err) {
      console.log("Error:", err);
    } else {
      const audioFileName = data.Contents[0].Key;
      const model = "whisper-1";
      const formData = new FormData();
      formData.append("model", model);
      formData.append("file", audioFileName);

      try {
        const response = await axios.post(
          "https://api.openai.com/v1/audio/transcriptions",
          formData,
          {
            headers: {
              Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
              "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            },
          }
        );
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    }
  });
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
