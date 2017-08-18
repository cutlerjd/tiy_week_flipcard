const conn = require('../lib/db.js')
const Deck = require('./deckModel')
const Card = require('./cardModel')

function createQuiz(id_user,id_deck_arr,questions){
    return new Promise(function(resolve,reject){
        let cards = Card.getCards(id_user,id_deck_arr[0])
        cards.catch(function(err){
            err.errorMessage.push('createQuiz had an issue getting cards')
            reject(err)
        })
        .then(function(obj){
            let quizArr = shuffleArray(obj.cards)
            console.log(quizArr)
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
    createQuiz
}