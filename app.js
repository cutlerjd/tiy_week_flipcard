const express = require('express')
const app = express()
const path = require('path')
const mustacheExpress = require('mustache-express');
const indexRouter = require('./routes/indexRoute')
const aboutRouter = require('./routes/aboutRoute')
const session = require('express-session')
const bodyParser = require('body-parser')

//Basic body parser settings
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//Rendering with mustache
app.engine('mustache', mustacheExpress());
app.set('views', './views')
app.set('view engine', 'mustache')

//Used for session managment
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

//Allows for a static directory for hosting CSS and other files
app.use(express.static(path.join(__dirname, 'static')))

//Use the routes files.
app.use('/', indexRouter);
app.use('/about', aboutRouter);

app.listen(3000, function(){
  console.log("App running on port 3000")
})