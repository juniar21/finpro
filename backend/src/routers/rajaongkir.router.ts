// import { Router } from "express";
// import { AuthMiddleware } from "../middleware/auth.middleware";
// import { RajaOngkirController } from "../controller/rajaongkir.controller";

// export class RajaOngkirRouter {
//   private router: Router;
//   private rajaOngkirController: RajaOngkirController;
//   private authMiddleware: AuthMiddleware;

//   constructor() {
//     this.router = Router();
//     this.rajaOngkirController = new RajaOngkirController();
//     this.authMiddleware = new AuthMiddleware();
//     this.initializeRoutes();
//   }

//   private initializeRoutes() {
//     // GET /rajaongkir/provinces - Get all provinces
//     this.router.get(
//       "/provinces",
//       this.authMiddleware.verifyToken,
//       this.rajaOngkirController.getProvinces
//     );

//     // GET /rajaongkir/cities?provinceId= - Get cities by province
//     this.router.get(
//       "/cities",
//       this.authMiddleware.verifyToken,
//       this.rajaOngkirController.getCities
//     );

//     // POST /rajaongkir/cost - Calculate shipping cost
//     this.router.post(
//       "/cost",
//       this.authMiddleware.verifyToken,
//       this.rajaOngkirController.calculateShippingCost
//     );
//   }

//   public getRouter(): Router {
//     return this.router;
//   }
// }
