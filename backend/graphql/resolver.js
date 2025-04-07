const { ApolloError } = require('apollo-server-errors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Employee = require('../models/Employee')
const User = require('../models/User')

exports.resolvers = {
    Query: {
        login: async (p,args) => {
            console.log('bk-aaa')
            try {
                const user = await User.findOne({email: args.email}).exec()
                console.log('bk-aaa')
                if(user == null){
                    return {
                        status: false, 
                        message: `This email ${args.email} is not signed up. Enter correct email or Sign-up`,
                        user: null
                    }

                } 
                
                if (await bcrypt.compare(args.password, user.password)){
                    const jwtKey = "my_secret_key"
                    myToken = jwt.sign(
                        {
                            user: args.username
                        },
                        jwtKey,
                        {
                            expiresIn: "2h"
                        }
                    );
                    return {
                        status: true,
                        message: `Login successful: ${user.username}`,
                        user: user,
                        token: myToken
                    }
                } else {
                    return {
                        status: false, 
                        message: "Wrong password",
                        user: null
                    }
                }
            } catch (err) {
                return{
                    status: false, 
                    message: err.message,
                    user: null
                }
            }
        },
        getAllUsers: async (p, args) => {
            const usrlst = await User.find();
            if(usrlst == null){
                return {
                    status: false,
                    message: "We dont have a single employee",
                    users: null
                }
           
            }
            return {
                status: true,
                message: "Employee list found",
                users: usrlst
            }
        },
        getAllEmployees: async (p, args) => {
            const emplst = await Employee.find();
            if(emplst == null){
                return {
                    status: false,
                    message: "We dont have a single employee",
                    employees: null
                }
           
            }
            return {
                status: true,
                message: "Employee list found",
                employees: emplst
            }
        },
        getEmployeeById: async (p, args) => {
            console.log("gebid-aaaa")
            try {
                console.log("gebid-bbbbb")
                const emp = await Employee.findById(args.id);
                console.log("gebid-cccc")
                if(emp != null){
                    console.log("gebid-dddd")
                    console.log(emp)

                    return {
                        status: true, 
                        message: `Employee with id ${args.id} found`,
                        employee: emp
                    }
                }
                console.log("gebid-eeee")

                return {
                    status: false, 
                    message: `Employee with id ${emp.id} not found`,
                    employee: null
                }

            } catch (err) {
                return {
                    status: false,
                    message: `Employee id ${args.id} not found`,
                    employee: null
                }
            }
        },
        getEmployeeByDesignationDepartment: async (p,{designation, department}) => {
            //(filter: AttributesFilter): empResponse
            let filter = {}
            if(designation != null)
                filter.designation = designation
            if(department != null)
                filter.department = department

            try {
                const templst = await Employee.find(filter);
                return {
                    status: true,
                    message: `One or more employees found`,
                    employees: templst
                }
            } catch(err) {
                return {
                    status: false, 
                    message: `A employee not found`,
                    employees: null
                }
            }

        }
    },

    Mutation: {
        signUp: async (p,args) => {
            // check if user already exist 
            console.log("bk-sup-aaaa")
            var tuser = await User.findOne({username: args.username});
            if(tuser != null){
                throw new ApolloError(`Username ${args.username} not available`,'USERNAME_ALREADY_EXISTS')
            }
            
            console.log("bk-sup-bbbb")
            tuser = await User.findOne({email: args.email});
            if(tuser != null){
                throw new ApolloError(`Email ${args.email} already used`,'EMAIL_ALREADY_EXISTS')
            }

            const encrPassword = await bcrypt.hash(args.password,10);
            const nuser = new User({
                username: args.username,
                email: args.email,
                password: encrPassword,
            })
            await nuser.save()

            return {
                status: true,
                message: `Username ${nuser.username} successfully signed up`,
                user: nuser
            }
        },
        addNewEmployee: async (p, args) => {
            console.log('bk-ane-aaaa-0')
            const temp = await Employee.findOne({email: args.email});
            console.log('bk-ane-aaaa')
            if(temp != null){
                throw new ApolloError('Email already used', 'EMAIL_ALREADY_EXISTS')
            }
            console.log('bk-ane-bbbb')

            try{
                const nemp = new Employee({
                    first_name: args.first_name,
                    last_name: args.last_name,
                    email: args.email,
                    gender: args.gender,
                    salary: args.salary,
                    designation: args.designation,
                    date_of_joining: args.date_of_joining,
                    department: args.department,
                    employee_photo: args.employee_photo,
                    created_at: Date().now,
                    updated_at: Date().now
                })
                console.log('bk-ane-cccc')
                await nemp.save()
                console.log('bk-ane-dddd')
                return {
                    status: true, 
                    message: "Success! - employee added",
                    employee: nemp
                }
            }catch (err) {
                return{
                    status: false,
                    message: err.message,
                    employee: null
                }
            }
        },
        updateEmployeeById: async (p, args) => {
            console.log('bk-uebi-aaaa')
            try {
                console.log('bk-uebi-bbbb')
                const temp = await Employee.findById(args.id)
                console.log(temp)
                if(!(args.email != null && temp.email == args.email)){
                    const temail = await Employee.findOne({email: args.email})
                    if(temail != null){
                        throw new ApolloError(`Email ${args.email} is not registered`, 'EMAIL_NOT_FOUND')
                    }
                } else if (args.email != null) {
                    temp.email = args.email
                }
                console.log('bk-uebi-cccc')

                if(args.first_name != null && args.first_name != ''){
                    temp.first_name = args.first_name
                }
                console.log(args.last_name);
                console.log('bk-uebi-dddd')

                if(args.last_name != null){
                    temp.last_name = args.last_name
                }

                if(args.gender != null){
                    temp.gender = args.gender
                }
                console.log('bk-uebi-eeee')

                if(args.salary != null){
                    temp.salary = args.salary
                }

                if(args.designation != null){
                    temp.designation = args.designation
                }

                if(args.date_of_joining != null){
                    temp.date_of_joining = args.date_of_joining
                }
                console.log('bk-uebi-ffff')

                if(args.department != null){
                    temp.department = args.department
                }

                if(args.employee_photo != null){
                    temp.employee_photo = args.employee_photo
                }

                temp.update_at = Date().now 
                console.log('bk-uebi-gggg')
                console.log(temp)

                await temp.save()
                console.log('bk-uebi-hhhh')

                return {
                    status: true, 
                    message: `Employee with id ${temp.id} - updated`,
                    employee: temp
                }


            } catch (err) {
                return {
                    status: false, 
                    message: err.message,
                    employee: null
                }
            }

        },
        deleteEmployeeById: async (p, args) => {
            console.log("delEbId-aaaa")
            try {
                const emps = await Employee.find()

                console.log("emps--",emps)
                console.log("args.id--",args.id)
                const temp = await Employee.findByIdAndDelete(args.id)
                console.log(temp)
                if(temp != null){
                    return {
                        status: true, 
                        message: `Employee with id ${args.id} - deleted`,
                        employee: temp
                    }
                } else {
                    return {
                        status: false,
                        message: `Employee delete attempt failed for id ${args.id}`,
                        employee: null
                    }
                }
            } catch (err) {
                return {
                    status: false,
                    message: `Employee delete attempt failed for id ${args.id}`,
                    employee: null
                }

            }
        }


    }

}