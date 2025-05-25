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
    let errorMessage = null; // Variable to hold any error message
    let statusCode = 200; // Default success status code

    try {
      const { email, password, name, role, referralCode } = req.body;

      // Check if the email already exists in the database
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        errorMessage = "Email already registered";
        statusCode = 400;
      } else {
        // Hash the password
        const salt = await genSalt(10);
        const hashedPass = await hash(password, salt);

        // Generate a unique referral code for the new user
        const newReferralCode = Math.random().toString(36).substring(2, 10);

        // Create the new user
        const user = await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPass,
            referralCode: newReferralCode,
            roles: role || "CUSTOMER", // Default to "CUSTOMER" if no role is specified
          },
        });

        const payload = { id: user.id, role: user.roles };
        const token = sign(payload, process.env.KEY_JWT!, { expiresIn: "10m" });

        const link = `${process.env.URL_FE}/verify/${token}`;

        // Check if the user provided a valid referral code
        if (referralCode) {
          // Find the referrer user (User A)
          const referrer = await prisma.user.findUnique({
            where: { referralCode },
          });

          // If referrer exists, give points to the referrer and voucher to the new user
          if (referrer) {
            // Add points to the referrer (User A)
            await prisma.poin.create({
              data: {
                userId: referrer.id,
                amount: 10, // Assign 10 points for the referral
                expiredAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Set points expiry (1 year)
              },
            });

            // Create a voucher for the new user (User B)
            await prisma.voucher.create({
              data: {
                userId: user.id,
                code: Math.random().toString(36).substring(2, 10), // Generate a random voucher code
                percentage: 10, // 10% discount
                maxDiscount: 50000, // Maximum discount of 50,000 units
                expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Voucher valid for 30 days
                used: false,
              },
            });
          }
        }

        // Determine the email template based on the user's role
        let templateName = "";
        if (user.roles === "ADMIN") {
          templateName = "verifyAdmin.hbs";
        } else if (user.roles === "SUPER_ADMIN") {
          templateName = "verifySuperAdmin.hbs";
        } else {
          templateName = "verify.hbs"; // Default to customer template
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

        // If everything was successful, update the status code and message
        res.status(201).send({ message: "User created ✅" });
      }
    } catch (err) {
      console.error(err);
      errorMessage = "Registration failed";
      statusCode = 400;
    }

    // If any error occurred, send the error message
    if (errorMessage) {
      res.status(statusCode).send({ message: errorMessage });
    }
  }

  // Login method
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
              referralCode: user.referralCode, 
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

  // Verification method
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
