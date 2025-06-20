"use client";

import Navbar from "@/components/navbar/navbar/Navbar";
import Sidebar from "@/components/navbar/navbar/Sidebar";
import Footer from "@/components/navbar/navbar/footer";
import { useSession } from "next-auth/react";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "@/lib/axios";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Define Option type for select options
interface Option {
  label: string;
  value: string | number;
}

// Fix Leaflet marker icon issue with webpack/CRA
const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface AddressFormData {
  address_name: string;
  address: string;
  subdistrict: string;
  city: string;
  city_id?: string;
  province: string;
  province_id?: string;
  postcode: string;
  latitude?: number;
  longitude?: number;
  is_primary: boolean;
}

// Komponen untuk menggerakkan peta ke koordinat baru
function MapWrapper({
  latitude,
  longitude,
}: {
  latitude?: number;
  longitude?: number;
}) {
  const map = useMap();

  if (latitude !== undefined && longitude !== undefined) {
    map.setView([latitude, longitude], 13, { animate: true });
  }

  return null;
}

// Komponen marker lokasi dengan event klik
function LocationMarker({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
}: {
  latitude?: number;
  longitude?: number;
  setLatitude: (lat: number) => void;
  setLongitude: (lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      setLatitude(e.latlng.lat);
      setLongitude(e.latlng.lng);
    },
  });

  if (latitude === undefined || longitude === undefined) return null;

  return (
    <Marker position={[latitude, longitude]} icon={markerIcon}>
      <Popup>
        Lokasi terpilih: <br />
        Lat: {latitude.toFixed(5)}, Lng: {longitude.toFixed(5)}
      </Popup>
    </Marker>
  );
}

export default function CreateAddressPage() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const [formData, setFormData] = useState<AddressFormData>({
    address_name: "",
    address: "",
    province: "",
    city: "",
    subdistrict: "",
    postcode: "",
    latitude: undefined,
    longitude: undefined,
    is_primary: false,
  });

  const [provinces, setProvinces] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);
  const [subdistricts, setSubdistricts] = useState<Option[]>([]);

  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  if (loading) return <div>Loading session...</div>;
  if (!session) return <div>Anda harus login terlebih dahulu.</div>;

  const user = session.user as { id?: string };
  const userId = user?.id || "";
  const token = (session as any).accessToken;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    if (name === "latitude" || name === "longitude") {
      const val = value.trim() === "" ? undefined : parseFloat(value);
      setFormData((prev) => ({
        ...prev,
        [name]: val,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Geolocation tidak didukung oleh browser Anda.");
      return;
    }

    setIsLocating(true);
    setMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
        setMessage("Lokasi berhasil diambil.");
        setIsLocating(false);
      },
      (error) => {
        setMessage(`Gagal mengambil lokasi: ${error.message}`);
        setIsLocating(false);
      }
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !formData.address_name ||
      !formData.address ||
      !formData.subdistrict ||
      !formData.city ||
      !formData.province ||
      !formData.postcode
    ) {
      setMessage("Harap isi semua field wajib.");
      return;
    }

    if (!token) {
      setMessage("Token tidak ditemukan, silakan login ulang.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const payload = {
        ...formData,
        id: userId,
      };

      const res = await axios.post("/address", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 201 || res.status === 200) {
        setMessage("Alamat berhasil dibuat ✅");
        setFormData({
          address_name: "",
          address: "",
          province: "",
          city: "",
          subdistrict: "",
          postcode: "",
          latitude: undefined,
          longitude: undefined,
          is_primary: false,
        });
        setCities([]);
        setSubdistricts([]);
      } else {
        setMessage("Gagal membuat alamat.");
      }
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || "Terjadi kesalahan saat membuat alamat."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex h-screen w-full">
        <div className="w-64 bg-gray-100 hidden md:block">
          <Sidebar />
        </div>

        <main className="flex-1 overflow-auto p-8">
          <h1 className="text-3xl font-bold mb-6">Buat Alamat Baru</h1>

          <div className="max-w-xl bg-white p-6 rounded shadow mx-auto">
            {message && (
              <p
                className={`mb-4 text-center px-4 py-2 rounded ${
                  message.includes("berhasil")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label
                  htmlFor="address_name"
                  className="block mb-1 font-semibold"
                >
                  Nama Lengkap
                </label>
                <input
                  id="address_name"
                  name="address_name"
                  value={formData.address_name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                  placeholder="Contoh: Yanto, Yanti"
                />
              </div>

              <div>
                <label htmlFor="address" className="block mb-1 font-semibold">
                  Alamat
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                  placeholder="Detail alamat lengkap"
                />
              </div>

              <div>
                <label
                  htmlFor="subdistrict"
                  className="block mb-1 font-semibold"
                >
                  Kecamatan
                </label>
                <input
                  id="subdistrict"
                  name="subdistrict"
                  value={formData.subdistrict}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                  placeholder="Nama Kecamatan"
                />
              </div>

              <div>
                <label htmlFor="city" className="block mb-1 font-semibold">
                  Kota/Kabupaten
                </label>
                <input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                  placeholder="Nama Kota atau Kabupaten"
                />
              </div>

              <div>
                <label htmlFor="province" className="block mb-1 font-semibold">
                  Provinsi
                </label>
                <input
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                  placeholder="Nama Provinsi"
                />
              </div>

              <div>
                <label htmlFor="postcode" className="block mb-1 font-semibold">
                  Kode Pos
                </label>
                <input
                  id="postcode"
                  name="postcode"
                  type="text"
                  value={formData.postcode}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                  placeholder="Kode Pos"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">
                  Pilih Lokasi di Peta
                </label>
                <div className="h-64 w-full mb-4 rounded border">
                  <MapContainer
                    center={[
                      formData.latitude ?? -2.5489,
                      formData.longitude ?? 118.0149,
                    ]}
                    zoom={formData.latitude && formData.longitude ? 13 : 5}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker
                      latitude={formData.latitude}
                      longitude={formData.longitude}
                      setLatitude={(lat) =>
                        setFormData((prev) => ({ ...prev, latitude: lat }))
                      }
                      setLongitude={(lng) =>
                        setFormData((prev) => ({ ...prev, longitude: lng }))
                      }
                    />
                    <MapWrapper
                      latitude={formData.latitude}
                      longitude={formData.longitude}
                    />
                  </MapContainer>
                </div>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLocating ? "Mengambil Lokasi..." : "Gunakan Lokasi Saat Ini"}
                </button>
              </div>

              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="is_primary"
                    checked={formData.is_primary}
                    onChange={handleChange}
                    className="form-checkbox"
                  />
                  <span className="ml-2">Set sebagai alamat utama</span>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Alamat"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
