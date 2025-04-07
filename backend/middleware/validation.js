const { AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')

const verifyToken = (context) => {
    const authHeader = context.req.headers.authorization
    if(authHeader == null)
        throw new Error("Authorization header missing")
    const token = authHeader.split('Bearer')[1]
    if(token == null)
        throw new Error("Authentication token must be Bearer")

    try{
        const user = jwt.verify(token, "graphql_super_secret_key")
        return user;
    } catch (err) {
        throw new AuthenticationError('Invalid/Expired token')
    }
}

module.exports = verifyToken