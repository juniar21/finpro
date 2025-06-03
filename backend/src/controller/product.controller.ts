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
      const storeId = req.query.storeId as string;

      if (!storeId) {
         res.status(400).json({ error: "storeId harus diberikan" });
      }

      const products = await prisma.product.findMany({
        where: {
          stocks: {
            some: {
              storeId: storeId,
            },
          },
        },
        include: {
          category: true,
          stocks: {
            where: { storeId: storeId },
            include: {
              store: true,
            },
          },
        },
      });

      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
