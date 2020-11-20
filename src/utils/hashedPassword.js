import bcrypt from 'bcryptjs'

const hashedPassword = (password) => {
    if (password.length < 8) {
        throw new Error('Password must be 8 characters or longer')
    }

    return bcrypt.hash(password, 10)
}
//bcrypt.hash takes in 2 arguments. the plain text password and a salt(10 extra random characters)
export { hashedPassword as default }
