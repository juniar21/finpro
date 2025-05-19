import { Request, Response } from "express";
import prisma from "../prisma";
import { Prisma } from "../../prisma/generated/client";
// import { redis } from "../helpers/redis";

export class UserController {
  async getUser(req: Request, res: Response) {
    try {
      const { search } = req.query;
      const filter: Prisma.UserWhereInput = {};

      if (search) {
        filter.username = { contains: search as string };
      }

      const users = await prisma.user.findMany({
        where: filter,
        orderBy: { id: "asc" },
        // take: 2,
        // skip: 2,
      });

      const stats = await prisma.user.aggregate({
        _count: { _all: true },
        _max: { createdAt: true },
        _min: { createdAt: true },
      });

      res.status(200).send({
        message: "User data",
        users,
        stats,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getUserId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({ where: { id: +id } });

      if (!user) throw { message: "User not found" };

      res.status(200).send({
        message: "User detail",
        user,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const data: Prisma.UserUpdateInput = req.body;
      await prisma.user.update({ where: { id: req.user?.id }, data });

      res.status(200).send({
        message: "User updated ✅",
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.user.delete({ where: { id: +id } });

      res.status(200).send({
        message: "User deleted ✅",
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getUserPost(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user?.id },
      });

      res.status(200).send({ user });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}