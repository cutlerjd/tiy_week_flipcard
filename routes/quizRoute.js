const express = require('express');
const router = express.Router();
const Quiz = require('../models/quizModel')

router.get('/',function(req,res,next){
    let quiz = Quiz.createQuiz(res.locals.id_user,[1])
    quiz.catch(function (err) {
        res.json(err)
    })
        .then(function (data) {
            res.json(data)
        })
})

module.exports = router