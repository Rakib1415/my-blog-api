const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name : {
        type : String,
        maxLength : 50,
        minLength : 5,
        required : true,
    },
    email : {
        type : String,
        unique : true
    },
    password : String,
    status : {
        type : String,
        enum : ['pending', 'approved', 'declined', 'blocked'],
        default : 'pending',
    },
    role : {
        type : String,
        enum : ['user', 'admin'],
        default : 'user',
    }

}, {timestamps : true, id : true});

const User = model('User', userSchema);

module.exports = User;