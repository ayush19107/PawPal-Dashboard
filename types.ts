
export interface VitalsData {
  heartRate: number;
  temperature: number;
  lastUpdated: string;
}

export interface ActivityData {
  x: number;
  y: number;
  z: number;
  state: 'Sleeping' | 'Active' | 'Running' | 'Resting';
}

export interface LocationData {
  lat: number;
  lng: number;
  speed: number;
  timestamp: string;
}

export interface PetProfile {
  id: string;
  name: string;
  species: 'Dog' | 'Cat' | 'Other';
  breed: string;
  age: number;
  weight: number;
  avatar: string;
  healthNotes: string;
}

export interface Alert {
  id: string;
  type: 'danger' | 'warning' | 'info';
  message: string;
  timestamp: string;
  read: boolean;
  petId: string;
}

export interface PetState {
  vitals: VitalsData;
  activity: ActivityData;
  location: LocationData;
  alerts: Alert[];
}
