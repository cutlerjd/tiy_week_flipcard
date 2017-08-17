const conn = require('../lib/db.js')
const bcrypt = require('bcryptjs');
const uuid = require('uuid')

/**
 * This function is used by Passport to log in users
 * @param {string} username Used by the user for logging in
 * @param {string} password Password of the user
 * @param {callback} done First object returned in the callback is errors, second object is either the user object or null/false
 */
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
/**
 * Returns a promise object. Promise will insert user into the users table, hash and store password, and create token.
 * @param {string} username - Required for login
 * @param {string} displayName 
 * @param {string} email 
 * @param {string} password unhashed, will be stored hashed - required for login
 * createPassword and createToken are used within this function
 */
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
                    errorMessage:['Failed creating user']
                })
            }else{
                let passwd = createPassword(results.insertId,password)
                passwd.catch(function(d){
                    reject({
                    status:'Failure',
                    error:true,
                    errorMessage:['create user failed creating password']
                })})
                .then(function(data){
                    let token = createToken(results.insertId)
                    token.catch(function(d){
                        reject({
                        status:'Failure',
                        error:true,
                        errorMessage:['create user failed storing token']
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
/**
 * Returns a promise object. Will take an unhashed password and store it hashed
 * @param {*int} id_user 
 * @param {*string} password 
 */
function createPassword(id_user,password){
    return new Promise(function(resolve,reject){
        const hash = bcrypt.hash(password, 8);
        hash.catch(function(data){
            reject({
                status:'Failure',
                error:true,
                errorMessage: ['Failed creating password hash']
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
                        errorMessage: ['Failed storing password hash']
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
/**
 * Returns a promise object. Creates a token for the id_user provided
 * @param {*int} id_user 
 * Used by createUser function
 */
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
                    errorMessage:['failed inserting token']
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
/**
 * Passport helper function. Confirms the deserilized user in Passport exists
 * @param {*int} id_user 
 * @param {*callback} done 
 */
function findById(id_user, done) {
    let sql = `
    SELECT *
    FROM users
    WHERE id = ?
    `
    conn.query(sql, [id_user], function (err, results, fields) {
        if (!err) {
            done(null, results[0])
        } else {
            console.log(err)
            done(err, null)
        }
    })
}
/**
 * Used by authorize.js middleware
 * @param {*string} token 
 */
function verifyToken(token){
    return new Promise(function(resolve,reject){
        let sql = `
        SELECT *
        FROM tokens
        WHERE token = ? AND active=1`
        conn.query(sql,[token],function(err,results,fields){
            if(err){
                reject({
                    status:'Failure',
                    message:['verifyToken failed db query']
                })
            }else {
                if(!results[0]){
                    reject({
                        status:'Failure',
                        message:['Valid token not present']
                    })
                }else{
                    resolve(results[0])
                }
            }
        })
    })
}
module.exports = {
    authenticate: authenticate,
    createUser: createUser,
    findById: findById,
    verifyToken:verifyToken
}
