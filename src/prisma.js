import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466',
    secret: 'myprismapassword'
})

export { prisma as default }
// prisma.query prisma.mutation prisma.subscription prisma.exists
// null arg in users says users() takes in no args(just like in playground)

// prisma.mutation
//     .createPost(
//         {
//             data: {
//                 title: 'My New prisma GraphQL post is live!',
//                 body: 'Prisma is so much easier to use!',
//                 published: false,
//                 author: {
//                     connect: {
//                         id: 'ckf5589pn00y50707xhhzhphu'
//                     }
//                 }
//             }
//         },
//         '{ id title body published }'
//     )
//     .then((data) => {
//         console.log(data)
//         return prisma.query.users(null, '{ id name posts { title } }')
//     })
//     .then((data) => {
//         console.log(JSON.stringify(data, undefined, 4))
//         console.log('USERS ________________________________________USERS')
//     })

// prisma.mutation
//     .updatePost(
//         {
//             where: {
//                 id: 'ckf5ygauo016z0707og7mz555'
//             },
//             data: {
//                 body: 'This is how to get started with Prisma Mutations',
//                 published: true
//             }
//         },
//         '{ title }'
//     )
//     .then((data) => {
//         console.log(data)
//         return prisma.query.posts(null, '{ id title body published }')
//     })
//     .then((data) => {
//         console.log(data)
//     })

//______________CREATE POST_____________________________

// const createPostForUser = async (authorId, data) => {
//     const userExists = await prisma.exists.User({ id: authorId })
//     if (!userExists) {
//         throw new Error('User not found')
//     }

//     const post = await prisma.mutation.createPost(
//         {
//             data: {
//                 ...data,
//                 author: {
//                     connect: {
//                         id: authorId
//                     }
//                 }
//             }
//         },
//         '{ id }'
//     )

//     const user = await prisma.query.user(
//         {
//             where: {
//                 id: authorId
//             }
//         },
//         '{id name email posts { id title published } }'
//     )

//     return user
// }

// createPostForUser('ckf5589pn00y50707xhhzhphu', {
//     title: 'Great books to read',
//     body: 'The War of Art',
//     published: true
// })
//     .then((user) => {
//         console.log(JSON.stringify(user, undefined, 4))
//     })
//     .catch((error) => {
//         console.log(error.message)
//         //error.message trims the error message
//     })

//___________________Update Post____________________________

// const UpdatePostForUser = async (postId, data) => {
//     //data contains published:false
//     const postExists = await prisma.exists.Post({ id: postId })

//     if (!postExists) {
//         throw new Error('Post not found')
//     }
//     const post = await prisma.mutation.updatePost(
//         {
//             where: {
//                 id: postId
//             },
//             data
//         },
//         ' { author { id name email posts { id title body published}} }'
//     )
    // const user = await prisma.query.user(
    //     {
    //         where: {
    //             id: post.author.id
    //         }
    //     },
    //     '{ id name email posts { id title body published} }'
    // )

//      return post.author
// }

// UpdatePostForUser('ckfd6w3uq037t0707avu7a9j2', {
//     published: false
// })
//     .then((user) => {
//         console.log(JSON.stringify(user, undefined, 4))
//     })
//     .catch((error) => {
//         console.log(error.message)
//     })

// prisma.query.users(null, '{ id name posts { id title } }').then((data) => {
//     // JSON.Stringify helps to structure the output in console output
//     //arg 1 is the data, undefined ignores the 2nd arg, 3rd arg is indentation
//     console.log(JSON.stringify(data, undefined, 2))
//     console.log('USERS ________________________________________USERS')
// })

// prisma.query.comments(null, '{ id text author { id name } }').then((data) => {
//     console.log('COMMENTS ____________________________________COMMENTS')
//     console.log(JSON.stringify(data, undefined, 2))
//     console.log('COMMENTS ____________________________________COMMENTS')
// })
