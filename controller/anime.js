let express = require('express')
let db = require('../models')
let router = express.Router()

// GET /anime/
router.get('/anime', (req,res)=>{

})




router.post('/', (req, res)=>{
    db.anime.create({
        name: req.body.name,
        imageurl: req.body.image_url,
        mal_id: req.body.mal_id
    }).then((post) =>{
        console.log('hello mr.postman')
        res.redirect('/profile')
    })
})

module.exports = router;