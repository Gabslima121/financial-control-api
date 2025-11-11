import { Request } from 'express';

export interface AuthenticatedUser {
  sub: string;
  email?: string;
  name?: string;
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
