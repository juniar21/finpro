"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Link from "next/link"; // Import Link from next.js
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"; // Importing map components

const containerStyle = {
  width: '100%',
  height: '400px'
};

type Store = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

export default function NearestStorePage() {
  const { data: session, status } = useSession();
  const loadingSession = status === "loading";

  const [stores, setStores] = useState<Store[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          setError("Failed to get location");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.accessToken || !userLocation) return;

    const fetchStores = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/store/", {
          params: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        setStores(res.data.stores ?? res.data);
      } catch (err) {
        setError("Failed to load nearest stores");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [session, userLocation]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      return stores; // Return all stores if no search query
    }
    return stores.filter((store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (loadingSession) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Loading session...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>You need to log in first.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Loading nearest stores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const filteredStores = handleSearch();

  return (
    <main className="flex-1 p-8 overflow-auto max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Nearest Stores</h1>

      {/* Map Section */}
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{
            lat: userLocation?.latitude || 0,
            lng: userLocation?.longitude || 0,
          }}
          zoom={12}
        >
          {filteredStores.map((store) => (
            <Marker
              key={store.id}
              position={{
                lat: store.latitude,
                lng: store.longitude,
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>

      {/* Search Section */}
      <div className="my-6">
        <input
          type="text"
          placeholder="Search stores by name or address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Store Listings */}
      {filteredStores.length === 0 ? (
        <p>No stores available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredStores.map((store) => (
            <div
              key={store.id}
              className="flex flex-col p-6 bg-white shadow-xl rounded-lg border-2 hover:scale-105 transition-transform"
            >
              <div className="flex flex-col justify-between space-y-2">
                <h2 className="text-xl font-semibold">{store.name}</h2>
                <p className="text-gray-500 text-sm">{store.address}</p>
              </div>

              <a
                href={`https://maps.google.com/?q=${store.latitude},${store.longitude}`}
                target="_blank"
                className="mt-4 px-4 py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
              >
                View on Map
              </a>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
