require('dotenv').config()
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const session  = require('express-session')
const passport = require('./config/ppConfig.js')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn')

// set the view engine to ejs
app.set('view engine', 'ejs');

//tell the app to use ejs layouts ]]
app.use(require('express-ejs-layouts'));

//body parser middelware allows us to receive form data in req.body
app.use(express.urlencoded({extended: false}));

//session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

//flash middleware
app.use(flash())

// CUSTOM MIDDLEWARE

app.use((req,res, next)=> {
    // before aevery route, attach the flash messages and current user to res.locals
    res.locals.alerts = req.flash()
    res.locals.currentUser = req.user
    next()
})

//controller middleware
app.use('/auth', require('./controller/auth.js'))

// Routes
// home route
app.get('/', (req,res)=>{
    res.render('home')
});


app.get('/profile', isLoggedIn, (req,res)=>{
    res.render('profile')
});

app.get('*', (req,res)=>{
    res.render('404.ejs')
})

app.listen(process.env.PORT, ()=> {
    console.log (`DO YOU HEAR ME port ${process.env.PORT}!`)
});

// module.exports = server;
