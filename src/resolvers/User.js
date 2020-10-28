import getUserId from '../utils/getUserId'

const User = {
    email(parent, args, { request }, info) {
        const userId = getUserId(request)

        if (userId && userId === parent.id) {
            return parent.email
        }

        return null
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
