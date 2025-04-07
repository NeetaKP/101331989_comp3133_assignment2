const express = require('express')
const mongoose = require('mongoose')
//const {buildSchema} = require('graphql')
//const {graphqlHTTP} = require('express-graphql') 
const {ApolloServer} = require('apollo-server-express') // import Apollo Server
const  bodyParser = require('body-parser')
const cors = require('cors')

const TypeDefs = require('./graphql/schema')
const Resolver = require('./graphql/resolver')

const app = express();


const dotenv = require('dotenv')
dotenv.config()

const server = new ApolloServer({ // cereate a server (Apollo Server)
    typeDefs: TypeDefs.typesDefs,
    resolvers: Resolver.resolvers
});

// database 
mongoose.connect(process.env.DB_URL, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then((s) => {
    console.log('Mongodb connection - successful')
}).catch ((e) => {
    console.log('Mongodb connection - unsucessful/error')
})


app.use(bodyParser.json())
app.use('*',cors())
server.start().then(res => {
    server.applyMiddleware({app})

    app.listen({port: process.env.PORT}, 
        () => {
            console.log(`Server running: http://localhost:${process.env.PORT}${server.graphqlPath}`)
        }
    )
})

