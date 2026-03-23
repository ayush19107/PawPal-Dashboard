import React, { useEffect, useRef } from "react";
import { LocationData } from "../types";

interface MapViewProps {
  location: LocationData;
  petName: string;
}

const MapView: React.FC<MapViewProps> = ({ location, petName }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const map = useRef<google.maps.Map | null>(null);
  const marker = useRef<google.maps.Marker | null>(null);

  /* ================= INIT MAP ================= */
  useEffect(() => {
    if (!mapRef.current) return;

    const lat = Number(location.lat);
    const lng = Number(location.lng);

    if (!lat || !lng) return;

    const initMap = () => {
      map.current = new google.maps.Map(mapRef.current as HTMLElement, {
        center: { lat, lng },
        zoom: 17,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      marker.current = new google.maps.Marker({
        position: { lat, lng },
        map: map.current,
        title: petName,
        animation: google.maps.Animation.DROP,
      });
    };

    if ((window as any).google?.maps) {
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);
  }, []);

  /* ================= UPDATE LOCATION LIVE ================= */
  useEffect(() => {
    if (!map.current || !marker.current) return;

    const lat = Number(location.lat);
    const lng = Number(location.lng);

    if (isNaN(lat) || isNaN(lng)) return;

    const newPosition = new google.maps.LatLng(lat, lng);

    // 🔥 THIS IS THE KEY PART
    marker.current.setPosition(newPosition);
    map.current.setCenter(newPosition);
  }, [location.lat, location.lng]);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          Live GPS Location
        </h2>
        <div className="flex gap-2">
          <span className="bg-white px-4 py-2 rounded-xl shadow-sm border text-sm">
            Lat: {Number(location.lat).toFixed(5)}
          </span>
          <span className="bg-white px-4 py-2 rounded-xl shadow-sm border text-sm">
            Lng: {Number(location.lng).toFixed(5)}
          </span>
        </div>
      </div>

      <div className="flex-1 rounded-3xl overflow-hidden shadow-inner border-4 border-white relative">
        <div ref={mapRef} className="absolute inset-0" />

        <div className="absolute bottom-6 right-6 bg-white p-4 rounded-2xl shadow-lg min-w-[220px]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-slate-500">
              ACTIVE TRACKER
            </span>
          </div>
          <p className="text-sm font-bold text-slate-800">
            Moving at {location.speed} km/h
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            Last Update:{" "}
            {location.timestamp
              ? new Date(location.timestamp).toLocaleTimeString()
              : "--"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapView;
