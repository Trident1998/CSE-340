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
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const flash = require('express-flash')
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
const utilities = require("./utilities")


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

app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) 
app.use(cookieParser())
app.use(utilities.checkJWTToken)


// //Express Messages Middleware
// app.use(require('connect-flash')())
// app.use(function(req, res, next){
//   res.locals.messages = require('express-messages')(req, res)
//   next()
// })

/* ***********************
 * Routes
 *************************/
// app.use(flash());
app.use(static)

app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", inventoryRoute)
app.use(errorRouts)
app.use("/account", accountRoute)

// <= handle 404 errors here
app.use(function(req, res, next) {
  const err = new Error("Sorry, that route doesn't exist.");
  err.status = 404
  next(err)
});

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  errorControler.errorHandler(err, res)
})

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