const HttpError = require("../model/http-error");
const { validationResult } = require("express-validator");
const path = require("path");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const save = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Error uploading file", 500));
  }
  // const filePath = path.join(
  //   process.cwd(),
  //   "/uploads/audios/" + req.file.filename
  // );
  // const model = "whisper-1";
  // const formData = new FormData();
  // formData.append("model", model);
  // formData.append("file", fs.createReadStream(filePath));
  // console.log("FORM DATA: ", formData);

  // try {
  //   const response = await axios.post(
  //     "https://api.openai.com/v1/audio/transcriptions",
  //     formData,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
  //         "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
  //       },
  //     }
  //   );
  //   console.log(response);
  // } catch (err) {
  //   console.log(err);
  // }
};

exports.save = save;
