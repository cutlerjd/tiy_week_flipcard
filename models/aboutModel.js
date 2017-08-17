const dateFormat = require('dateformat');
/*
This is just to show how to connect a model file to a route
*/
function showDate(){
    let now = new Date();
    return dateFormat(now,"dddd, mmmm dS, yyyy")
}
module.exports = {
    showDate : showDate
}