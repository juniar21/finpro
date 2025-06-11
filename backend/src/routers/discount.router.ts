import { Router } from "express";
import { DiscountController } from "../controller/discount.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class DiscountRouter {
  private router: Router;
  private discountController: DiscountController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.discountController = new DiscountController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // ✅ CREATE - hanya STORE_ADMIN
    this.router.post(
      "/",
      this.authMiddleware.verifyToken,
      this.discountController.createDiscount
    );

    // ✅ READ ALL by storeId
    this.router.get(
      "/store/:storeId",
      this.authMiddleware.verifyToken, // optional auth
      this.discountController.getAllDiscountsByStore
    );

    // ✅ READ ONE by id
    this.router.get(
      "/:id",
      this.authMiddleware.verifyToken, // optional auth
      this.discountController.getDiscountById
    );

    // ✅ UPDATE - hanya STORE_ADMIN
    this.router.put(
      "/:id",
      this.authMiddleware.verifyToken,
      this.discountController.updateDiscount
    );

    // ✅ DELETE - hanya STORE_ADMIN
    this.router.delete(
      "/:id",
      this.authMiddleware.verifyToken,
      this.discountController.deleteDiscount
    );
  }

  public getRouter() {
    return this.router;
  }
}
