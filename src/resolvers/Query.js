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
        const opArgs = {}

        if (args.query) {
            opArgs.where = {
                OR: [
                    {
                        title_contains: args.query
                    },
                    {
                        body_contains: args.query
                    }
                ]
            }
        }

        return prisma.query.posts(opArgs, info)
    },

    comments(parent, args, { prisma }, info) {
        return prisma.query.comments(null, info)
    },
    post() {
        return {
            id: '134',
            title: 'Graphql 101',
            body: '',
            published: false
        }
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
