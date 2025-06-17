import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export class RajaOngkirController {
  async searchDestination(req: Request, res: Response): Promise<void> {
    try {
      const { keyword } = req.query;

      if (!keyword || typeof keyword !== "string") {
         res.status(400).json({ error: "Query 'keyword' is required and must be a string" });
      }

      const apiKey = process.env.API_KEY_RAJA_ONGKIR;
      if (!apiKey) {
         res.status(500).json({ error: "Missing KOMERCE_API_KEY in environment" });
      }

      const response = await axios.get(
        "https://api-sandbox.collaborator.komerce.id/tariff/api/v1/destination/search",
        {
          headers: {
            "x-api-key": apiKey,
          },
          params: { keyword },
        }
      );

      res.status(200).json(response.data);
    } catch (err: any) {
      console.error("Komerce Search Error:", err?.response?.data || err.message);

      if (!res.headersSent) {
        res.status(500).json({
          error: "Failed to fetch destination data from Komerce API",
          details: err?.response?.data?.message || err.message || "Unknown error",
        });
      }
    }
  }
}
