const User = require('../models/userModel')

function Authorize(req,res,next){
    let token = req.get("Authorization")
    verified = User.verifyToken(token)
    verified.then(function(data){
        res.locals.id_user = data.id_user
        next()})
    .catch(function(data){
        res.json(data)
    })
}

module.exports = Authorize