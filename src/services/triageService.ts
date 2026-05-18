import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { TriageRecord, OperationType, FirestoreErrorInfo, Clinic } from '../types';
import { getClinics } from './clinicService'; // Importar getClinics para obtener los centros verificados
import { getCurrentLocation, getNearestFacility, getEmergencyFacilities, estimateTravelTime, calculateDistance } from '../lib/geolocationService';
import { NICARAGUA_HOSPITALS } from '../data/nicaraguaHospitals';
import { PUBLIC_HEALTH_NETWORK } from '../data/nicaraguaPublicHealthNetwork';

const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
};

export const saveTriageRecord = async (record: Omit<TriageRecord, 'id' | 'createdAt'>) => {
  const path = 'triages';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...record,
      createdAt: new Date().toISOString(),
      serverTimestamp,
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const syncClinicToFirestore = async (clinic: Clinic) => {
  const path = 'verified_clinics';
  try {
    // Usamos el ID (google-xxx) como ID del documento para evitar duplicados y actuar como caché
    const docRef = doc(db, path, clinic.id);
    await setDoc(docRef, {
      ...clinic,
      updatedAt: new Date().toISOString(),
      serverTimestamp,
    }, { merge: true });
  } catch (error) {
    console.error('Error syncing clinic to cache:', error);
  }
};

export const getUserTriages = async (userId: string): Promise<TriageRecord[]> => {
  const path = 'triages';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TriageRecord));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
};

export interface TriageWithLocationResult {
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  reasoning: string;
  medication?: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  };
  locationInfo?: {
    nearestFacility: string;
    distanceKm: number;
    travelTime: string;
    isEmergency: boolean;
    clinic?: Clinic; // Triage result carries the full clinic object for routing
  };
  error?: boolean;
}
 
export async function getEnhancedTriageWithLocation(symptoms: string, membership: 'free' | 'premium' = 'free'): Promise<TriageWithLocationResult> {
  try {
    // Coordenadas por defecto (Managua Centro) alineadas con el mapa
    let userLat = 12.1328;
    let userLng = -86.2504;

    // Obtener la red completa de clínicas verificadas desde Firestore
    const fullNetwork = await getClinics();

    const userLocation = await getCurrentLocation();
    if (userLocation) {
      userLat = userLocation.latitude;
      userLng = userLocation.longitude;
    }

    // Filtrar la red de clínicas de acuerdo a la membresía del usuario
    // Free: Solo red pública (MINSA)
    // Premium: Red pública + clínicas privadas premium registradas
    const allowedFacilities = membership === 'free'
      ? fullNetwork.filter(c => c.sector === 'public')
      : fullNetwork;

    let nearestFacility = null;
    let distanceKm = Infinity;

    if (allowedFacilities.length > 0) {
      const result = getNearestFacility(allowedFacilities, userLat, userLng, membership === 'free');
      nearestFacility = result.facility;
      distanceKm = result.distanceKm;
    }

    let isEmergency = false;
    let nearestEmergency = null;

    // Detectar si el caso requiere urgencia crítica y obtener el hospital de emergencia más cercano
    const emergencyHospitals = getEmergencyFacilities(allowedFacilities);
    if (emergencyHospitals?.length > 0) {
      for (const hospital of emergencyHospitals) {
        if (hospital.location) {
          const dist = calculateDistance(userLat, userLng, hospital.location.lat, hospital.location.lng);
          if (dist < 15 && dist < distanceKm) {
            distanceKm = dist;
            nearestEmergency = hospital;
            isEmergency = true;
          }
        }
      }
    }

    const recommendedClinic = isEmergency && nearestEmergency ? nearestEmergency : nearestFacility;
    const finalDistance = distanceKm === Infinity ? 0 : distanceKm;

    if (recommendedClinic) {
      const isPriv = recommendedClinic.sector === 'private';
      const sectorTag = isPriv ? 'Centro Privado Premium' : 'Red Pública (MINSA)';
      
      return {
        severity: isEmergency ? 'critical' : 'high',
        recommendation: `Estas experimentando un síntoma de urgencia debes acudir a un centro de salud de inmediato, de acuerdo a tu ubicación el centro mas cercano es: "${recommendedClinic.name}" (${sectorTag}).`,
        reasoning: `Caso de urgencia analizado para suscripción ${membership.toUpperCase()}. Centros elegibles: ${allowedFacilities.length}. Centro recomendado: ${recommendedClinic.name} a ${finalDistance.toFixed(1)} km.`,
        locationInfo: {
          nearestFacility: recommendedClinic.name,
          distanceKm: finalDistance,
          travelTime: estimateTravelTime(finalDistance),
          isEmergency: isEmergency,
          clinic: recommendedClinic
        },
        error: false
      };
    }

    return {
      severity: 'high',
      recommendation: 'Estas experimentando un síntoma de urgencia debes acudir a un centro de salud de inmediato. Por favor, acuda al centro asistencial más cercano.',
      reasoning: 'Caso de alta prioridad detectado. No hay clínicas geolocalizadas disponibles en la red.',
      error: false
    };
  } catch (error) {
    console.error('Error en triaje:', error);
    return {
      severity: 'medium',
      recommendation: 'Consulte con un médico profesional si sus síntomas persisten.',
      reasoning: 'Error al ejecutar el triaje.',
      error: true
    };
  }
}