const userController = require("./../controllers/user");
const followController = require("./../controllers/follow");
const publicationController = require("./../controllers/publication");
const commentController = require("./../controllers/comment");

const resolvers = {
    Query: {
        // User
        getUser: (_, { id, username }) => userController.getUser(id, username),
        search: (_, { search }) => userController.search(search),

        // Follow
        isFollow: (_, { username }, context) => followController.isFollow(username, context), 
        getFollowers: (_, { username }) => followController.getFollowers(username),
        getFolloweds: (_, { username }) => followController.getFolloweds(username),

        // Publication
        getPublications: (_, { username }) => publicationController.getPublications(username),

        // Comment
        getComments: (_, { idPublication }) => commentController.getComments(idPublication),
    },
    Mutation: {
        // User
        register: (_, { input }) => userController.register(input),
        login: (_, { input }) => userController.login(input),
        updateAvatar: (_, { file }, context) => userController.updateAvatar(file, context),
        deleteAvatar: (_, {}, context) => userController.deleteAvatar(context),
        updateUser: (_, { input }, context) => userController.updateUser(input, context),

        // Follow
        follow: (_, { username }, context) => followController.follow(username, context),
        unFollow: (_, { username }, context) => followController.unFollow(username, context),

        // Publicaton
        publish: (_, { file }, context) => publicationController.publish(file, context),

        // Comment
        addComment: (_, { input }, context) => commentController.addComment(input, context),
    }
};

module.exports = resolvers