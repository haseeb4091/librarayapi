const firebase = require('firebase/app')
const firestore = require("firebase/firestore");

const express = require("express");
const fileUpload = require("express-fileupload");

const serverless = require("serverless-http");

const cors = require('cors');
require("dotenv").config

const PORT  = process.env.PORT || 3000

const corsOptions = {
  origin: '*',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

const app = express();
// default options
app.use(fileUpload());
app.use(cors(corsOptions))

const router = express.Router();

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.API_KEY || "AIzaSyDnlKa-W2721XkH72jF2VeJUTqbuk6WIns",
  authDomain: process.env.AUTH_DOMAIN ||"library-jasial.firebaseapp.com",
  projectId: "library-jasial",
  storageBucket: process.env.STORAGE_BUCKET ||"library-jasial.appspot.com",
  messagingSenderId:process.env.MSG_ID || "497549393935",
  appId: process.env.APP_ID ||"1:497549393935:web:d8412e95fa6c14a8b2e37a",
  measurementId: process.env.MEASURE_ID ||"G-FZHP6C20WN"
};

// Initialize Firebase
const app2 = firebase.initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = firestore.getFirestore(app2);



router.get("/", (req, res) => {
  res.json({"hello":"hello"});
});
// app.get("/get", (req, res) => {
//   res.send("test");
// });
// app.get("/multiple", (req, res) => {
//   res.sendFile(__dirname + "/multiple.html");
// });
// app.get("/multiplefields", (req, res) => {
//   res.sendFile(__dirname + "/multiplefields.html");
// });
router.post("/multiplefields", (req, res) => {
  console.log(req.files.my_profile_pic.name);
  console.log(req.files.my_pet.name);
  console.log(req.files.my_cover_photo.name);
});
// app.post("/uploadmultiple", function (req, res) {
//   // Uploaded files:
//   console.log(typeof req.files.files);
//   let sampleFile;
//   let uploadPath;
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).send("No files were uploaded.");
//   }
//   req.files.files.forEach((file) => {
//     sampleFile = file.file;
//     uploadPath = __dirname + "/uploads/" + file.name;
//     file.mv(uploadPath, (err) => {
//       if (err) return res.status(500).send(err);
//     });
//   });
//   res.send("All files uploaded");
// });
router.post("/upload", function (req, res) {
  let sampleFile;
  let uploadPath;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  } // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.file;
  uploadPath = __dirname + "/uploads/" + sampleFile.name; // Use the mv() method to place the file somewhere on your server

  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    firestore.addDoc(firestore.collection(db, "books"), {
      name: req.body.name,
      path:uploadPath,
      type: req.body.type,
      author: req.body.author,
      translator: req.body.translator,
      rating: req.body.rating,
      year: req.body.year,
      pages: req.body.pages,
      description:req.body.description
    }).then((data)=>{
      console.log(data.id)
      res.send(`File uploaded! ${JSON.stringify(req.body)}`);
    
    }).catch((err)=>{
      console.log(err)
      res.status(500).send(err)
    });



  });
});

// app.listen(PORT, () => {
//   console.log(`server started on port ${PORT}`);
// });

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);

