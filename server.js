const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const user = require("./Components/routes/user");
const app = express();
const PORT = 3000;
const cors = require('cors');

require('dotenv').config();


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(cors());

mongoose.connect(process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then((response) => {
    console.log("Database Connected Successfully");
}).catch((err) => {
    console.log("error", err)
})

app.use("/", user);

app.listen(PORT, (req, res) => {
    console.log("Welcome VIJAY Login Page");
})

// Handling Error
process.on("unhandledRejection", err => {
    console.log(`An error occurred: ${err.message}`)
  })
