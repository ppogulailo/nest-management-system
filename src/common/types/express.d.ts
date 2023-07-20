import { User } from '@prisma/client';
import { Request as ExpressRequest } from 'express';

declare module 'express' {
  export interface Request extends ExpressRequest {
    user?: User; // Add your User model type here
  }
}