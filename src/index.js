import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'
import prisma from './prisma'

const pubsub = new PubSub()

// GraphQLServer
const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        Subscription,
        User,
        Post,
        Comment
    },
    context(request) {
        return {
            db,
            pubsub,
            prisma,
            request
        }
    }
})

//Start Server
server.start(() => {
    console.log('The Server is up!')
})

// ___________________________________________________________________________________________________________________________________

//Notes:

// The 5 Scalar types in graphql
// A scalar type stores one value. A non-scalar type stores multiple values..eg an array, object

/*
string
boolean
int
float - number with decimals
ID - reps unique identifiers

reducer function reduces an array to a single value. accumulator is the first value in the array
and the 2nd and consecutive values are added to the accumulator till we have a single value

filter function: if an item/object does not meet criteria, the function returns false, and its filtered out,
else the object remains in the new array(user)
return user.name.toLowerCase().includes(args.query.toLowerCase()) ... true is returned if the user's name(in lower case)e.g sarah, includes a query string i.e "a"

return isTitleMatch || isBodyMatch ....if one of these is true, its a match, if neither is true its false

*/

/* Mutation allows us to change data on a server

users.some ... the some array method returns users(the user/array item) that is present in the array
and returns true. If no items/user in array, returns false

245 - // const isPublished = posts.some((post) => {
      //   console.log(post)
      //   return post.published && postExists

      /*
        Alternative:
        createComment(parent, args, ctx, info) {
        const userExists = users.some((user) => user.id === args.author)
        const postExists = posts.some((post) => post.id === args.post && post.published) checks if the 1st 2 and the 3rd are true
        if(!userExists && !postExists){
          throe new Error('Unable to find user and post')
        }
        
        NB! : filter returns the objects that meet the conditions, 
        some just returns true if they meet the conditions
      }
        */

// })
// console.log('post exists? : ' + postExists)
// console.log('post is published? : ' + isPublished)
// if (!isPublished) {
//   throw new Error('Post exists but is not published')
// }

// 96- input CreateUserInput holds the arguments that go into createUser mutation
// */
