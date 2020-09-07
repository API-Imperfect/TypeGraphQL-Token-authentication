import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../MyContext";
import jwt from "jsonwebtoken";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
    //bearer 21342524uiafadf
    const authorization = context.req.headers["authorization"];

    if (!authorization) {
        throw new Error("not authenticated");
    }

    try {
        const token = authorization.split(" ")[1];
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN!);
        context.payload = payload as any;
    } catch (error) {
        console.log(error);
        throw new Error("not authenticated");
    }

    return next();
};
