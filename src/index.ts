import "dotenv/config";
import "reflect-metadata";
import { createConnection } from "typeorm";
import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cors from "cors";
import { connectionOptions } from "../ormconfig";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import {
    createAccessToken,
    createRefreshToken,
    storeTokenInCookie,
} from "./utils/createJWT";

(async () => {
    const app: Application = express();
    app.use(cookieParser());
    const path = "/graphql";
    const PORT = process.env.PORT;

    app.post("/refresh_token", async (req, res) => {
        const token = req.cookies.leviosa;

        if (!token) {
            return res.send({ ok: false, token: "" });
        }
        //token has not expired and is valid
        let payload: any = null;
        try {
            payload = verify(token, process.env.REFRESH_TOKEN!);
        } catch (error) {
            console.log(error);
            return res.send({ ok: false, token: "" });
        }

        // token is valid and we can send back an access token

        const user = await User.findOne({ id: payload.userId });

        if (!user) {
            return res.send({ ok: false, token: "" });
        }

        if (user.tokenVersion !== payload.tokenVersion) {
            return res.send({ ok: false, token: "" });
        }

        storeTokenInCookie(res, createRefreshToken(user));

        return res.send({ ok: true, token: createAccessToken(user) });
    });

    await createConnection(connectionOptions);

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [__dirname + "/api/**/*.resolvers.*"],
        }),
        context: ({ req, res }) => ({ req, res }),
    });

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
