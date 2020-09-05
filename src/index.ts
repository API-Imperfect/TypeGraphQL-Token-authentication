import "dotenv/config";
import "reflect-metadata";
import { createConnection } from "typeorm";
import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cors from "cors";
import expressJwt from "express-jwt";
import { connectionOptions } from "../ormconfig";

(async () => {
    const app: Application = express();
    const path = "/graphql";
    const PORT: number | string = process.env.PORT || 4000;

    await createConnection(connectionOptions);

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [__dirname + "/api/**/*.resolvers.*"],
        }),
        context: ({ req }) => {
            return {
                req,
                // @ts-ignore
                user: req.user || null, // `req.user` comes from `express-jwt`
            };
        },
    });

    app.use(
        path,
        expressJwt({
            secret: process.env.EXPRESS_JWT_SECRET!,
            algorithms: ["HS256"],
            credentialsRequired: false,
        })
    );

    app.use(
        cors({
            credentials: true,
            origin: "http://localhost:3000",
        })
    );

    apolloServer.applyMiddleware({ app, path });

    app.listen(PORT, () => {
        console.log(
            `🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`
        );
    });
})();
