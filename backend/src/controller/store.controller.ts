import { Request, Response } from 'express';
import prisma from '../prisma';

export class StoreController {
  // ✅ Create Store
  async createStore(req: Request, res: Response) {
    try {
      const { name, address, adminId } = req.body;

      if (!name || !address || !adminId) {
         res.status(400).json({ error: 'Missing required fields: name, address, adminId' });
      }

      const adminUser = await prisma.user.findUnique({
        where: { id: adminId },
      });

      if (!adminUser || adminUser.roles !== 'ADMIN') {
         res.status(400).json({ error: 'adminId invalid atau user bukan ADMIN' });
      }

      const existingStore = await prisma.store.findFirst({
        where: { adminId },
      });

      if (existingStore) {
         res.status(400).json({ error: 'Store untuk admin ini sudah ada' });
      }

      const newStore = await prisma.store.create({
        data: {
          name,
          address,
          adminId,
        },
      });

      res.status(201).json(newStore);
    } catch (error) {
      console.error('Error creating store:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // ✅ GET all stores with admin + product stocks + product + category
  async getStores(req: Request, res: Response) {
    try {
      const stores = await prisma.store.findMany({
        include: {
          admin: {
            select: {
              id: true,
              name: true,
              email: true,
              roles: true,
              avatar: true,
            },
          },
          products: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });

      res.status(200).json(stores);
    } catch (error) {
      console.error('Error fetching stores:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // ✅ Get All Products (optionally by storeId)
async getProducts(req: Request, res: Response) {
  try {
    const { storeId } = req.query;

    if (storeId && typeof storeId !== 'string') {
     res.status(400).json({ error: 'Invalid storeId' });
    }

    const productStocks = await prisma.productStock.findMany({
      where: storeId ? { storeId: storeId as string } : undefined,
      include: {
        product: {
          include: {
            category: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });

    res.status(200).json(productStocks);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}



  // ✅ Update Store
  async updateStore(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, address, adminId } = req.body;

      const store = await prisma.store.findUnique({ where: { id } });

      if (!store) {
         res.status(404).json({ error: 'Store not found' });
      }

      if (adminId) {
        const adminUser = await prisma.user.findUnique({ where: { id: adminId } });

        if (!adminUser || adminUser.roles !== 'ADMIN') {
           res.status(400).json({ error: 'adminId invalid atau user bukan ADMIN' });
        }

        const existingStore = await prisma.store.findFirst({
          where: {
            adminId,
            NOT: { id },
          },
        });

        if (existingStore) {
           res.status(400).json({ error: 'Admin ini sudah memiliki store lain' });
        }
      }

      const updatedStore = await prisma.store.update({
        where: { id },
        data: {
          name,
          address,
          adminId,
        },
      });

      res.status(200).json(updatedStore);
    } catch (error) {
      console.error('Error updating store:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // ✅ Delete Store
  async deleteStore(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const store = await prisma.store.findUnique({ where: { id } });

      if (!store) {
         res.status(404).json({ error: 'Store not found' });
      }

      await prisma.store.delete({ where: { id } });

      res.status(200).json({ message: 'Store deleted successfully' });
    } catch (error) {
      console.error('Error deleting store:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
