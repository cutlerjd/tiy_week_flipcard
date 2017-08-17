const conn = require('../lib/db.js')
const bcrypt = require('bcryptjs');
const uuid = require('uuid')

function authenticate(username, password, done) {
    let sql = `
    SELECT *
    FROM users u
    JOIN hash h ON u.id=h.id_user
    WHERE username = ?
    `
    conn.query(sql, [username.toLowerCase()], function (err, results, fields) {
        if (!err) {
            if (results[0]) {
                let passwordHash = results[0].passwordHash
                if (bcrypt.compareSync(password, passwordHash)) {
                    let user = results[0]
                    console.log("Hashes match!")
                    done(null, user)
                } else {
                    console.log("bad pw")
                    done(null, false)
                }
            } else{
                console.log("bad username")
                done(null, false)
            }
        } else {
            console.log(err)
            done(err, null)
        }
    })
}
function createUser(username, displayName, email,password){
    return new Promise(function(resolve,reject){
        let sql = `
        INSERT INTO users (username,displayName,email)
        VALUES (?,?,?)`
        conn.query(sql,[username.toLowerCase(),displayName,email],function(err,results,fields){
            if(err){
                console.log(err)
                reject({
                    status:'Failure',
                    error: true,
                    errorMessage:'Failed creating user'
                })
            }else{
                let passwd = createPassword(results.insertId,password)
                passwd.catch(function(d){
                    reject({
                    status:'Failure',
                    error:true,
                    errorMessage:'create user failed creating password'
                })})
                .then(function(data){
                    let token = createToken(results.insertId)
                    token.catch(function(d){
                        reject({
                        status:'Failure',
                        error:true,
                        errorMessage:'create user failed storing token'
                    })})
                    .then(function(tokenResults){
                        resolve({
                            status:'Success',
                            username:username.toLowerCase(),
                            displayName:displayName,
                            email:email,
                            token:tokenResults.token,
                            id_user:results.insertId
                        })
                    })
                })
                
            }
        })
    })
}
function createPassword(id_user,password){
    return new Promise(function(resolve,reject){
        const hash = bcrypt.hash(password, 8);
        hash.catch(function(data){
            reject({
                status:'Failure',
                error:true,
                errorMessage: 'Failed creating password hash'
            })
        })
        .then(function(passwordHash){
            let sql = `
            INSERT INTO hash (id_user,passwordHash)
            VALUES (?,?)
            `
            conn.query(sql,[id_user,passwordHash],function(err,results,fields){
                if(err){
                    reject({
                        status:'Failure',
                        error: true,
                        errorMessage: 'Failed storing password hash'
                    })
                } else {
                    resolve ({results: results,
                            status:'Success',
                            error:false
                    })
                }
            })
        })
    })
}
function createToken(id_user){
    return new Promise(function(resolve,reject){
        let token = uuid()
        let sql = `
        INSERT INTO tokens (id_user,token)
        VALUES (?,?)`
        conn.query(sql, [id_user,token], function (err, results, fields){
            if(err){
                reject({
                    status:'Failure',
                    error:true,
                    errorMessage:'failed inserting token'
                })
            }else{
                resolve({
                    status:'Success',
                    error:false,
                    id_user:id_user,
                    token:token
                })
            }
        })
    })
}
function findById(id, done) {
    let sql = `
    SELECT *
    FROM users
    WHERE id = ?
    `
    conn.query(sql, [id], function (err, results, fields) {
        if (!err) {
            console.log("findByID no error")
            done(null, results[0])
        } else {
            console.log(err)
            done(err, null)
        }
    })
}

module.exports = {
    authenticate: authenticate,
    createUser: createUser,
    findById: findById
}
