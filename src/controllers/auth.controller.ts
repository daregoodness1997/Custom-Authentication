import { Request, Response } from 'express';
import UserModel from '../models/user.model';
import AuthService from '../services/auth.service';

interface UserResponse {
  id: string;
  email: string;
  name: string;
}

class AuthController {
  private userModel: UserModel;
  private authService: AuthService;

  constructor(userModel: UserModel, authService: AuthService) {
    this.userModel = userModel;
    this.authService = authService;
  }

  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body as { email: string; password: string; name: string };

      const existingUser = await this.userModel.findUserByEmail(email);
      if (existingUser) {
        res.status(400).json({ message: 'Email already exists' });
        return;
      }

      const user = await this.userModel.createUser(email, password, name);
      const token = this.authService.generateToken({ _id: String(user._id), email: user.email });

      res.status(201).json({
        token,
        user: { id: user._id, email: user.email, name: user.name } as UserResponse
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as { email: string; password: string };

      const user = await this.userModel.findUserByEmail(email);
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const isMatch = await this.authService.verifyPassword(password, user.password);
      if (!isMatch) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const token = this.authService.generateToken({ _id: String(user._id), email: user.email });
      res.json({
        token,
        user: { id: user._id, email: user.email, name: user.name } as UserResponse
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  }

  public async protectedRoute(req: Request, res: Response): Promise<void> {
    res.json({ message: 'This is a protected route', user: req.user });
  }
}

export default AuthController;