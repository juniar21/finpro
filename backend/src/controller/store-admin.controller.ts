// import { PrismaClient } from "../../prisma/generated/client";
// import { Request, Response } from "express";

// const prisma = new PrismaClient();

// export class StoreAdminController {
//   // View-only Product Management
//   async getProducts(req: Request, res: Response) {
//     try {
//       // Temukan store milik user
//       const store = await prisma.store.findFirst({
//         where: { id: req.user?.id?.toString() },
//       });
//       if (!store) throw new Error("Store not found");

//       // Ambil produk berdasarkan ProductStock (karena hubungan toko ke produk via ProductStock)
//       const productStocks = await prisma.productStock.findMany({
//         where: { storeId: store.id },
//         include: {
//           product: {
//             include: {
//               category: true,
//             },
//           },
//         },
//       });

//       // Format respons untuk menyertakan info stok dan produk
//       const products = productStocks.map((stock) => ({
//         ...stock.product,
//         stock: stock.quantity,
//         stockId: stock.id,
//         updatedAt: stock.updatedAt,
//       }));

//       return res.status(200).json(products);
//     } catch (error: unknown) {
//       const message =
//         error instanceof Error ? error.message : "Unknown error occurred";
//       return res.status(500).json({ error: message });
//     }
//   }

//   async getProductById(req: Request, res: Response) {
//     try {
//       const { productId } = req.params;

//       const store = await prisma.store.findFirst({
//         where: { id: req.user?.id?.toString() },
//       });
//       if (!store) throw new Error("Store not found");

//       // Ambil detail product stock berdasarkan ID produk dan store
//       const productStock = await prisma.productStock.findFirst({
//         where: {
//           storeId: store.id,
//           productId: productId,
//         },
//         include: {
//           product: {
//             include: {
//               category: true,
//             },
//           },
//         },
//       });

//       if (!productStock || !productStock.product) {
//         throw new Error("Product not found for this store");
//       }

//       const result = {
//         ...productStock.product,
//         stock: productStock.quantity,
//         stockId: productStock.id,
//         updatedAt: productStock.updatedAt,
//       };

//       return res.status(200).json(result);
//     } catch (error: unknown) {
//       const message =
//         error instanceof Error ? error.message : "Unknown error occurred";
//       return res.status(500).json({ error: message });
//     }
//   }
// }
