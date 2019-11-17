var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/indexRoute");
var pdfRouter = require("./routes/pdfRoute");
var userRouter = require("./routes/usersRoute");
var circularRouter = require("./routes/circularRoute");
var storeRouter = require("./routes/storeRoute");
var retailerRouter = require("./routes/retailerRoute");
var shoppingListRouter = require("./routes/shoppingListRoute");
var categoriesRouter = require("./routes/categoriesRoute");
var gameRouter = require("./routes/gameRoute");
//var MongoClient = require('mongodb').MongoClient({useNewUrlParser: true});

var mongoose = require("mongoose");
// var conn = mongoose.connect("mongodb://localhost:27017/pigglyWiggly", {
//   useNewUrlParser: true,
//   useCreateIndex: true
// });
var conn = mongoose.connect(
  "mongodb+srv://liviu:cst123@cluster0-eqit2.mongodb.net/test",
  { useNewUrlParser: true, useCreateIndex: true }
);

var fileUpload = require("express-fileupload");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
// app.use(bodyParser.json({limit: "50mb"}));
// app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
// default options
app.use(fileUpload());
var corsOptions = {
  origin: "*",
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Content-Length",
    "X-Requested-With",
    "Accept"
  ],
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.use("/", indexRouter);
app.use("/pdf", pdfRouter);
app.use("/user", userRouter);
app.use("/circular", circularRouter);
app.use("/store", storeRouter);
app.use("/retailer", retailerRouter);
app.use("/shoppingList", shoppingListRouter);
app.use("/category", categoriesRouter);
app.use("/game", gameRouter);

app.use("*", (req, res, next) => {
  if (req.method == "OPTIONS") {
    res.status(200);
    res.send();
  } else {
    next();
  }
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  next(createError(404));
});
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
app.use(cookieParser());
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
