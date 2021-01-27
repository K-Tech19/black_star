let express = require('express')
let db = require('../models')
let router = express.Router()







router.post('/', (req, res)=>{
    db.anime.create({
        animeId: req.body.animeId,
        name: req.body.name,
        imageurl: req.body.image_url,
        mal_id: req.body.mal_id
    }).then((post) =>{
        console.log('hello mr.postman')
        res.redirect('/')
    })
})

module.exports = router;