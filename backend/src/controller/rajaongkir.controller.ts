// src/controllers/rajaongkir.controller.ts
import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // pastikan dotenv dipanggil

export class RajaOngkirController {
  async searchDestination(req: Request, res: Response): Promise<void> {
    try {
      const { keyword } = req.query;

      const response = await axios.get(
        "https://api-sandbox.collaborator.komerce.id/tariff/api/v1/destination/search",
        {
          headers: {
            "x-api-key": process.env.KOMERCE_API_KEY || "", // ambil dari .env
          },
          params: { keyword },
        }
      );

      res.status(200).json(response.data);
    } catch (err: any) {
      console.error("Komerce Search Error:", err.response?.data || err.message);
      if (!res.headersSent)
        res.status(500).json({
          error: err.response?.data || err.message || "Failed to fetch destination data",
        });
    }
  }

}
