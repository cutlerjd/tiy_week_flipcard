const conn = require('../lib/db.js')

function createDeck(id_user,title,description){
    return new Promise(function(resolve,reject){
        let sql = `
        INSERT INTO decks (id_user,title,description)
        VALUES (?,?,?)`
        conn.query(sql,[id_user,title,description],function(err,results,fields){
            if(err){
                reject({
                    status:'Failure',
                    error:true,
                    errorMessage:['createDeck failed to store in the DB']
                })
            } else {
                resolve({
                    status:'Success',
                    error:false,
                    deck:{
                        id:results.insertId,
                        title:title,
                        description:description
                    }
                })
            }
        })
    })
}
function getDecks(id_user){
    console.log(id_user)
    return new Promise(function(resolve,reject){
        let sql = `
        SELECT d.*, COUNT(c.id) as count 
        FROM decks d
        LEFT JOIN cards c ON d.id=c.id_deck
        WHERE  d.active = 1 AND id_user = ? AND (c.active IS NULL OR c.active =1)
        GROUP BY d.id`
        conn.query(sql,[id_user],function(err,results,fields){
            if(err){
                reject({
                    status:'Failure',
                    error:true,
                    errorMessage:'Failed to get decks from db'
                })
            } else {
                let decks = []
                console.log(results)
                results.forEach(function(deckResult){
                    console.log("deckresults",deckResult)
                    let deck = {
                        deck :{
                            id:deckResult.id,
                            title:deckResult.title,
                            description:deckResult.description,
                            count:deckResult.count
                        }
                    }
                    decks.push(deck)
                })
                resolve ({
                    status:'Success',
                    decks:decks
                })
            }
        })
    })
}
function getDeck(id_user,id_deck){
    return new Promise(function(resolve,reject){
        let sql = `
        SELECT d.*, COUNT(c.id) as count 
        FROM decks d
        LEFT JOIN cards c ON d.id=c.id_deck
        WHERE  d.active = 1 AND id_user = ? AND d.id = ? AND (c.active IS NULL OR c.active =1)
        GROUP BY d.id`
        conn.query(sql,[id_user,id_deck],function(err,results,fields){
            if(err){
                reject({
                    status:'Failure',
                    error:true,
                    errorMessage:['getDeck failed db query']
                })
            } else if(!results[0]){
                reject({
                    status:'Failure',
                    error:true,
                    errorMessage:['User and deck id had no matches']
                })
            } else {
                resolve ({
                    status:'Success',
                    deck:{
                        id:results[0].id,
                        title:results[0].title,
                        description:results[0].description,
                        count:results[0].count
                    }
                })
            }
        })
    })
}


module.exports = {
    createDeck:createDeck,
    getDeck:getDeck,
    getDecks:getDecks
}