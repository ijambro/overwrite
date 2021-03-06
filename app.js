const express = require("express");
const overwritesRouter = require("./routes/overwrites.js");
const sourcesRouter = require("./routes/sources.js");
const libraryRouter = require("./routes/library.js");

const Source = require("./models/Source.js");
const sourcesData = require("./data/sources.json");

console.log("Preparing to launch Express.js server");

const app = express();
let port = process.env.PORT;
if (port == null || port == "") {
    port = 5000;
}

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));

// "Middleware" to log every request
app.use(function(req, res, next) {
    console.log(new Date() + " Request: " + req.url);
    if (!isObjectEmpty(req.query)) {
        console.log(" - Query: " + JSON.stringify(req.query));
    }
    if (!isObjectEmpty(req.params)) {
        console.log(" - Params: " + JSON.stringify(req.params));
    }
    if (!isObjectEmpty(req.body)) {
        console.log(" - Body: " + JSON.stringify(req.body));
    }
    next();
});

//WEB ROUTES

app.get("/", (req, res) => {
    res.render("pages/home", {
        "sourcesData": sourcesData
    });
});

app.get("/about", (req, res) => {
    res.render("pages/about");
});

// Routers for "mini-apps"
app.use("/sources", sourcesRouter);
app.use("/overwrites", overwritesRouter);
app.use("/library", libraryRouter);

app.listen(port, () => console.log("Express.js server is listening on port " + port));

// UTILS

function isObjectEmpty(obj) {
    // https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
    // We also have to check the constructor because Object.keys(new Date()).length === 0
    return (obj == null || (Object.keys(obj).length === 0 && obj.constructor === Object));
}