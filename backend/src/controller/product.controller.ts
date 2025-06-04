import { Request, Response } from "express";
import prisma from "../prisma";
import { cloudinaryRemove, cloudinaryUpload } from "../helpers/cloudinary";


export class ProductController {
  createProduct = async (req: Request, res: Response) => {
    try {
      const { name, description, price, categoryId, storeId, quantity } = req.body;

      // Validasi field wajib
      if (!name || !description || !price || !categoryId || !storeId) {
         res.status(400).json({
          error: "Missing required fields: name, description, price, categoryId, storeId",
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

      // Upload image jika tersedia
      let imageUrl = "";
      if (req.file) {
        const result = await cloudinaryUpload(req.file, "products");
        imageUrl = result.secure_url;
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

  updateProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description, price, categoryId } = req.body;

      // Cari produk
      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
         res.status(404).json({ message: "Produk tidak ditemukan" });
         return;
      }

      // Upload gambar baru jika ada
      let imageUrl = product.imageUrl;
      if (req.file) {
        if (product.imageUrl) {
          await cloudinaryRemove(product.imageUrl);
        }
        const result = await cloudinaryUpload(req.file, "products");
        imageUrl = result.secure_url;
      }

      const priceInt = parseInt(price);
      if (isNaN(priceInt) || priceInt < 0) {
         res.status(400).json({ error: "Price must be a valid positive integer" });
      }

      // Update produk
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          name,
          description,
          price: priceInt,
          categoryId,
          imageUrl,
        },
      });

      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Gagal memperbarui produk", error });
    }
  };

  getProducts = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
         res.status(401).json({ message: "Unauthorized" });
      }

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
            where: { storeId: store.id },
            include: {
              store: {
                include: {
                  admin: true,
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
}
