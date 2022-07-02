const jwt = require('jsonwebtoken');
const {UnAuthenticatedError} = require('../errors/index');

const authenticationMiddleware = async (req, res, next) =>{
    
    const authheader = req.headers.authorization;
    if(!authheader || !authheader.startsWith('Bearer '))
        throw new UnAuthenticatedError('Auth headers missing');

    const token = authheader.split(' ')[1];

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const {id,username} = decoded
        req.user = {id,username} //sending id,uname to a user obj to request.
        next();
    } catch(error){
        throw new UnAuthenticatedError('Token validation failed.');
    }
}

module.exports = authenticationMiddleware