import type { Request, Response, NextFunction } from "express";
import "express-session";
import { Role } from "../models/User.js";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    userEmail?: string;
    userRole?: string;
    userName?: string;
  }
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  name?: string | undefined;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    console.log("token authetticaticteing", req.session);
    if (!req.session?.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    req.user = {
      id: req.session.userId,
      email: req.session.userEmail!,
      role: req.session.userRole as Role,
      name: req.session.userName,
    };
    console.log("going next", req.user);

    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
    return;
  }
};

export const requireRole = (allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: "Insufficient permissions for this action",
      });
      return;
    }
    next();
  };
};
