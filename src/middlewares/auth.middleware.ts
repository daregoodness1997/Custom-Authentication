import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth.service';

interface AuthRequest extends Request {
  user?: any;
}

class AuthMiddleware {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Access token required' });
      return;
    }

    const user = this.authService.verifyToken(token);
    if (!user) {
      res.status(403).json({ message: 'Invalid token' });
      return;
    }

    req.user = user;
    next();
  }
}

export default AuthMiddleware;