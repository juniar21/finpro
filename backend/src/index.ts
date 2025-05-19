import express, { Application, Request, Response } from "express";
import path from "path";
import cors from "cors";

const PORT = 8000;

const app: Application = express();
// app.use(express.json());
// app.use(
//   cors({
//     origin: process.env.URL_FE,
//   })
// );

app.use(express.json());
app.use(cors()); //harus ada

app.get("/", (req: Request, res: Response) => {
  res.status(200).send({
    status: "success",
    message: "Welcome to my API",
  });
});

app.use("/api/public", express.static(path.join(__dirname, "../public")));


app.listen(PORT, () => {
  console.log(`Server Running On http://localhost:${PORT}`);
});