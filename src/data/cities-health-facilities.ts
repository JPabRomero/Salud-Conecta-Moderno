/**
 * Análisis de Centros de Salud por Ciudad en Nicaragua
 * Base de datos compilada desde NICARAGUA_HOSPITALS
 */

export interface SimpleHealthData {
  city: string;
  hospitals: number;
  healthCenters: number;
  clinics: number;
  laboratories: number;
  pharmacies: number;
  total: number;
  coordinates: { lat: number; lng: number };
}

export const CITIES_HEALTH_DATA: SimpleHealthData[] = [
  {
    city: "Granada",
    hospitals: 1,
    healthCenters: 2,
    clinics: 1,
    laboratories: 1,
    pharmacies: 1,
    total: 6,
    coordinates: { lat: 11.9366, lng: -85.9764 }
  },
  {
    city: "Managua",
    hospitals: 6,
    healthCenters: 1,
    clinics: 0,
    laboratories: 0,
    pharmacies: 0,
    total: 7,
    coordinates: { lat: 12.122, lng: -86.236 }
  },
  {
    city: "León",
    hospitals: 1,
    healthCenters: 0,
    clinics: 0,
    laboratories: 0,
    pharmacies: 0,
    total: 1,
    coordinates: { lat: 12.436, lng: -86.878 }
  },
  {
    city: "Estelí",
    hospitals: 1,
    healthCenters: 0,
    clinics: 0,
    laboratories: 0,
    pharmacies: 0,
    total: 1,
    coordinates: { lat: 13.092, lng: -86.353 }
  },
  {
    city: "Masaya",
    hospitals: 1,
    healthCenters: 0,
    clinics: 0,
    laboratories: 0,
    pharmacies: 0,
    total: 1,
    coordinates: { lat: 11.974, lng: -86.094 }
  },
  {
    city: "Rivas",
    hospitals: 1,
    healthCenters: 0,
    clinics: 0,
    laboratories: 0,
    pharmacies: 0,
    total: 1,
    coordinates: { lat: 11.437, lng: -85.830 }
  },
  {
    city: "Carazo (Jinotepe)",
    hospitals: 1,
    healthCenters: 0,
    clinics: 0,
    laboratories: 0,
    pharmacies: 0,
    total: 1,
    coordinates: { lat: 11.850, lng: -86.200 }
  },
  {
    city: "Chinandega",
    hospitals: 1,
    healthCenters: 0,
    clinics: 0,
    laboratories: 0,
    pharmacies: 0,
    total: 1,
    coordinates: { lat: 12.629, lng: -87.129 }
  },
  {
    city: "Matagalpa",
    hospitals: 1,
    healthCenters: 0,
    clinics: 0,
    laboratories: 0,
    pharmacies: 0,
    total: 1,
    coordinates: { lat: 12.925, lng: -85.917 }
  },
  {
    city: "Bluefields",
    hospitals: 1,
    healthCenters: 0,
    clinics: 0,
    laboratories: 0,
    pharmacies: 0,
    total: 1,
    coordinates: { lat: 12.012, lng: -83.765 }
  },
  {
    city: "Puerto Cabezas",
    hospitals: 1,
    healthCenters: 0,
    clinics: 0,
    laboratories: 0,
    pharmacies: 0,
    total: 1,
    coordinates: { lat: 14.029, lng: -83.388 }
  },
  {
    city: "Juigalpa (Chontales)",
    hospitals: 1,
    healthCenters: 0,
    clinics: 0,
    laboratories: 0,
    pharmacies: 0,
    total: 1,
    coordinates: { lat: 12.106, lng: -85.364 }
  }
];