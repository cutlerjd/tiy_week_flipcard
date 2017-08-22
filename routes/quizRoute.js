const express = require('express');
const router = express.Router();
const Quiz = require('../models/quizModel')

router.get('/',function(req,res,next){
    let quizzes = Quiz.getQuizzes(res.locals.id_user)
    quizzes.catch(function (err) {
        res.json(err)
    })
        .then(function (data) {
            res.json(data)
        })
})
router.get('/:quizId',function(req,res,next){
    console.log(req.params.quizId)
    let quiz = Quiz.getQuiz(res.locals.id_user,req.params.quizId)
    quiz.catch(function (err) {
        res.json(err)
    })
        .then(function (data) {
            res.json(data)
        })
})

router.post('/',function(req,res,next){
    let quiz = Quiz.createQuiz(res.locals.id_user,[1],req.body.name)
    quiz.catch(function (err) {
        res.json(err)
    })
        .then(function (data) {
            res.json(data)
        })
})

module.exports = router