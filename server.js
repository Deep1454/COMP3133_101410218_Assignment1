const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { graphqlUploadExpress } = require("graphql-upload");
const cors = require("cors");
const typeDefs = require("./schemas/schema");
const resolvers = require("./resolvers");
const connectDB = require("./config/db");
require("dotenv").config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }));
app.use("/uploads", express.static("uploads"));

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
    await server.start();
    server.applyMiddleware({ app });

    const PORT = process.env.PORT;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/graphql`));
}

startServer();
