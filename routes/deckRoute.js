const express = require('express');
const router = express.Router()
const Deck = require('../models/deckModel')

router.get('/',function(req,res,next){
    //Send lists of decks
    let decks = Deck.getDecks(res.locals.id_user)
    decks.catch(function(err){
        res.json(err)
    })
    .then(function(data){
        res.json(data)
    })
})
router.post('/',function(req,res,next){
    //Create a deck and return an id
    let deck = Deck.createDeck(res.locals.id_user,req.body.title,req.body.description)
    deck.catch(function(err){
        res.json(err)
    })
    .then(function(data){
        res.json(data)
    })
})
router.put('/',function(req,res,next){
    //Insert put here
})
router.get('/:deckId',function(req,res,next){
    //Send lists of decks
    let deck = Deck.getDeck(res.locals.id_user,req.params.deckId)
    deck.catch(function(err){
        res.json(err)
    })
    .then(function(data){
        res.json(data)
    })
})
router.put('/:deckId',function(req,res,next){
    //Send lists of decks
    res.json({
        message:"This update a deck",
        name:"Name here",
        deck_id:req.params.deckId,
        cardCount:"a number"
    })
})

module.exports = router