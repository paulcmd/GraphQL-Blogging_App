const Subscription = {
    comment: {
        subscribe(parent, { postId }, { prisma }, info) {
            return prisma.subscription.comment(
                {
                    where: {
                        node: {
                            post: {
                                id: postId
                            }
                        }
                    }
                },
                info
            )
        }
    },

    post: {
        subscribe(parent, args, { prisma }, info) {
            return prisma.subscription.post({
              where:{
                node:{
                  published: true
                }
              }
            }, info)
        }
    }
}

export { Subscription as default }

//Comment_________________________________________-

//   const post = db.posts.find((post) => post.id === postId && post.published)

//   if (!post) {
//     throw new Error('Post not found');
//   }

//   return pubsub.asyncIterator(`comment ${postId}`)

//Post__________________________________________
