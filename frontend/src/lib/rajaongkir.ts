<<<<<<< HEAD
import axios from "@/lib/axios"; // gunakan axios yang sudah di-custom
=======
// src/lib/rajaongkir.ts
import axios from "@/lib/axios";
>>>>>>> f4e6b7289c596a9eb7f5612ccac6573a9574f437

export const searchDestination = async (keyword: string) => {
  const response = await axios.get("/rajaongkir/search", {
    params: { keyword },
  });
  return response.data;
};

<<<<<<< HEAD
=======
export const calculateShippingCost = async ({
  shipper_destination_id,
  receiver_destination_id,
  weight,
  item_value,
  cod = false,
}: {
  shipper_destination_id: string;
  receiver_destination_id: string;
  weight: number;
  item_value: number;
  cod?: boolean;
}) => {
  const response = await axios.get("/rajaongkir/cost", {
    params: {
      shipper_destination_id,
      receiver_destination_id,
      weight,
      item_value,
      cod: cod ? "yes" : "no",
    },
  });
  return response.data.data; // return object berisi calculate_reguler, calculate_cargo, etc.
};
>>>>>>> f4e6b7289c596a9eb7f5612ccac6573a9574f437
