const express = require('express');
const router = express.Router()
const deckRouter = require('../routes/deckRoute')
const cardRouter = require('../routes/cardRoute')

router.use('/deck',deckRouter)
router.use('/deck/:deckId/card',cardRouter)


module.exports = router