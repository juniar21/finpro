<<<<<<< HEAD
// rajaongkir.ts
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://api-sandbox.collaborator.komerce.id/tariff/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.NEXT_PUBLIC_KOMERCE_API_KEY || '',
  },
})

export default axiosInstance
=======
import axios from "@/lib/axios"; // gunakan axios yang sudah di-custom

export const searchDestination = async (keyword: string) => {
  const response = await axios.get("/rajaongkir/search", {
    params: { keyword },
  });
  return response.data;
};

>>>>>>> fa20f4c2691533af8a820bcfad758d2b286bb62b
