import mongoose, { Schema, Model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  authSources?: Array<'self' | 'google'>; // Updated to use Array type
}

class UserModel {
  private model: Model<IUser>;

  constructor() {
    const userSchema: Schema = new Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      name: { type: String, required: true },
      authSources: { 
        type: [String], 
        enum: ['self', 'google'], 
        default: ['self'], 
        required: true // Ensure field is always present
      }
    });

    this.model = mongoose.model<IUser>('User', userSchema);
  }

  public async createUser(
    email: string,
    password: string,
    name: string,
    authSources: Array<'self' | 'google'> = ['self']
  ): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.model({ email, password: hashedPassword, name, authSources });
    return await user.save();
  }

  public async findUserByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email });
  }
}

export default UserModel;