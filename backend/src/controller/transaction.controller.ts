import { Request, Response } from "express";
import prisma from "../prisma";
import { CreateInvoiceRequest } from "xendit-node/invoice/models";
import xenditClient from "../helpers/xendit";

export class TransactionController {
  async getAll(req: Request, res: Response) {
    const { userId, id } = req.query;
    try {
      const orders = await prisma.order.findMany({
        where: {
          ...(userId && { userId: userId as string }),
          ...(id && { id: id as string }),
        },
        include: {
          items: { include: { product: true } },
          voucher: true,
          store: true,
        },
        orderBy: { createdAt: "desc" },
      });

      res
        .status(200)
        .json({ message: "Data transaksi berhasil diambil", orders });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Terjadi kesalahan", error: err });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { storeId, shippingAddress, items, totalAmount, voucherId } =
        req.body;
      const userId = req.user?.id;

      if (!userId || !storeId || !items || !totalAmount || !shippingAddress) {
        res.status(400).json({ message: "Data tidak lengkap" });
      }

      await prisma.$transaction(async (txn) => {
        const order = await txn.order.create({
          data: {
            userId: String(userId),
            storeId,
            shippingAddress,
            totalAmount,
            status: "PENDING_PAYMENT",
            voucherId,
            expiredAt: new Date(Date.now() + 60 * 60 * 1000),
            items: {
              create: items.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
        });

        if (voucherId) {
          await txn.voucher.update({
            where: { id: voucherId },
            data: { used: true },
          });
        }

        const invoiceData: CreateInvoiceRequest = {
          externalId: order.id,
          amount: totalAmount,
          invoiceDuration: 3600,
          description: `Pembayaran Order #${order.id}`,
          currency: "IDR",
          reminderTime: 1,
        };

        const invoice = await xenditClient.Invoice.createInvoice({
          data: invoiceData,
        });

        await txn.order.update({
          where: { id: order.id },
          data: { invoiceUrl: invoice.invoiceUrl }, // ✅ simpan di kolom yang benar
        });

        res.status(201).json({ message: "Order berhasil dibuat", invoice });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Gagal membuat transaksi", error: err });
    }
  }

  async updateStatus(req: Request, res: Response) {
    const { status, external_id } = req.body;

    if (!status || !external_id) {
      res.status(400).json({ message: "Missing status or external_id" });
    }

    try {
      if (status === "PAID") {
        // Update dan kurangi stok
        await prisma.$transaction(async (txn) => {
          const order = await txn.order.update({
            where: { id: external_id },
            data: {
              status: "PAID",
              confirmedAt: new Date(),
            },
            include: {
              items: true,
            },
          });

          for (const item of order.items) {
            const stock = await txn.productStock.findFirst({
              where: {
                productId: item.productId,
                storeId: order.storeId,
              },
            });

            if (!stock || stock.quantity < item.quantity) {
              throw new Error("Stok tidak mencukupi");
            }

            await txn.productStock.update({
              where: { id: stock.id },
              data: { quantity: stock.quantity - item.quantity },
            });
          }
        });
      } else if (status === "EXPIRED") {
        await prisma.order.update({
          where: { id: external_id },
          data: { status: "EXPIRED" },
        });
      }

      res.status(200).json({ message: "Status updated successfully ✅" });
    } catch (err) {
      console.error("Update status error:", err);
      res.status(400).json({ message: "Failed to update status", error: err });
    }
  }
}
