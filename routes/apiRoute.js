const express = require('express');
const router = express.Router()
const Deck = require('../models/deckModel')
const Card = require('../models/cardModel')
const deckRouter = require('../routes/deckRoute')

router.use('/deck',deckRouter)


// router.post('/deck/:deckId/card',function(req,res,next){
//     let front = req.body.front
//     let back = req.body.back
//     let card = Card.createCard(res.locals.id_user,req.params.deckId,front,back)
//     card.catch(function(err){
//         res.json(err)
//     })
//     .then(function(data){
//         res.json(data)
//     })
// })

module.exports = router