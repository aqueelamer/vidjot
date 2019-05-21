const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');


const app = express();

//load router
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//config file
require('./config/passport')(passport);

//DB config
const db = require('./config/database');

//to get rid of warning while connecting to database
mongoose.Promise = global.Promise;

//connect to database
mongoose.connect(db.mongoURI,{
    useMongoClient : true
})
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err))


//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//method override middleware
app.use(methodOverride('_method'));

//express-session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

  //passport middleware
  app.use(passport.initialize());
  app.use(passport.session());


  //flash
  app.use(flash());

  //global variables
  app.use(function(req, res, next) {
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      res.locals.user = req.user || null;
      next();
  });

//index route
app.get('/', (req, res) =>{
    const title = 'Welcome'
    res.render('index', {
        title: title
    });
});

//about route
app.get('/about', (req, res) =>{
    res.render('about');
});


const port = process.env.PORT || 5000;

//use routes
app.use('/ideas', ideas);
app.use('/users', users);

app.listen(port, () =>{
    console.log(`Server running on port ${port}`);
});
