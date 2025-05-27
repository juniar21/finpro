// import { PrismaClient } from "../../prisma/generated/client";
// import { Request, Response } from "express";
// import bcrypt from "bcrypt";
// import { generateReferralCode } from "../helpers/reffcode";

// const prisma = new PrismaClient();

// export class SuperAdminController {
//   async createUser(req: Request, res: Response) {
//     try {
//       const { email, password, roles, name } = req.body;
//       let avatarUrl = null;

//       if (req.file) {
//         try {
//           const result = await uploadAvatarImage(req.file.path);
//           avatarUrl = result.secure_url;
//         } catch (error) {
//           const uploadError = error as Error;
//           return res.status(400).json({
//             error: "Failed to upload avatar",
//             details: uploadError.message,
//           });
//         }
//       }

//       const existingUser = await prisma.user.findUnique({
//         where: { email },
//       });

//       if (existingUser) {
//         if (avatarUrl) {
//           await deleteAvatarImage(avatarUrl);
//         }
//         return res.status(400).json({ error: "Email already exists" });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       const newUser = await prisma.user.create({
//         data: {
//           email,
//           password: hashedPassword,
//           roles,
//           name,
//           referralCode: roles === "CUSTOMER" ? generateReferralCode(8) : null,
//           isVerify: true,
//           isPendingVerification: false,
//           // avatar: avatarUrl // if you store avatar in DB
//         },
//       });

//       return res.status(201).json({
//         status: "success",
//         message: "User created successfully",
//         data: newUser,
//       });
//     } catch (error) {
//       console.error("Create user error:", error);
//       return res.status(500).json({ error: "Could not create user" });
//     }
//   }

//   async getAllUsers(req: Request, res: Response) {
//     try {
//       const page = Number(req.query.page) || 1;
//       const limit = Number(req.query.limit) || 10;
//       const skip = (page - 1) * limit;
//       const totalUsers = await prisma.user.count();
//       const users = await prisma.user.findMany({
//         select: {
//           id: true,
//           email: true,
//           name: true,
//           roles: true,
//           referralCode: true,
//           isVerify: true,
//           isPendingVerification: true,
//           createdAt: true,
//           updatedAt: true,
//         },
//         skip,
//         take: limit,
//       });

//       const totalPages = Math.ceil(totalUsers / limit);

//       return res.status(200).json({
//         status: "success",
//         data: users,
//         pagination: {
//           total: totalUsers,
//           page,
//           limit,
//           totalPages,
//           hasNextPage: page < totalPages,
//           hasPrevPage: page > 1,
//         },
//       });
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       return res.status(500).json({ error: "Could not fetch users" });
//     }
//   }

//   async getUserById(req: Request, res: Response) {
//     try {
//       const user = await prisma.user.findUnique({
//         where: { id: req.params.id },
//         select: {
//           id: true,
//           email: true,
//           name: true,
//           roles: true,
//           referralCode: true,
//           isVerify: true,
//           isPendingVerification: true,
//           createdAt: true,
//           updatedAt: true,
//           referredBy: true,
//           referrals: true,
//           poin: true,
//           vouchers: true,
//           cartItems: true,
//           orders: true,
//         },
//       });
//       if (!user) return res.status(404).json({ error: "User not found" });
//       return res.status(200).json({ status: "success", data: user });
//     } catch (error) {
//       return res.status(500).json({ error: "Could not fetch user" });
//     }
//   }

//   async updateUserRole(req: Request, res: Response) {
//     try {
//       const { roles } = req.body;
//       const user = await prisma.user.update({
//         where: { id: req.params.id },
//         data: { roles },
//       });
//       return res.status(200).json({ status: "success", data: user });
//     } catch (error) {
//       return res.status(500).json({ error: "Could not update user role" });
//     }
//   }

//   async deleteUser(req: Request, res: Response) {
//     try {
//       await prisma.user.delete({
//         where: { id: req.params.id },
//       });
//       return res
//         .status(200)
//         .json({ status: "success", message: "User deleted successfully" });
//     } catch (error) {
//       return res.status(500).json({ error: "Could not delete user" });
//     }
//   }
// }
