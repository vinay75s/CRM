import jwt from "jsonwebtoken";
import type { IUser } from "../models/User.js";

export interface ITokenPayload {
  id: string;
  email: string;
  role: string;
}

export const generateToken = (user: IUser): string => {
  const secret = process.env.JWT_SECRET || "your_secret";
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    secret
  );
};

export const verifyToken = (token: string): ITokenPayload | null => {
  try {
    const secret = process.env.JWT_SECRET || "your_secret";
    return jwt.verify(token, secret) as ITokenPayload;
  } catch (error) {
    return null;
  }
};
