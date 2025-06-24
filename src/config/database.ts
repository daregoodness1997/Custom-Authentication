import mongoose from 'mongoose';

class Database {
  private uri: string;

  constructor() {
    this.uri = process.env.MONGO_URI || 'mongodb://localhost:27017/auth-provider';
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      } as mongoose.ConnectOptions);
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }
}

export default Database;