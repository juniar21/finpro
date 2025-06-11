// import { Request, Response } from "express";
// import axios from "axios";

// const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY!;
// const BASE_URL = "https://api.rajaongkir.com/starter";

// export class RajaOngkirController {
//  getProvinces = async (req: Request, res: Response) => {
//   try {
//     console.log("RAJAONGKIR_API_KEY:", RAJAONGKIR_API_KEY); // Pastikan key terisi

//     const response = await axios.get(`${BASE_URL}/province`, {
//       headers: { key: RAJAONGKIR_API_KEY },
//     });

//     console.log("RAJAONGKIR API response:", response.data); // Debug respons dari RajaOngkir

//     res.status(200).json(response.data.rajaongkir.results);
//   } catch (error: any) {
//     console.error("Error fetching provinces:", error.response?.data || error.message);
//     res.status(500).json({ error: "Failed to fetch provinces" });
//   }
// };



//   getCities = async (req: Request, res: Response) => {
//     try {
//       const { provinceId } = req.query;
//       const url = provinceId
//         ? `${BASE_URL}/city?province=${provinceId}`
//         : `${BASE_URL}/city`;

//       const response = await axios.get(url, {
//         headers: { key: RAJAONGKIR_API_KEY },
//       });

//       res.status(200).json(response.data.rajaongkir.results);
//     } catch (error: any) {
//       console.error("Error fetching cities:", error.message);
//       res.status(500).json({ error: "Failed to fetch cities" });
//     }
//   };

//   calculateShippingCost = async (req: Request, res: Response) => {
//     try {
//       const { origin, destination, weight, courier } = req.body;

//       if (!origin || !destination || !weight || !courier) {
//          res.status(400).json({
//           error: "Missing required fields: origin, destination, weight, courier",
//         });
//       }

//       const response = await axios.post(
//         `${BASE_URL}/cost`,
//         new URLSearchParams({
//           origin,
//           destination,
//           weight: weight.toString(),
//           courier,
//         }),
//         {
//           headers: {
//             key: RAJAONGKIR_API_KEY,
//             "content-type": "application/x-www-form-urlencoded",
//           },
//         }
//       );

//       res.status(200).json(response.data.rajaongkir.results);
//     } catch (error: any) {
//       console.error("Error calculating shipping cost:", error.message);
//       res.status(500).json({ error: "Failed to calculate shipping cost" });
//     }
//   };
// }
