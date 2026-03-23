import type { NextFunction, Request, Response } from "express";

export function requireRole(role: string) {
    return  function(req: Request, res: Response, next: NextFunction) {
        if (!req.user) {
            return res.status(401).json({ error: 'your are not logged in' });
        }

        if (req.user.role !== role) {
            return res.status(403).json({error: 'unauthorized'});
        }

        next();
    }
}