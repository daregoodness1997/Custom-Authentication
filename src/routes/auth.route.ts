import { Router } from 'express';
import UserModel from '../models/user.model';
import AuthService from '../services/auth.service';
import AuthController from '../controllers/auth.controller';
import AuthMiddleware from '../middlewares/auth.middleware';

const router = Router();
const userModel = new UserModel();
const authService = new AuthService();
const authController = new AuthController(userModel, authService);
const authMiddleware = new AuthMiddleware(authService);

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/protected', authMiddleware.authenticateToken.bind(authMiddleware),
  (req, res) => authController.protectedRoute(req, res));

export default router;