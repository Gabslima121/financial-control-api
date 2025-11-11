import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email?: string;
    name?: string;
    [key: string]: any;
  };
}