import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../prisma';
import crypto from 'crypto';

export class SuperAdminController {
  // Mendapatkan semua Store Admin hanya untuk super_admin
  async getAllStoreAdmins(req: Request, res: Response) {
    try {
      const storeAdmins = await prisma.user.findMany({
        where: { roles: 'ADMIN' },
        select: {
          id: true,
          name: true,
          email: true,
          roles: true,
          createdAt: true,
          Address: {
            select: {
              address: true,
              city: true,
              province: true,
            },
          },
        },
      });

      res.status(200).json(storeAdmins);
    } catch (error) {
      console.error('Error getting store admins:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // REGISTER Store Admin (Hanya dengan name, email, dan password)
  async createstoreadmin(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      // Validasi jika field name, email, atau password tidak ada
      if (!name || !email || !password) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      // Cek apakah email sudah terdaftar
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(400).json({ error: 'Email already in use' });
        return;
      }

      // Hash password sebelum menyimpannya ke database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Buat user baru
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          roles: 'ADMIN',  
          isVerify: true,  
          isPendingVerification: false,
          referralCode: crypto.randomUUID(),  
        },
      });

      // Kirim respons dengan data user baru
      res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        roles: newUser.roles,
      });
    } catch (error) {
      console.error('Error creating store admin:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // DELETE Store Admin by ID
  async deleteStoreAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({ where: { id } });

      if (!user || user.roles !== 'ADMIN') {
        res.status(404).json({ error: 'Store Admin not found' });
        return;
      }

      await prisma.user.delete({ where: { id } });
      res.status(200).json({ message: 'Store Admin deleted successfully' });
    } catch (error) {
      console.error('Error deleting store admin:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
