import jwt from 'jsonwebtoken'

const getUserId = (request, requireAuth = true) => {
    //requireAuth is set to true by default, so that if set to false. getUserId will return undefined
    const header = request.request.headers.authorization
    //passing in the entire request object and drilling down to just the header

    if (header) {
        const token = header.replace('Bearer ', '')
        //replace 'Bearer space' with empty string or....
        //const token = header.split('')[1] ...split into 2 strings at the space and grab the 2nd string

        const decoded = jwt.verify(token, 'thisisasecret')
        console.log(decoded)

        return decoded.userId
    }

    if (requireAuth) {
        throw new Error('Authentication required')
    }

    return null
}

export { getUserId as default }
