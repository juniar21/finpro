import { Request, Response } from "express";
import prisma from "../prisma";
import { compare, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { transporter } from "../helpers/mailer";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, name, role } = req.body;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        res.status(400).send({ message: "Email already registered" });
      } else {
        const salt = await genSalt(10);
        const hashedPass = await hash(password, salt);

        const referralCode = Math.random().toString(36).substring(2, 10);

        const user = await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPass,
            referralCode,
            roles: role || "CUSTOMER", // Default to "CUSTOMER" if no role is specified
          },
        });

        const payload = { id: user.id, role: user.roles };
        const token = sign(payload, process.env.KEY_JWT!, { expiresIn: "10m" });

        const link = `${process.env.URL_FE}/verify/${token}`;

        // Determine the template based on the user's role
        let templateName = "";
        if (user.roles === "ADMIN") {
          templateName = "verifyAdmin.hbs";
        } else if (user.roles === "SUPER_ADMIN") {
          templateName = "verifySuperAdmin.hbs";
        } else {
          templateName = "verifyCustomer.hbs"; // Default to customer template
        }

        const templatePath = path.join(__dirname, "../templates", templateName);
        const templateSource = fs.readFileSync(templatePath, "utf-8");
        const compiledTemplate = handlebars.compile(templateSource);
        const html = compiledTemplate({ name, link });

        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: email,
          subject: "Verification Email",
          html,
        });

        res.status(201).send({ message: "User created ✅" });
      }
    } catch (err) {
      console.error(err);
      res.status(400).send({ message: "Registration failed", error: err });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        res.status(404).send({ message: "User not found" });
      } else if (!user.isVerify) {
        res.status(401).send({ message: "Account not verified" });
      } else {
        const isValidPass = await compare(password, user.password);

        if (!isValidPass) {
          res.status(401).send({ message: "Incorrect password" });
        } else {
          const payload = { id: user.id, role: user.roles };
          const access_token = sign(payload, process.env.KEY_JWT!, {
            expiresIn: "1h",
          });

          res.status(200).send({
            message: "Login successfully!",
            data: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.roles,
            },
            access_token,
          });
        }
      }
    } catch (err) {
      console.error(err);
      res.status(400).send({ message: "Login failed", error: err });
    }
  }

  async verify(req: Request, res: Response) {
    try {
      await prisma.user.update({
        data: { isVerify: true },
        where: { id: req.user?.id?.toString() },
      });

      res.status(200).send({ message: "Verification success!" });
    } catch (err) {
      console.error(err);
      res.status(400).send({ message: "Verification failed", error: err });
    }
  }
}
