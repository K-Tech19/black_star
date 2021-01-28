let express = require('express')
let db = require('../models')
const anime = require('../models/anime')
let router = express.Router()

// GET /anime/
router.get('/', (req,res)=>{

})




router.post('/', (req, res)=>{
    console.log("HOOOLLLAA 🐳", req.body)
    db.anime.create({
        name: req.body.name,
        imageurl: req.body.image_url,
        mal_id: req.body.mal_id
    }).then((newAnime) =>{
        db.user.findOne({
            where: {
                id: req.body.userId
            }
        }) .then((newUser) =>{
            newUser.addAnime(newAnime)
            console.log(newUser)
            res.redirect('/profile')
        }) .catch(err =>{
            console.log('404 THIS ISNT WORKING!!!☎️', err)
        })
        // console.log("NEW ANIME HERE 🥊 🏄🏾", newAnime)
    })
})

module.exports = router;