require("dotenv").config();
const express = require("express");

const cors = require("cors");

const app = express();

const mongoose = require("mongoose");

const httpStatusText = require("./utils/httpStatusText");
const url = process.env.MONGO_URL;

const coursesRouter = require("./routes/coursesRoute");
const usersRouter = require("./routes/usersRoute");

mongoose.connect(url).then(() => {
  console.log("Connected to the database");
});

app.use(cors());
app.use(express.json());

app.use("/api/courses", coursesRouter); // /api/courses
app.use("/api/users", usersRouter); // /api/users

// global middleware for not found router
app.all("*", (req, res, next) => {
  return res.status(404).json({
    status: httpStatusText.ERROR,
    message: "This resource is not available",
  });
});

// global error handler
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

//const PORT = process.env.PORT || 3000;

//mongoose.connect('mongodb+srv://ahmedmohamed:01021981901@cluster0.qbbq5oo.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// db.once('open', () => {
//     console.log('Connected to the database');
// });

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port 3000`);
});
