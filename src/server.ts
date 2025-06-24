import express, { Express } from 'express';
import cors from 'cors';
import Database from './config/database';
import authRoutes from './routes/auth.route';

class Server {
  private app: Express;
  private database: Database;
  private port: number;

  constructor() {
    this.app = express();
    this.database = new Database();
    this.port = parseInt(process.env.PORT || '3000', 10);
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private setupRoutes(): void {
    this.app.use('/api/auth', authRoutes);
  }

  public async start(): Promise<void> {
    try {
      await this.database.connect();
      this.setupMiddleware();
      this.setupRoutes();
      this.app.listen(this.port, () => {
        console.log(`Server running on port ${this.port}`);
      });
    } catch (error) {
      console.error('Server startup error:', error);
    }
  }
}

const server = new Server();
server.start();