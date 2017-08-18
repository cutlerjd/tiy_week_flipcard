const conn = require('../lib/db.js')
const Deck = require('./deckModel')

function createCard(id_user,id_deck,front,back){
    return new Promise(function(resolve,reject){
        let deck = Deck.getDeck(id_user,id_deck)
        deck.catch(function(err){
            err.errorMessage.push('Unable to add card, no deck found')
            reject(err)
        })
        .then(function(obj){
            let sql = `
            INSERT INTO cards (id_deck,front, back)
            VALUES (?,?,?)`
            conn.query(sql,[id_deck,front,back],function(err,results,fields){
                if(err){
                    reject({
                        status:'Failure',
                        error:true,
                        errorMessage:['Unable to store card in db']
                    })
                } else if(!results.insertId){
                    reject({
                        status:'Failure',
                        error:true,
                        errorMessage:['no card id returned from db']
                    })
                } else{
                    resolve({
                        status:'Success',
                        deck:obj.deck,
                        card:{
                            id:results.insertId,
                            front:front,
                            back:back,
                            deck_id:obj.deck.id
                        }
                    })
                }
            })
        })
    })
}
function getCard(id_user,id_deck,id_card){
    return new Promise(function(resolve,reject){
        let deck = Deck.getDeck(id_user,id_deck)
        deck.catch(function(err){
            err.errorMessage.push('Unable to get card, user and deck do not match')
            reject(err)
        })
        .then(function(obj){
            let sql = `
            SELECT *
            FROM cards
            WHERE id = ? and id_deck = ? and active = 1`
            conn.query(sql,[id_card,id_deck],function(err,results,fields){
                if(err){
                    reject({
                        status:'Failure',
                        error:true,
                        errorMessage:'Unable to query db for card'
                    })
                } else{
                    resolve({
                        status:'Success',
                        card:{
                            id:id_card,
                            front:results[0].front,
                            back:results[0].back
                        }
                    })
                }
            })
        })
    })
}
function getCards(id_user,id_deck){
    return new Promise(function(resolve,reject){
        let deck = Deck.getDeck(id_user,id_deck)
        deck.catch(function(err){
            err.errorMessage.push('Unable to get card, user and deck do not match')
            reject(err)
        })
        .then(function(obj){
            let sql = `
            SELECT *
            FROM cards
            WHERE id_deck = ? and active = 1`
            conn.query(sql,[id_deck],function(err,results,fields){
                if(err){
                    reject({
                        status:'Failure',
                        error:true,
                        errorMessage:'Unable to query db for cards'
                    })
                } else{
                    let cards = []
                    results.forEach(function(item){
                        let card = {card : {
                            id:item.id,
                            front:item.front,
                            back:item.back
                        }}
                        cards.push(card)
                    })
                    resolve({
                        status:'Success',
                        cards:cards
                    })
                }
            })
        })
    })
}
module.exports = {
    createCard,
    getCard,
    getCards
}