const passport = require('passport')
const db = require('../models')
const LocalStrategy = require('passport-local')

// -------------> Serialization <---------------
//tell passport to seralized the user using
// the id by passing it in to the doneCallback
passport.serializeUser((user, doneCallback)=>{
    console.log('serializing the user...')
    doneCallback(null, user.id)
})


// tells passport how to deserialize the user now by looking it up 
// in the database on the id (which was stored in the session)

passport.deserializeUser((id, doneCallback)=>{
    db.user.findByPk(id)
    .then(foundUser =>{
        console.log('deserialising user...')
        doneCallback(null, foundUser)
    })
    .catch(err =>{
        console.log('ERROR deserializing user')
    })
})

// -------------> Strategy set up <-------------

const findAndLogInUser = (email, password, doneCallback) =>{
    //tell password how to tell our user is legit
    db.user.findOne({
        where: { email:email}
    }) 
    .then( async foundUser =>{
        let match 
        if(foundUser){
            //check that the password is legit
            match = await foundUser.validPassword(password)
        }
        if(!foundUser || !match){ //there's something funky about the user
            console.log('Password was not validated and match is false')
            return doneCallback(null, false)
        } else { //user was legit
            return doneCallback(null, foundUser)
        }
    })
    .catch(err=>doneCallback(err))
}


/* think of doneCallback as function thath looks like this:
login(error, userToBeLogginIn) {
    //do stuff
}

we provide "null if there's no error, or 'false' if there's no user or if 
the password is invaild (like they did in the passport-local docs) "


*/

const fieldsToCheck = {
    usernameField: 'email',
    passwordField: 'password'
}

// create an instance of Local stratgey
// --> constuctor arg 1: 
// and object that indicates how we're going to refer to the 2 fields
// we're checking (for ex. we're using email instead of username)

//--> constuctor arg 2:
// a callback that is ready to recevie the two field we're checking
//as well as a doneCallback
const strategy = new LocalStrategy(fieldsToCheck, findAndLogInUser)

passport.use(strategy)



module.exports = passport