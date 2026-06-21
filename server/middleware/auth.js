import { requireAuth } from '@clerk/express';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' }); // load .env if necessary

// This middleware automatically verifies the Clerk JWT in the Authorization header.
// It sets req.auth with the user's information.
export const authMiddleware = requireAuth();

// Since some parts of the backend expect req.user.id, we can map req.auth.userId to req.user.id
export function mapClerkAuth(req, res, next) {
  if (req.auth && req.auth.userId) {
    req.user = { id: req.auth.userId };
  }
  next();
}
