const express = require('express');
const router = express.Router()
const Deck = require('../models/deckModel')

router.get('/deck/',function(req,res,next){
    //Send lists of decks
    let decks = Deck.getDecks(res.locals.id_user)
    decks.catch(function(err){
        res.json(err)
    })
    .then(function(data){
        res.json(data)
    })
})
router.post('/deck/',function(req,res,next){
    //Create a deck and return an id
    let deck = Deck.createDeck(res.locals.id_user,req.body.title,req.body.description)
    deck.catch(function(err){
        res.json(err)
    })
    .then(function(data){
        res.json(data)
    })
})
router.get('/deck/:deckId',function(req,res,next){
    //Send lists of decks
    let deck = Deck.getDeck(res.locals.id_user,req.params.deckId)
    deck.catch(function(err){
        res.json(err)
    })
    .then(function(data){
        res.json(data)
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

router.post('/deck/:deckId/card',function(req,res,next){
    let front = req.body.front
    let back = req.body.back
    let card = Deck.createCard(res.locals.id_user,req.params.deckId,front,back)
    card.catch(function(err){
        res.json(err)
    })
    .then(function(data){
        res.json(data)
    })
})

module.exports = router