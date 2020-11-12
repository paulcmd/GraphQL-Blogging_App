import getUserId from '../utils/getUserId'

const User = {
    email: {
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, { request }, info) {
            const userId = getUserId(request, false)

            if (userId && userId === parent.id) {
                return parent.email
            }

            return null
        }
    },
    posts: {
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, { prisma }, info) {

            return prisma.query.posts({
                where: {
                    published: true,
                    author: {
                        id: parent.id
                    }
                }
            })
        }
    }
}
//modifying email so only the logged in user can see their email and not other users'

export { User as default }

// posts(parent, args, { db }, info) {
//   return db.posts.filter((post) => {
//     return post.author === parent.id;
//   })
// },
// comments(parent, args, { db }, info) {
//   return db.comments.filter((comment) => {
//     return comment.author === parent.id;
//   })
// }
