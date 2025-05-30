import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { UserController } from "../controller/user.controller";

export class UserRouter {
  private router: Router;
  private userController: UserController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoute();
  }

  private initializeRoute() {
    this.router.get(
      "/",
      this.authMiddleware.verifyToken,
      this.userController.getUser
    );
    this.router.get(
      "/post",
      this.authMiddleware.verifyToken,
      this.userController.getUser
    );
    this.router.patch(
      "/update-profile",
      this.authMiddleware.verifyToken,
      this.userController.updateUser
    );

    this.router.get("/:id", this.userController.getUserId);

    this.router.delete(
      "/:id",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifySuperAdmin,
      this.userController.deleteUser
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
