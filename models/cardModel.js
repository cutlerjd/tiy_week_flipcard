const conn = require('../lib/db.js')
const Deck = require('./deckModel')

function createCard(id_user,id_deck,front,back){
    return new Promise(function(resolve,reject){
        let deck = getDeck(id_user,id_deck)
        deck.catch(function(err){
            err.errorMessage.push('Unable to add card, no deck found')
            reject(err)
        })
        .then(function(deck){
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
                        deck:deck.deck,
                        card:{
                            id:results.insertId,
                            front:front,
                            back:back,
                            deck_id:deck.deck.id
                        }
                    })
                }
            })
        })
    })
}