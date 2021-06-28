const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./gql/schema');
const resolvers = require('./gql/resolvers');

require('dotenv').config({ path: ".env"});

mongoose.connect(process.env.BBDD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err, _) => {
    if (err) {
        console.log("Error de Conexión.");
    } else {
        server();
    }
});

function server() {
    const serverApollo = new ApolloServer({
        typeDefs,
        resolvers,
        cors: false,
        context: ({ req }) => {
            const token = req.headers.authorization;

            if (token) {
                try {
                    const user = jwt.verify(
                        token.replace("Bearer ", ""),
                        process.env.SECRET_KEY
                    );
                    return {
                        user,
                    }
                } catch (error) {
                    console.log("#### ERROR ####");
                    console.log(error);
                    throw new Error("Token Inválido.");
                }
            }
        }
    });

    serverApollo.listen({ port: process.env.PORT || 4000 }).then((response) => {
        const { url } = response;
        console.log("###################################");
        console.log(`Servidor corriendo en la url ${url}`);
        console.log("###################################");
    });
}