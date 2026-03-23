import { decodeUserToken, type JWTPayload } from "../utils/token";
import type { NextFunction, Request, Response } from "express";

export function authenticationMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return next();
    }

    if(!authHeader.startsWith('Bearer ')) {
        return res.status(400).json({error: 'authentication header should start with Bearer'});
    }

    const [_, token] = authHeader.split(' ');

    let decoded: JWTPayload;

    try {
        decoded = decodeUserToken(token);
    } catch(err) {
        return next();
    }

    req.user = decoded;

    return next();
}

