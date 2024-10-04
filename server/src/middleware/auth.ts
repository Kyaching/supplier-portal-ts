import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

type User = {
  id: string;
  username: string;
};

export interface AuthUser extends Request {
  user?: User;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const authMiddleware = (
  req: AuthUser,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({message: "No token provided"});
  }
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(401).json({message: "Unauthorized"});
    req.user = user;
    next();
  });
};
