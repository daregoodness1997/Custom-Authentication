import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

interface JwtPayload {
  userId: string;
  email: string;
}

class AuthService {
  private JWT_SECRET: string;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  }

  public generateToken(user: { _id: string; email: string }): string {
    return jwt.sign({ userId: user._id, email: user.email }, this.JWT_SECRET, {
      expiresIn: '1h'
    });
  }

  public async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  public verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this.JWT_SECRET) as JwtPayload;
    } catch (error) {
      return null;
    }
  }
}

export default AuthService;