const AWS = require("aws-sdk");

// Create an S3 client for IDrive Cloud
const endpoint = new AWS.Endpoint("s3.us-west-1.idrivecloud.io");
const s3 = new AWS.S3({
  endpoint: endpoint,
});

// list of objects in bucket 'my-bucket' params
var params = {
  Bucket: "my-bucket",
};

// list object call
s3.listObjects(params, function (err, data) {
  if (err) {
    console.log("Error:", err);
  } else {
    console.log("Success:", data);
  }
});
