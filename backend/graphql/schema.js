const {gql} =require('apollo-server-express')

exports.typesDefs = gql 
`
    type Query {
        login(email: String!, password: String!): userResponse
        getAllUsers: userLstResponse
        getAllEmployees: empLstResponse
        getEmployeeById(id: ID!): empResponse
        getEmployeeByDesignationDepartment(designation: String, department: String): empLstResponse
    },

    input AttributesFilter{
        designation: String
        department: String
    },

    type empResponse {
        status: Boolean!
        message: String!
        employee: Employee
    },

    type empLstResponse {
        status: Boolean!
        message: String!
        employees: [Employee]
    },

    type userResponse {
        status: Boolean!
        message: String!
        user: User
        token: String
    },

    type userLstResponse {
        status: Boolean!
        message: String!
        users: [User]
    },

    type Mutation{
        signUp(
            username: String!
            email: String!
            password: String!
        ): userResponse
        addNewEmployee(
            first_name: String!
            last_name: String!
            email: String!
            gender: String
            salary: Float
            designation: String
            date_of_joining: String
            department: String
            employee_photo: String            
        ): empResponse
        updateEmployeeById(
            id: ID!
            first_name: String
            last_name: String
            email: String
            gender: String
            salary: Float
        ): empResponse
        deleteEmployeeById(id: ID!): empResponse
    },

    type Employee {
        id: ID!
        first_name: String!
        last_name: String!
        email: String!
        gender: String!
        designation: String!
        salary: Float!
        date_of_joining: String!
        department: String!
        employee_photo: String!
        created_at: String!
        updated_at: String!
    },

    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
        created_at: String!
        updated_at: String!
    }
`