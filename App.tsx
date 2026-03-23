import React, { useEffect, useState, useMemo } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "./services/firebase";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardView from "./components/DashboardView";
import MapView from "./components/MapView";
import ProfileView from "./components/ProfileView";

import { PetProfile, PetState } from "./types";

/* ================= STATIC PET PROFILES ================= */
const INITIAL_PROFILES: PetProfile[] = [
  {
    id: "p1",
    name: "Luna",
    species: "Cat",
    breed: "Siamese",
    age: 2,
    weight: 4.5,
    avatar: "https://picsum.photos/seed/luna/200",
    healthNotes: "Indoor cat",
  },
  {
    id: "p2",
    name: "PawPal",
    species: "Dog",
    breed: "Golden Retriever",
    age: 3,
    weight: 15,
    avatar: "https://picsum.photos/seed/pawpal/200",
    healthNotes: "Active dog",
  },
];

export default function App() {
  const [activeTab, setActiveTab] =
    useState<"dashboard" | "map" | "profile" | "alerts">("dashboard");

  const [profiles] = useState(INITIAL_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState("p1");

  /* ================= PET STATE ================= */
  const [petsState, setPetsState] = useState<Record<string, PetState>>(() => {
    const init: Record<string, PetState> = {};
    INITIAL_PROFILES.forEach((p) => {
      init[p.id] = {
        vitals: { heartRate: 0, temperature: 0, lastUpdated: "--" },
        activity: { x: 0, y: 0, z: 0, state: "Resting" },
        location: { lat: 18.519, lng: 73.815187, speed: 0, timestamp: "" },
        alerts: [],
      };
    });
    return init;
  });

  /* ================= ACTIVE PET ================= */
  const activeProfile = useMemo(
    () => profiles.find((p) => p.id === activeProfileId)!,
    [profiles, activeProfileId]
  );

  const activePetState = petsState[activeProfileId];

  /* ================= FIREBASE REAL-TIME LISTENER ================= */
  useEffect(() => {
    const petRef = ref(database, `pets/${activeProfileId}/liveData`);

    const unsubscribe = onValue(petRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const data = snapshot.val();
      console.log("🔥 ESP32 Live Update:", data);

      // ===== SAFE GPS HANDLING =====
      const rawLat = Number(data.latitude);
      const rawLng = Number(data.longitude);

      const safeLat =
        !rawLat || rawLat === 0 ? 18.519 : rawLat;

      const safeLng =
        !rawLng || rawLng === 0 ? 73.815187 : rawLng;

      setPetsState((prev) => ({
        ...prev,
        [activeProfileId]: {
          ...prev[activeProfileId],

          vitals: {
            heartRate: Number(data.heartRate ?? 0),
            temperature: Number(data.temperature ?? 0),
            lastUpdated: data.timestamp
              ? new Date(data.timestamp).toLocaleTimeString()
              : "--",
          },

          activity: {
            ...prev[activeProfileId].activity,
            state:
              data.heartRate > 120
                ? "Running"
                : data.heartRate > 80
                ? "Active"
                : "Resting",
          },

          location: {
            lat: safeLat,
            lng: safeLng,
            speed: 0,
            timestamp: new Date().toISOString(),
          },
        },
      }));
    });

    return () => unsubscribe();
  }, [activeProfileId]);

  /* ================= RENDER ================= */
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab: any) => setActiveTab(tab)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeProfile={activeProfile}
          profiles={profiles}
          onSwitchProfile={setActiveProfileId}
          alertsCount={0}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === "dashboard" && (
            <DashboardView
              vitals={activePetState.vitals}
              activity={activePetState.activity}
              location={activePetState.location}
              petProfile={activeProfile}
            />
          )}

          {activeTab === "map" && (
            <MapView
              location={activePetState.location}
              petName={activeProfile.name}
            />
          )}

          {activeTab === "profile" && (
            <ProfileView
              profiles={profiles}
              activeProfileId={activeProfileId}
              onAddPet={() => {}}
              onUpdatePet={() => {}}
              onDeletePet={() => {}}
              onSwitchPet={setActiveProfileId}
            />
          )}
        </main>
      </div>
    </div>
  );
}
