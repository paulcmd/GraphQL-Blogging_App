import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
    return jwt.sign({ userId }, 'thisisasecret', {
        expiresIn: '7 days'
        // jwt.sign(userId : userId) 
        // login session will expire in 7 days with the generated token
    })
}

export { generateToken as default }
