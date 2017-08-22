const conn = require('../lib/db.js')
const Deck = require('./deckModel')
const Card = require('./cardModel')

function getQuizzes(id_user){
    return new Promise(function(resolve,reject){
        let sql = `
        SELECT q.*, COUNT(qu.id) as count
        FROM quiz q
        JOIN questions qu on q.id=qu.id_quiz
        WHERE q.active = 1 AND qu.active = 1 AND q.id_user = ?
        GROUP BY q.id`
        conn.query(sql,[id_user],function(err,results,fields){
            if(err){
                reject({
                    status:'Failure',
                    error:true,
                    errorMessage:['Could not retrieve quizzes from the db']
                })
            } else{
                let quizzes = results.map(function(quiz){
                    return {
                        quiz:{
                            id:quiz.id,
                            name:quiz.name,
                            count:quiz.count
                        }
                    }
                })
                resolve({
                    status:'Success',
                    quizzes:quizzes
                })
            }
        })
    })
}
function getQuiz(id_user,id_quiz){
    return new Promise(function(resolve,reject){
        let sql = `
        SELECT q.id as id_quiz, q.name as name, q.completed as completed, qu.id as id_question, qu.number as number, qu.answered as answered, qu.correct as correct, c.id as id_card, c.front as front, c.back as back, c.id_deck as id_deck
        FROM quiz q
        JOIN questions qu on q.id=qu.id_quiz
        JOIN cards c ON qu.id_card=c.id
        WHERE q.id = ? AND q.active = 1 AND qu.active = 1 AND q.id_user = ?`
        conn.query(sql,[id_quiz,id_user],function(err,results,fields){
            if(err){
                reject({
                    status:'Failure',
                    error:true,
                    errorMessage:['Failed to get quiz from db']
                })
            } else{
                let questions = results.map(function(question){
                    if(question.answered){question.answered=true}else{question.answered=false}
                    if(question.correct){question.correct=true}else{question.correct=false}
                    return {
                        question:{
                            id:question.id_question,
                            number:question.number,
                            front:question.front,
                            back:question.back,
                            answered:question.answered,
                            correct:question.correct
                        }
                    }
                    
                })
                console.log({
                    status:'Success',
                    quiz:{
                         id:results[0].id_quiz,
                         name:results[0].name
                    },
                    questions:questions
                })
                resolve ({
                    status:'Success',
                    quiz:{
                         id:results[0].id_quiz,
                         name:results[0].name
                    },
                    questions:questions
                })
            }
        })
    })
}
function createQuiz(id_user,id_deck_arr,name,questions){
    return new Promise(function(resolve,reject){
        //Gets all the cards from the deck provided to get a count
        //Array set up in case multiple decks can be used in future versions
        let cards = Card.getCards(id_user,id_deck_arr[0])
        cards.catch(function(err){
            err.errorMessage.push('createQuiz had an issue getting cards')
            reject(err)
        })
        //Shuffle the cards that are returned
        .then(function(obj){
            let quizArr = shuffleArray(obj.cards)
            quizArr.forEach(function(item,i){
                item.question = (i+1)
            })
            return quizArr
        })
        //Create the quiz in SQL
        .then(function(data){
            let quiz = newQuiz(id_user,name)
            quiz.catch(function(errorObj){
                errorObj.errorMessage.push('createQuiz failed at creating a quiz')
            })
            .then(function(quizObj){
                quizObj.questions = data
                return (quizObj)
            })
            return (quiz)
        })
        //Insert questions/cards into SQL associated with the quiz id
        .then(function(data){
            //Creates a promise for each card needing to be inserted
            let arrHold = data.questions.map(function(item){
                return insertQuestion(item.card,data.id_quiz,item.question)
            })
            //This sets up waiting till all inserts are done
            let arrResults = Promise.all(arrHold)
            arrResults.catch(function(errObj){
                reject({
                    status:'Failure',
                    error:true,
                    errorMessage:['createQuiz failed after inserting questions']
                })
            })
            //Send the question id's associated with the cards and quiz
            .then(function(results){
                resolve({
                    status:'Success',
                    quiz:{
                        id:data.id_quiz,
                        name:name
                    },
                    questions:results
                })
            })
        })
    })
}
function newQuiz(id_user,name){
    return new Promise(function(resolve,reject){
        let sql = `
        INSERT INTO quiz (id_user,name)
        VALUES (?,?)`
        conn.query(sql,[id_user,name],function(err,results,fields){
            if(err){
                console.log("newQuiz error",err)
                reject({
                    status:'Failure',
                    error:true,
                    errorMessage:['Could not create a newQiz in db']
                })
            } else {
                resolve ({
                    status:'Success',
                    id_quiz:results.insertId,
                    id_user:id_user
                })
            }
        })
    })
}
function insertQuestion(card,id_quiz,number){
    return new Promise(function(resolve,reject){
        let sql = `
        INSERT INTO questions (id_card,id_quiz,number)
        VALUES (?,?,?)`
        conn.query(sql,[card.id,id_quiz,number],function(err,results,fields){
            if(err){
                reject({
                    status:'Failure',
                    error:true,
                    errorMessage:['insertQuestion failed']
                })
            } else{
                resolve({
                    question:{
                        id:results.insertId,
                        question:number,
                        card:card
                    }
                })
            }
        })
    })
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
module.exports = {
    createQuiz,
    getQuizzes,
    getQuiz
}