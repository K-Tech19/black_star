let express = require('express')
let db = require('../models')
let router = express.Router()

router.get('/user', (req,res)=>{
    db.user.create({
        name: req.body.name,
        email: req.body.email
    }).then(createdUser =>{
        console.log(`user created 🙌🏾 ${createdUser}`)
        process.exit()
    })
})






module.exports = router;