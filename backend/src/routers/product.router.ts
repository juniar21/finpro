import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { ProductController } from "../controller/product.controller";

export class ProductRouter {
  private router: Router;
  private productController: ProductController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.productController = new ProductController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // POST /product - buat produk, pakai verifyToken middleware
    this.router.post(
      "/",
      this.authMiddleware.verifyToken,
      this.productController.createProduct
    );

    // GET /product - ambil semua produk, pakai verifyToken middleware
    this.router.get(
      "/",
      this.authMiddleware.verifyToken,
      this.productController.getProducts
    );
  }

  getRouter() {
    return this.router;
  }
}
