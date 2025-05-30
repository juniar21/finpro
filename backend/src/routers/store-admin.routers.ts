// import { Router } from 'express';
// import { AuthMiddleware } from '../middleware/auth.middleware';
// import { AdminController } from '../controller/store-admin.controller';



// export class AdminRouter {
//   private router: Router;
//   private authMiddleware: AuthMiddleware;

//   constructor() {
//     this.router = Router();
//     this.authMiddleware = new AuthMiddleware();
//     this.initializeRoutes();
//   }

//   private initializeRoutes() {
   
//     this.router.use(this.authMiddleware.verifyToken);
//     this.router.get('/admin-store', AdminController.getStoreAdmins);
   
//   }

//   getRouter(): Router {
//     return this.router;
//   }
// }
