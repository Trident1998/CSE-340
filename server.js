/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const expressLayouts = require("express-ejs-layouts")
const express = require("express")
const session = require("express-session")
const pool = require('./database/')
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const { title } = require("process")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const errorRouts = require("./routes/errorRoute")
const errorControler = require("./controllers/errorController");
const accountRoute = require("./routes/accountRoute");


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

/* ***********************
 * Routes
 *************************/
app.use(static)
// Inventory routes
app.use("/inv", inventoryRoute)
app.use(errorRouts)
app.use("/account", accountRoute)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})


app.get("/", baseController.buildHome)

// <= handle 404 errors here
app.use(function(req, res, next) {
  const err = new Error("Sorry, that route doesn't exist.");
  err.status = 404
  next(err)
});

app.use(function(err, req, res, next) {
  errorControler.errorHandler(err, res)
});