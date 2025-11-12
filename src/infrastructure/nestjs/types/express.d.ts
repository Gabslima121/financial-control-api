import { Request } from 'express';

export interface AuthenticatedUser {
  sub: string;
  id: string;
  [key: string]: any;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      authenticatedUser?: AuthenticatedUser;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
  authenticatedUser: AuthenticatedUser;
}
