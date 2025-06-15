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
