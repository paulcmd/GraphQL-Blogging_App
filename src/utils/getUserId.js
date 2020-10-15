import jwt from 'jsonwebtoken'

const getUserId = (request) => {
    const header = request.request.headers.authorization
    //passing in the entire request object and drilling down to just the header

    if (!header) {
        throw new Error('Authentication required')
    }

    const token = header.replace('Bearer ', '')
    //replace 'Bearer space' with empty string or....
    //const token = header.split('')[1] ...split into 2 strings at the space and grab the 2nd string

    const decoded = jwt.verify(token, 'thisisasecret')
    console.log(decoded)

    return decoded.userId
}

export { getUserId as default }
