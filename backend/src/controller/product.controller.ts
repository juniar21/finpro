import { Request, Response } from "express";
import prisma from "../prisma";

export class ProductController {
  createProduct = async (req: Request, res: Response) => {
    try {
      const { name, description, price, imageUrl, categoryId, storeId, quantity } = req.body;

      // Validasi field wajib
      if (!name || !description || !price || !imageUrl || !categoryId || !storeId) {
         res.status(400).json({
          error: "Missing required fields: name, description, price, imageUrl, categoryId, storeId",
        });
      }

      const priceInt = parseInt(price);
      const quantityInt = parseInt(quantity ?? "0");

      if (isNaN(priceInt) || priceInt < 0) {
         res.status(400).json({ error: "Price must be a valid positive integer" });
      }

      if (isNaN(quantityInt) || quantityInt < 0) {
         res.status(400).json({ error: "Quantity must be a valid non-negative integer" });
      }

      // Buat produk
      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
          price: priceInt,
          imageUrl,
          categoryId,
        },
      });

      // Tambahkan stok awal untuk produk ini di toko terkait
      await prisma.productStock.create({
        data: {
          productId: newProduct.id,
          storeId,
          quantity: quantityInt,
        },
      });

      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

 getProducts = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
      }

      // Cari store milik user ini
      const store = await prisma.store.findUnique({
        where: { adminId: String(userId) },
      });

      if (!store) {
        res.status(403).json({ message: "Anda belum memiliki toko" });
        return;
      }

      const products = await prisma.product.findMany({
        where: {
          stocks: {
            some: {
              storeId: store.id,
            },
          },
        },
        include: {
          category: true,
          stocks: {
            where: {
              storeId: store.id,
            },
            include: {
              store: {
                include: {
                  admin: true, // ini untuk mendapatkan data user pemilik toko
                },
              },
            },
          },
        },
      });

      res.json(products);
    } catch (error) {
      console.error("Error saat mengambil produk:", error);
      res.status(500).json({ message: "Gagal mengambil produk", error });
    }
  };

   getAllProducts = async (req: Request, res: Response) => {
    try {
      // Fetch all products with their categories and stock information
      const products = await prisma.product.findMany({
        include: {
          category: true,
          stocks: {
            include: {
              store: true, // to include store information for each product stock
            },
          },
        },
      });

      res.json(products);
    } catch (error) {
      console.error("Error while fetching all products:", error);
      res.status(500).json({ message: "Failed to fetch all products", error });
    }
  };
}

