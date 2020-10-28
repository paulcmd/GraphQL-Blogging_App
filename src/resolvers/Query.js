import getUserId from '../utils/getUserId'

const Query = {
    users(parent, args, { db, prisma }, info) {
        const opArgs = {}
        if (args.query) {
            opArgs.where = {
                OR: [
                    {
                        name_contains: args.query
                    },
                    {
                        email_contains: args.query
                    }
                ]
            }
        }
        return prisma.query.users(opArgs, info)
    },

    posts(parent, args, { prisma }, info) {
        const opArgs = {
            where: {
                published: true
            }
        }

        if (args.query) {
            opArgs.where.OR = [
                //modified where to where.OR so as not to conflict with the where above
                {
                    title_contains: args.query
                },
                {
                    body_contains: args.query
                }
            ]
        }

        return prisma.query.posts(opArgs, info)
    },

    myPosts(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const opArgs = {
            where: {
                author: {
                    id: userId
                }
            }
        }

        if (args.query) {
            opArgs.where.OR = [
                //modified where to where.OR so as not to conflict with the where above
                {
                    title_contains: args.query
                },
                {
                    body_contains: args.query
                }
            ]
        }

        return prisma.query.posts(opArgs, info)  //return posts that meet the criteria in opArgs
    },


    comments(parent, args, { prisma }, info) {
        return prisma.query.comments(null, info)
    },


    me(parent, args, { prisma }, info) {
        const userId = getUserId(request)

        return prisma.query.user({
            where: {
                id: userId
            }
        })
    },

    async post(parent, args, { prisma, request }, info) {
        const userId = getUserId(request, false)

        const posts = await prisma.query.posts(
            {
                where: {
                    id: args.id,
                    OR: [
                        {
                            published: true
                        },
                        {
                            author: {
                                id: userId
                            }
                        }
                    ]
                }
            },
            info
        )

        if (posts.length === 0) {
            throw new Error('Post not found')
        }

        return posts[0]
    }
}

export { Query as default }

//opArgs are the operation arguments eg. where, and, or listed in the graphql docs
// info is all the info we are requesting in query eg query of posts on server

//     if (!args.query) {
//         return db.users
//     }
//     return db.users.filter((user) => {
//         return user.name.toLowerCase().includes(args.query.toLowerCase())
//     })
// },
// me() {
//     return {
//         id: '12345',
//         name: 'Paul',
//         email: 'paul@example.com',
//         age: 30
//     }

//_______________________________________________________________________________

// if (!args.query) {
//     return db.posts
// }
// return db.posts.filter((post) => {
//     const isTitleMatch = post.title.toLowerCase()
//     const isBodyMatch = post.body.toLowerCase()
//     return isTitleMatch || isBodyMatch
// })
