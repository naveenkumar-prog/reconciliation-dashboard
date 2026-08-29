import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}


export const protect = (
  req: any,
  res: Response,
  next: NextFunction
) => {

  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  const token = auth.split(" ")[1];

  try {

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    req.userId = decoded.userId;

    next();

  } catch {

    return res.status(401).json({
      message: "Invalid token"
    });
  }
};


