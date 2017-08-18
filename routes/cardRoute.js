const express = require('express');
const router = express.Router({ mergeParams: true })
const Card = require('../models/cardModel')
const cardRouter = require('../routes/cardRoute')

router.post('/', function (req, res, next) {
    let front = req.body.front
    let back = req.body.back
    let card = Card.createCard(res.locals.id_user, req.params.deckId, front, back)
    card.catch(function (err) {
        res.json(err)
    })
        .then(function (data) {
            res.json(data)
        })
})
router.get('/', function (req, res, next) {
    let card = Card.getCards(res.locals.id_user, req.params.deckId)
    card.catch(function (err) {
        res.json(err)
    })
        .then(function (data) {
            res.json(data)
        })
})
router.get('/:cardId', function (req, res, next) {
    let card = Card.getCard(res.locals.id_user, req.params.deckId, req.params.cardId)
    card.catch(function (err) {
        res.json(err)
    })
        .then(function (data) {
            res.json(data)
        })
})
module.exports = router