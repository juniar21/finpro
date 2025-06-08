import axios from "axios";

const rajaOngkir = axios.create({
  baseURL: "https://api-sandbox.collaborator.komerce.id/tariff/api/v1/destination/",  // URL dari RajaOngkir API
  headers: {
    "x-api-key": process.env.RAJAONGKIR_API_KEY,  // Pastikan Anda mengganti dengan API Key yang valid
    "Accept": "application/json",
  },
});

export default rajaOngkir;
