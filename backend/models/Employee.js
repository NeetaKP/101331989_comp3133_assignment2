const mongoose = require('mongoose')

const SchemaEmployee = new mongoose.Schema({
    
    first_name:{
        type: String,
        required: [true, 'First name needed'],
        trim: true, 
        lowercase: true
    },
    last_name: {
        type: String,
        required: [true, "Last name needed"],
        trim: true,
        lowercase: true
    },
    email: {
        type: String, 
        required: [true, 'Email needed'],
        unique: [true, 'Email already exists'],
        trim: true,
        lowercase: true,
        validate: [function(value) {
            var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            return emailRegex.test(value);
        }, 'Invalid email, Enter valid email']
    },
    gender: {
        type: String,
        required: [true, 'Select gender'],
        enum: ['male','female','other'],
        default: 'other',
        trim: true,
        lowercase: true
    },
    designation: {
        type: String,
        required: [true, 'Enter designation'],
        trim: true,
        default: ""
    },
    salary: {
        type: Number,
        required: [true, 'Enter salary (must be more than 1000)'],
        default: 0.0,
        trim: true,
        validate(value){
            if (value < 1000.0){
                throw new Error('Invalid - less than minimum required')
            }
        }
    },
    date_of_joining: {
        type: Date, 
        required: true,
    },
    department: {
        type: String,
        required: [true, 'Enter department'],
        trim: true,
        default: ""
    },
    employee_photo: {
        type: String,
        trim: true,
        default: ""
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

const Employee = mongoose.model("employee-assgn1", SchemaEmployee);
module.exports = Employee