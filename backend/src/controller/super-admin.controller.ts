import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../prisma';
import crypto from 'crypto';

export class SuperAdminController {
  // Mendapatkan semua Store Admin hanya untuk super_admin
  
  async createStoreAdmin(req: Request, res: Response) {
    try {
      const { name, email, password = 'storeadmin123', address, city, province } = req.body;

      if (!name || !email || !address || !city || !province) {
        res.status(400).json({ error: 'Missing required fields' });
      } else {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          res.status(400).json({ error: 'Email already in use' });
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);

          const newUser = await prisma.user.create({
            data: {
              name,
              email,
              password: hashedPassword,
              roles: 'ADMIN',
              isVerify: true,
              isPendingVerification: false,
              referralCode: crypto.randomUUID(), // sesuai dengan schema wajib
              Address: {
                create: {
                  address_name: 'Toko Utama',
                  address,
                  city,
                  province,
                  city_id: 'CITY_ID', // ganti sesuai kebutuhan
                  province_id: 'PROVINCE_ID', // ganti sesuai kebutuhan
                  is_primary: true,
                },
              },
            },
          });

          res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            roles: newUser.roles,
          });
        }
      }
    } catch (error) {
      console.error('Error creating store admin:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


  async deleteStoreAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({ where: { id } });

      if (!user || user.roles !== 'ADMIN') {
        res.status(404).json({ error: 'Store Admin not found' });
      } else {
        await prisma.user.delete({ where: { id } });
        res.status(200).json({ message: 'Store Admin deleted successfully' });
      }
    } catch (error) {
      console.error('Error deleting store admin:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
