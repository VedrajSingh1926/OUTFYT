import dotenv from 'dotenv';

dotenv.config({ path: '../.env' }); // load .env if necessary

export const authMiddleware = (req, res, next) => {
  req.auth = { userId: 'demo_user' };
  next();
};

export function mapClerkAuth(req, res, next) {
  if (req.auth && req.auth.userId) {
    req.user = { id: req.auth.userId };
  }
  next();
}
