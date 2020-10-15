import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from '../utils/getUserId'

const dummy = async () => {
    const email = 'james@example.com'
    const password = '12345blue'

    const hashedPassword =
        '$2a$10$9fYBfuGxvgmx1PqLUvpE0e0RUXrzwWLxuZuz3zHSpLD4ctRSO7FWe'

    const isMatch = await bcrypt.compare(password, hashedPassword)
    //bcrypt.compare hashes the plain text password and compares to the hashed password

    if (!isMatch) {
        throw new Error('Passwords do not match')
    }

    console.log('Passwords match')
}

//dummy()

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        // const emailTaken = await prisma.exists.User({ email: args.data.email })

        // if (emailTaken) {
        //     throw new Error('Email is taken')
        // } NOT NECESSARY TO CHECK IF USER EXISTS, PRISMA DOES THAT

        if (args.data.password.length < 8) {
            throw new Error('Password must be 8 characters or longer')
        }

        const hashedPassword = await bcrypt.hash(args.data.password, 10)
        //bcrypt.hash takes in 2 arguments. the plain text password and a salt(10 extra random characters)
        const user = prisma.mutation.createUser({
            data: {
                ...args.data,
                password: hashedPassword
            }
        })
        //info cant be used to return User scalar objects in this case as we are returning user and token
        //  spreading allows us to access everything in args.data. password = hashedPassword allows us to change plain text stored in args.password(plain text) to the encrypted password from bcrypt.hash

        return {
            user,
            token: jwt.sign({ userId: user.id }, 'thisisasecret')
        }
    },

    async login(parent, args, { prisma }, info) {

        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        })

        if (!user) {
            throw new Error('Unable to login')
        }

        const isMatch = await bcrypt.compare(args.data.password, user.password)
        //args.data.password is the plain text password provided by the user. user.password is the stored hashed password
        //bcrypt.compare hashes the plain text password and compares to the hashed password

        if (!isMatch) {
            throw new Error('Unable to login')
        }

        return {
            user,
            token: jwt.sign({ userId: user.id }, 'thisisasecret')
        }
    },

    async deleteUser(parent, args, { prisma, request }, info) {

        const userId = getUserId(request)

        const userExists = await prisma.exists.User({ id: args.id })

        if (!userExists) {
            throw new Error('User not found')
        }

        return await prisma.mutation.deleteUser(
            {
                where: {
                    id: userId
                }
            },
            info
        )
    },

    updateUser(parent, args, { prisma, request }, info) {

        const userId = getUserId(request)

        return prisma.mutation.updateUser(
            {
                where: {
                    id: userId
                },
                data: args.data //args.data expects name or email both of which are in data. so we can just pass args.data
            },
            info
        )
    },

    createPost(parent, args, { prisma, request }, info) {

        const userId = getUserId(request) //the userId is returned from getUserId function....decoded.userId

        return prisma.mutation.createPost(
            {
                data: {
                    title: args.data.title,
                    body: args.data.body,
                    published: args.data.published,
                    author: {
                        connect: {
                            id: userId
                        }
                    }
                }
            },
            info
        )
    },

    updatePost(parent, args, { prisma }, info) {

        return prisma.mutation.updatePost(
            {
                where: {
                    id: args.id
                },
                data: args.data
            },
            info
        )
    },

   async deletePost(parent, args, { prisma, request }, info) {

        const userId = getUserId(request)

        const postExists = await prisma.exists.Post({ 
            id: args.id,  //check if post id is same as the one provided in args
            author:{
                id: userId      //check if author id is same as user id from token
            }                //if either of the 2 dont match up, postExists will return false
        })

        if(!postExists){
            throw new Error('Unable to delete post')
        }

        return prisma.mutation.deletePost(
            {
                where: {
                    id: args.id
                }
            },
            info
        )
    },

    createComment(parent, args, { prisma }, info) {

        return prisma.mutation.createComment(
            {
                data: {
                    text: args.data.text,
                    author: {
                        connect: {
                            id: args.data.author
                        }
                    },
                    post: {
                        connect: {
                            id: args.data.post
                        }
                    }
                }
            },
            info
        )
    },

    updateComment(parent, args, { prisma }, info) {

        return prisma.mutation.updateComment(
            {
                where: {
                    id: args.id
                },
                data: args.data
            },
            info
        )
    },

    deleteComment(parent, args, { prisma }, info) {

        return prisma.mutation.deleteComment(
            {
                where: {
                    id: args.id
                }
            },
            info
        )
    }
}

export { Mutation as default }

// Create User_____________________________________________________________________________
// const emailTaken = db.users.some((user) => {
//     //check each user email against supplied email from the client through args
//     return user.email === args.data.email
// })

// if (emailTaken) {
//     throw new Error('Email is taken')
// }

// const user = {
//     id: uuidv4(),
//     ...args.data,
// }

// // push new user object into the users array

// db.users.push(user)

// //return user so client can get all the data including the id generated
// return user

//Deleted User________________________________________________________________________________________
// const userIndex = db.users.findIndex((user) => {
//     return user.id === args.id
// })

// if (userIndex === -1) {
//     throw new Error('User not found')
// }

// //splice will delete 1 item at the userIndex index. deleted user will be returned to deleteUsers
// const deletedUsers = db.users.splice(userIndex, 1)

// posts = db.posts.filter((post) => {
//     const match = post.author === args.id

//     //if its a match, delete all of its comments
//     if (match) {
//         db.comments = db.comments.filter((comment) => {
//             //if the comment doesn't belong to the post we deleted, it can stay
//             return comment.post !== post.id
//         })
//     }
//     return !match
// })

// //filter out comments from other posts the deleted user made
// db.comments = db.comments.filter(
//     (comment) => comment.author !== args.id
// )

// console.log(`${deletedUsers[0].name} has been deleted!`)
// return deletedUsers[0]

//Update User_______________________________________________________________________
// const { id, data } = args
// const user = db.users.find((user) => user.id === id)

// if (!user) {
//     throw new Error('User not found')
// }

// if (typeof data.email === 'string') {
//     const emailTaken = db.users.some(
//         (user) => user.email === data.email
//     )

//     if (emailTaken) {
//         throw new Error('Email Taken')
//     }

//     user.email = data.email
// }

// if (typeof data.name === 'string') {
//     user.name = data.name
// }

// if (typeof data.age !== 'undefined') {
//     user.age = data.age
// }

// return user

//Create Post__________________________________________________________
// const userExists = db.users.some((user) => {
//     return user.id === args.data.author
// })

// if (!userExists) {
//     throw new Error('User not found')
// }

// const post = {
//     id: uuidv4(),
//     ...args.data
// }

// db.posts.push(post)

// if (args.data.published) {
//     //publish takes in the chanel name 'post' and the post object
//     pubsub.publish('post', {
//         post: {
//             mutation: 'CREATED',
//             data: post
//         }
//     })
// }

// return post

//Delete Post_____________________________________________________________________
// const postIndex = db.posts.findIndex((post) => {
//     return post.id === args.id
// })

// // if nothing at index 0 going forward(no items in array)
// if (postIndex === -1) {
//     throw new Error('Post not found')
// }

// // deleting the post. [deletePost] is the first array item at index 0
// //[deletedPost] can be written as deletedPosts[0]
// //splice takes in 2 args. 1st is where u want to start removing items, the 2nd is the no. of items u want to remove
// //splice gives you back removed items as the return value
// const [deletedPost] = db.posts.splice(postIndex, 1)

// // store in comments, comments that dont match with the deleted post id
// //i.e preserve all comments from all other posts except from this post
// db.comments = db.comments.filter((comment) => {
//     return comment.post !== args.id
// })

// console.log(db.posts)

// console.log(`${deletedPost.title} post has been deleted`)

// if (deletedPost.published) {
//     pubsub.publish('post', {
//         post: {
//             mutation: 'DELETED',
//             data: deletedPost
//         }
//     })
// }

// return deletedPost

//_________Update Post________________________________________________________________________

// const { id, data } = args
// const post = db.posts.find((post) => post.id === id)
// const originalPost = { ...post }

// if (!post) {
//     throw new Error(`Post doesn't exist`)
// }

// if (typeof data.title === 'string') {
//     post.title = data.title
// }

// if (typeof data.body === 'string') {
//     post.body = data.body
// }

// if (typeof data.published === 'boolean') {
//     post.published = data.published

//     if (originalPost.published && !post.published) {
//         //deletes the current changes made to the post eg editing title etc. CHANGES DELETED
//         pubsub.publish('post', {
//             post: {
//                 mutation: 'DELETED',
//                 data: originalPost
//             }
//         })
//     } else if (!originalPost.published && post.published) {
//         //created - its being published now and thus same as being created now.
//         pubsub.publish('post', {
//             post: {
//                 mutation: 'CREATED',
//                 data: post
//             }
//         })
//     }
// } else if (post.published) {
//     //its a published post. user just changed something eg. title or body
//     pubsub.publish('post', {
//         post: {
//             mutation: 'UPDATED',
//             data: post
//         }
//     })
// }

// return post

//___Create Comment________________________________________________________________

// const userExists = db.users.some((user) => {
//     return user.id === args.data.author
// })

// if (!userExists) {
//     throw new Error('User does not exist')
// }

// const postExists = db.posts.some((post) => {
//     console.log(post)
//     return post.id === args.data.post && post.published
// })

// if (!postExists) {
//     throw new Error('Post does not exist or is not published')
// }

// const comment = {
//     id: uuidv4(),
//     ...args.data
// }

// db.comments.push(comment)

// pubsub.publish(`comment ${args.data.post}`, {
//     comment: {
//         mutation: 'CREATED',
//         data: comment
//     }
// })

// return comment

//_______Update Comment___________________________________________________________
// const { id, data } = args
// // find the comment in the database
// const comment = db.comments.find((comment) => comment.id === id)

// //verify it exists, else throw Error
// if (!comment) {
//     throw new Error(`Comment not found: ${id}`)
// }

// //update comment
// if (typeof data.text === 'string') {
//     comment.text = data.text
// }
// //comment.post provides postId(as in schema)
// pubsub.publish(`comment ${comment.post}`, {
//     comment: {
//         mutation: 'UPDATED',
//         data: comment
//     }
// })

// return comment

// _____________Delete Comment__________________________________________

// const commentIndex = db.comments.findIndex((comment) => {
//     return comment.id === args.id
// })

// if (commentIndex === -1) {
//     throw new Error('Comment not found')
// }
// //deletedComment === deletedComments[0] i.e first item in array
// const [deletedComment] = db.comments.splice(commentIndex, 1)

// console.log(`Comment on post ${deletedComment.post} has been deleted!`)

// //deletedComment.post because schema wants postId
// //which is provided in comment.post
// pubsub.publish(`comment ${deletedComment.post}`, {
//     comment: {
//         mutation: 'DELETED',
//         data: deletedComment
//     }
// })

// return deletedComment
