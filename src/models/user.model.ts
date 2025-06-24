import mongoose, { Schema, Model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  email: string;
  password: string;
  name: string;
}

class UserModel {
  private model: Model<IUser>;

  constructor() {
    const userSchema: Schema = new Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      name: { type: String, required: true }
    });

    this.model = mongoose.model<IUser>('User', userSchema);
  }

  public async createUser(email: string, password: string, name: string): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.model({ email, password: hashedPassword, name });
    return await user.save();
  }

  public async findUserByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email });
  }
}

export default UserModel;