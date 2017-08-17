const express = require('express');
const router = express.Router()

router.get('/deck/',function(req,res,next){
    //Send lists of decks
    res.json({
        message:"This will contain your list of decks",
        deckCount:"A number"
    })
})
router.post('/deck/',function(req,res,next){
    //Create a deck and return an id
    res.json({
        message:"This create a deck",
        deck_id:"Deck id here"
    })
})
router.get('/deck/:deckId',function(req,res,next){
    //Send lists of decks
    res.json({
        message:"This will return info on the deck",
        name:"Name here",
        deck_id:req.params.deckId,
        cardCount:"a number"
    })
})
router.put('/deck/:deckId',function(req,res,next){
    //Send lists of decks
    res.json({
        message:"This update a deck",
        name:"Name here",
        deck_id:req.params.deckId,
        cardCount:"a number"
    })
})

module.exports = router