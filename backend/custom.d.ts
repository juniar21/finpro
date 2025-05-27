import "express";

export type UserPayload = {
  id: number;
  role: "admin" | "user";
};

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }

  declare namespace Express {
    interface Request {
      user?: import("../../custom").UserPayload;
    }
  }
}
