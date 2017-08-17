const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator=require('express-validator');
const flash=require('connect-flash');
// connect to the the database
mongoose.connect('mongodb://localhost/node_express');
let db=mongoose.connection;

// check connection
db.once('open', function(){
  console.log('connected to mongo db');
});

// check for db errors
db.on('error', function(err){
    console.log(err);
});
// initialise the express application
const app=express();

// middle ware
//express session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
   
  }));

//   express messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
//express validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//set public folder
app.use(express.static(path.join(__dirname,'public')));
// bring in models
let Article=require('./models/article');

// load the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// home route
app.get('/',function(req,res) {
    // let articles=[
    //     {
    //         id:1,
    //         author:'aleks',
    //         title:'article one',
    //         body:'this is article one'
    //     },
    //     {
    //         id:2,
    //         author:'aleks',
    //         title:'article two',
    //         body:'this is article two'
    //     },
    //     {
    //         id:3,
    //         author:'aleks',
    //         title:'article three',
    //         body:'this is article three'
    //     }
    // ]
    Article.find({}, function(err, articles){
        if (err) {
            console.log(err);
        }else{
            res.render('index', {
                title:'Articles',
                header:'Welcome to our articles',
                articles:articles
            });
        }
        
    });
   
});

// Add route files
// articles route
 let articles=require('./routes/article');
 app.use('/articles', articles);
//  user route
let user=require('./routes/user');
app.use('/user', user);
// start the server
app.listen(3000, function() {
    console.log('App listening on port 3000!');
});