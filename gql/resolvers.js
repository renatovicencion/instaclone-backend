const userController = require("./../controllers/user");

const resolvers = {
    Query: {
        // User
        getUser: (_, { id, username }) => userController.getUser(id, username),
        search: (_, { search }) => userController.search(search),
    },
    Mutation: {
        // User
        register: (_, { input }) => userController.register(input),
        login: (_, { input }) => userController.login(input),
        updateAvatar: (_, { file }, context) => userController.updateAvatar(file, context),
        deleteAvatar: (_, {}, context) => userController.deleteAvatar(context),
        updateUser: (_, { input }, context) => userController.updateUser(input, context),
    }
};

module.exports = resolvers