var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var todoSchema = new Schema({
    username: String,
    todo: String,
    isDone: Boolean,
    hasAttachment: Boolean
});

var usersSchema = new Schema({
    email: String,
    username: String,
    password: String,
});

var Todos = mongoose.model('Todos', todoSchema);
var Users = mongoose.model('Users', usersSchema);

module.exports = {Todos, Users}