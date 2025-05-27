import express, { Application, Request, Response } from "express";
import { UserRouter } from "./routers/user.router";
// import { PostRouter } from "./routers/post.router";
import cors from "cors";
import { AuthRouter } from "./routers/auth.router";
import path from "path";
import { RewardRouter } from "./routers/reward.router";
// import { StoreAdminRouter } from "./routers/store-admin.routers";
//import cron from "node-cron";
// import { OrderRouter } from "./routers/order.router";

const PORT: number = 8000;

const app: Application = express();
app.use(express.json());
app.use(cors());

app.get("/api", (req: Request, res: Response) => {
  res.status(200).send({ message: "Welcome to my API" });
});

app.use("/api/public", express.static(path.join(__dirname, "../public")));

const userRouter = new UserRouter();
app.use("/api/users", userRouter.getRouter());

const authRouter = new AuthRouter();
app.use("/api/auth", authRouter.getRouter());

const rewardRouter = new RewardRouter();
app.use("/api/rewards", rewardRouter.getRouter());

// const storeAdminRouter = new StoreAdminRouter();
// app.use("/store-admin", storeAdminRouter.getRouter());


// scheduler
// cron.schedule("0 7 * * 6,0", () => {
//   console.log("Hello World");
// });

app.listen(PORT, () => {
  console.log(`Server running on : http://localhost:${PORT}/api`);
});
