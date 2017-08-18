const express = require('express');
const router = express.Router()
const deckRouter = require('../routes/deckRoute')
const cardRouter = require('../routes/cardRoute')
const quizRouter = require('../routes/quizRoute')

router.use('/deck',deckRouter)
router.use('/deck/:deckId/card',cardRouter)
router.use('/quiz/',quizRouter)


module.exports = router