import { Router } from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { SuperAdminController } from '../controller/super-admin.controllers';

export class SuperAdminRouter {
  private router: Router;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes() {
   
    this.router.use(this.authMiddleware.verifyToken);
    this.router.get('/store-admins', SuperAdminController.getAllStoreAdmins);
    this.router.post('/store-admins', SuperAdminController.createStoreAdmin);
    this.router.delete('/store-admins/:id', SuperAdminController.deleteStoreAdmin);
  }

  getRouter(): Router {
    return this.router;
  }
}
