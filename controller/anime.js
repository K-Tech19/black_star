let express = require('express')
let db = require('../models')
let router = express.Router()

router.post('/', (req, res)=>{
    db.anime.create({
        animeId: req.body.anime,
        name: req.body.name,
        imageurl: req.body.imageurl,
        mal_id: req.body.mal_id
    }).then((post) =>{
        console.log('hello mr.postman')
        res.redirect('/')
    })
})