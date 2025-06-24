import { OAuth2Client } from 'google-auth-library';
import UserModel from '../models/user.model';


class AuthService {
  private userModel: typeof UserModel;

  constructor(userModel: typeof UserModel) {
    this.userModel = userModel;
  }

  public async googleAuthentication(credential: string, clientID: string): Promise<any> {
    const client = new OAuth2Client(clientID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientID,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error('Invalid Google token');
    }

    const { email, given_name, family_name } = payload;

    // Check if the user already exists in the database
    let user = await this.userModel.findUserByEmail(email);
    if (!user) {
      // Create a new user if they don't exist
      user = await this.userModel.create({
        email,
        name: `${given_name} ${family_name}`,
        authSource: ['google'],
      });
    }

    // Optionally, generate a JWT token for the user
    // const token = jwt.sign({ userId: user._id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });

    return user; // or return { user, token }
  }
}

export default AuthService;
