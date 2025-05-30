//  import { Request, Response } from "express";
// import prisma from "../prisma";


// export class AdminController {
//   static getStoreAdmins(arg0: string, getStoreAdmins: any) {
//       throw new Error('Method not implemented.');
//   }

//   async getStoreAdmins(req: Request, res: Response) {
//     try {
//       const storeAdmins = await prisma.user.findMany({
//         where: { roles: 'ADMIN' },
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           roles: true,
//           createdAt: true,
//         },
//       });

//       res.status(200).json(storeAdmins);
//     } catch (error) {
//       console.error('Error getting store admins:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }}
