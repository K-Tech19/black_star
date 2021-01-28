require('dotenv').config()
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const session  = require('express-session')
const passport = require('./config/ppConfig.js')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn')
const { default: axios } = require('axios');
const db = require('./models/index.js');
const methodOverride = require('method-override');


// set the view engine to ejs
app.set('view engine', 'ejs');

//tell the app to use ejs layouts ]]
app.use(require('express-ejs-layouts'));

//body parser middelware allows us to receive form data in req.body
app.use(express.urlencoded({extended: false}));
app.use(express.static((__dirname, 'public')));
app.use(methodOverride('_method'));


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
app.use('/anime', require('./controller/anime.js'))
app.use('/comments', require('./controller/comments.js'))
app.use('/users', require('./controller/user.js'))

// Routes
// home route
app.get('/', isLoggedIn, (req,res)=>{
    // let animeUrl = ''
    if(req.query.query){
        axios.get(`https://api.jikan.moe/v3/search/anime?q=${req.query.query}&page=1`)
        // axios.get(`https://api.jikan.moe/v3/anime/1/episodes`)
        .then(response =>{
            // console.log(`response is here ${response} 🥶`)
            // res.send(response.data)
            res.render('home', {results: response.data.results})
        }).catch(err=>{
            console.log(err)
        })
    } else {
        res.render('home', {results: []})
    }
    
});


app.get('/profile', isLoggedIn, (req,res)=>{
    console.log(req.user.id)
    db.user.findOne({
        where: {
            id: req.user.id
        },
        include: [db.anime]
    })
    .then(favAnime =>{
        // let newAnime = favAnime.animes

        // console.log(`$$$$$$🙇🏾‍♂️`, favAnime.animes)
        res.render('profile', {faves: favAnime.animes}) 
    })
    // db.anime.create()
}); 

// app.post('/profile')

//about functionality 
app.get('/profile/edit',isLoggedIn, (req,res) =>{
    // console.log(req.user.id)
    res.render('edit')
})

app.put('/profile/edit', (req,res)=>{
    db.user.findOne({
        where: {
            id: req.user.id
        }
    }) .then( foundUser => {
        db.user.update({
            about_me: req.body.aboutme
        }, {
            where: {
                id: foundUser.id
            }
        }) .then(rowsChanged =>{
            res.redirect('/profile')
        })
    })
})

app.delete('/profile', isLoggedIn, (req,res)=>{
//First, get a reference to a user
    db.user.findOne({
        where: {
            id: req.user.id
        }
        }).then(([foundUser]) => {

        db.anime.destroy({
        where: {type: req.params}
        }).then(deletedAnime => {
            console.log("GET IT OUT THIS INSTANT🍜🍜", deletedAnime)
            // res.redirect('/profile')
            // msg: 'anime deleted'
        });
    })
    .catch(err =>{
        console.log('DELETE NOT WORKING🚨🚨🚨', err)
    })
})

app.post('/comments', (req,res)=>{
    console.log(req.body)
    db.comments.create({
        userId: req.body.userid,
        content: req.body.content,
        animeId: req.body.animeid
    })
        .then((comment) => {
            // console.log(`heyyy im calling all comments here: ${comment}`)
        res.redirect('profile')
    })
        .catch((error) => {
        res.status(400).render('main/404')
    })
})

app.get('*', (req,res)=>{
    res.render('404.ejs')
})

app.listen(process.env.PORT, ()=> {
    console.log (`DO YOU HEAR ME port ${process.env.PORT}!`)
});

// module.exports = router;
