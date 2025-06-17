import axios from "@/lib/axios"; // gunakan axios yang sudah di-custom

export const searchDestination = async (keyword: string) => {
  const response = await axios.get("/rajaongkir/search", {
    params: { keyword },
  });
  return response.data;
};

