import { Request, Response } from "express";
import prisma from "../prisma";

export class DiscountController {
  // ✅ Create new discount
  createDiscount = async (req: Request, res: Response) => {
    try {
      const {
        name,
        type,
        amount,
        isPercentage,
        minPurchase,
        maxDiscount,
        buyQuantity,
        getQuantity,
        productId,
        storeId,
        startDate,
        endDate,
      } = req.body;

       console.log("📥 Request body:", req.body);

      // Validasi dasar
      if (!name || !type || amount == null || !storeId) {
         res.status(400).json({ error: "Missing required fields" });
      }

      const newDiscount = await prisma.discount.create({
        data: {
          name,
          type,
          amount,
          isPercentage,
          minPurchase,
          maxDiscount,
          buyQuantity,
          getQuantity,
          productId,
          storeId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      });

      res.status(201).json({ message: "Discount created", data: newDiscount });
    } catch (error: any) {
      console.error("Error creating discount:", error);

      if (error.code === "P2002") {
         res.status(400).json({ error: "Discount already exists" });
      }

      res.status(500).json({ error: "Internal server error" });
    }
  };

  // ✅ Get all discounts by store
  getAllDiscountsByStore = async (req: Request, res: Response) => {
    const { storeId } = req.params;

    try {
      const discounts = await prisma.discount.findMany({
        where: { storeId },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      res.status(200).json(discounts);
    } catch (error) {
      console.error("Error fetching discounts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // ✅ Get single discount by id
  getDiscountById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const discount = await prisma.discount.findUnique({
        where: { id },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
            },
          },
          store: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!discount) {
         res.status(404).json({ error: "Discount not found" });
      }

      res.status(200).json(discount);
    } catch (error) {
      console.error("Error fetching discount:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // ✅ Update discount
  updateDiscount = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const {
        name,
        type,
        amount,
        isPercentage,
        minPurchase,
        maxDiscount,
        buyQuantity,
        getQuantity,
        productId,
        startDate,
        endDate,
        isActive,
      } = req.body;

      const updated = await prisma.discount.update({
        where: { id },
        data: {
          name,
          type,
          amount,
          isPercentage,
          minPurchase,
          maxDiscount,
          buyQuantity,
          getQuantity,
          productId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          isActive,
        },
      });

      res.status(200).json({ message: "Discount updated", data: updated });
    } catch (error: any) {
      console.error("Error updating discount:", error);
      if (error.code === "P2025") {
         res.status(404).json({ error: "Discount not found" });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // ✅ Delete discount
  deleteDiscount = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      await prisma.discount.delete({
        where: { id },
      });

      res.status(200).json({ message: "Discount deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting discount:", error);
      if (error.code === "P2025") {
         res.status(404).json({ error: "Discount not found" });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
