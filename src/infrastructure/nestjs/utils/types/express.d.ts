import { Request } from 'express';

export interface AuthenticatedUser {
  sub: string;
  id: string;
  accountId: string;
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
