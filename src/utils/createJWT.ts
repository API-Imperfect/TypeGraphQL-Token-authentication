import jwt from "jsonwebtoken";
import { User } from "../entity/User";
import { Response } from "express";

export const createAccessToken = (user: User) => {
    return jwt.sign(
        {
            userId: user.id,
        },
        process.env.ACCESS_TOKEN!, // process.env.JWT_TOKEN || ""
        { expiresIn: "45m" }
    );
};

export const createRefreshToken = (user: User) => {
    return jwt.sign(
        {
            userId: user.id,
            tokenVersion:user.tokenVersion
        },
        process.env.REFRESH_TOKEN!, // process.env.JWT_TOKEN || ""
        { expiresIn: "7d" }
    );
};

export const storeTokenInCookie = (res: Response, token: string) => {
    res.cookie("leviosa", token, {
        httpOnly: true,
        path: "/refresh_token",
        secure: process.env.NODE_ENV !== "development"
    });
};
