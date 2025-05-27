// import { Request, Response } from 'express';
// import bcrypt from 'bcrypt';
// import prisma from '../prisma';

// export const superAdminController = {
//   async getAll(req: Request, res: Response) {
//     try {
//       const superAdmins = await prisma.user.findMany({
//         where: { roles: 'SUPER_ADMIN' },
//       });
//       res.json(superAdmins);
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   },


//   async getById(req: Request, res: Response) {
//     try {
//       const { id } = req.params;
//       const superAdmin = await prisma.user.findUnique({ where: { id } });

//       if (!superAdmin || superAdmin.roles !== 'SUPER_ADMIN') {
//         return res.status(404).json({ error: 'Super Admin not found' });
//       }

//       res.json(superAdmin);
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   },

//   // CREATE new Super Admin
//   async create(req: Request, res: Response) {
//     try {
//       const { name, email, password } = req.body;

//       const existingUser = await prisma.user.findUnique({ where: { email } });
//       if (existingUser) {
//         return res.status(400).json({ error: 'Email already in use' });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);
//       const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

//       const newSuperAdmin = await prisma.user.create({
//         data: {
//           name,
//           email,
//           password: hashedPassword,
//           roles: 'SUPER_ADMIN',
//           referralCode,
//           isVerify: true,
//           isPendingVerification: false
//         }
//       });

//       res.status(201).json(newSuperAdmin);
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   },

//   // UPDATE Super Admin
//   async update(req: Request, res: Response) {
//     try {
//       const { id } = req.params;
//       const { name, email, password } = req.body;

//       const user = await prisma.user.findUnique({ where: { id } });
//       if (!user || user.roles !== 'SUPER_ADMIN') {
//         return res.status(404).json({ error: 'Super Admin not found' });
//       }

//       const updatedUser = await prisma.user.update({
//         where: { id },
//         data: {
//           name,
//           email,
//           password: password ? await bcrypt.hash(password, 10) : undefined,
//         }
//       });

//       res.json(updatedUser);
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   },

//   // DELETE Super Admin
//   async delete(req: Request, res: Response) {
//     try {
//       const { id } = req.params;

//       const user = await prisma.user.findUnique({ where: { id } });
//       if (!user || user.roles !== 'SUPER_ADMIN') {
//         return res.status(404).json({ error: 'Super Admin not found' });
//       }

//       await prisma.user.delete({ where: { id } });

//       res.json({ message: 'Super Admin deleted successfully' });
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }
// };
