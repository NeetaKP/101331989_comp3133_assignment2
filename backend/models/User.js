const mongoose = require('mongoose')

const SchemaUser = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Username needed'],
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'Email needed'],
        unique: [true, 'Email already exists'],
        trim: true, 
        lowercase: true,
        validate:[function(value) {
            var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            return emailRegex.test(value);
        }, 'enter valid email']
    },
    password: {
        type: String,
        maxLength: 60,
        required: true,
        trim: true
    },
    created_at: {
        type: String, 
        default: Date.now,
        required: true
    },
    updated_at: {
        type: String, 
        default: Date.now,
        required: true
    }
});

const User = mongoose.model('user-assgn1',SchemaUser)
module.exports = User
