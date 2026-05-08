import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { AnimatePresence, motion } from 'motion/react';
import { 
  MapPin, 
  Phone, 
  Pill, 
  Activity, 
  Navigation, 
  Search, 
  Clock, 
  CheckCircle2, 
  Route,
  Target,
  Plus,
  Minus,
  AlertCircle,
  Globe,
  X,
  ShieldAlert,
  Stethoscope,
  ChevronRight,
  TrendingDown,
  User,
  Mic,
  RotateCcw,
  Send
} from 'lucide-react';
import { Clinic } from '../../types';
import { getClinics } from '../../services/clinicService';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

function ClinicMarker({ clinic, onClick }: { clinic: Clinic, onClick: (c: Clinic) => void, key?: any }) {
  const [markerRef] = useAdvancedMarkerRef();
  
  const getColor = () => {
    switch (clinic.type) {
      case 'pharmacy': return '#12B76A'; // Green
      case 'emergency': return '#F04438'; // Red
      default: return '#2E90FA'; // Blue
    }
  };

  return (
    <AdvancedMarker
      ref={markerRef}
      position={clinic.location}
      onClick={() => onClick(clinic)}
      title={clinic.name}
    >
      <Pin background={getColor()} borderColor="#ffffff33" glyphColor="#fff">
        {clinic.type === 'pharmacy' ? <Pill className="w-3 h-3" /> : clinic.type === 'emergency' ? <Activity className="w-3 h-3" /> : <Navigation className="w-3 h-3" />}
      </Pin>
    </AdvancedMarker>
  );
}

export default function HealthMap() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [center] = useState({ lat: -33.4489, lng: -70.6693 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pharmacy' | 'emergency'>('all');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [triageSummary, setTriageSummary] = useState<{
    urgency: string;
    description: string;
    condition: string;
  } | null>(null);

  useEffect(() => {
    const handleMedicationSearch = (e: any) => {
      const medication = e.detail?.medication;
      if (medication) {
        setSearchTerm(medication);
        setFilter('pharmacy');
      }
    };

    const handleEmergencyMode = (e: any) => {
      const data = e.detail;
      if (data) {
        setIsEmergencyMode(true);
        setFilter('emergency');
        setTriageSummary({
          urgency: data.urgency || 'emergency',
          description: data.recommendation || 'Se requiere atención inmediata.',
          condition: data.medication || 'Compromiso Agudo'
        });
      }
    };

    window.addEventListener('medicationSearch', handleMedicationSearch);
    window.addEventListener('emergencyMode', handleEmergencyMode);
    return () => {
      window.removeEventListener('medicationSearch', handleMedicationSearch);
      window.removeEventListener('emergencyMode', handleEmergencyMode);
    };
  }, []);

  useEffect(() => {
    const mockClinics: Clinic[] = [
      {
        id: '1',
        name: 'Farmacia Central MSP',
        type: 'pharmacy',
        location: { lat: -33.45, lng: -70.66 },
        address: 'Av. Salud Pública 452',
        phone: '+56 9 1234 5678',
        inStock: true,
        open24h: true,
      },
      {
        id: '2',
        name: 'FarmaVida Norte',
        type: 'pharmacy',
        location: { lat: -33.46, lng: -70.67 },
        address: 'Calle Bienestar 890',
        phone: '+56 9 8765 4321',
        inStock: true,
        open24h: false,
      },
      {
        id: '3',
        name: 'Urgencia Sanitaria 24h',
        type: 'emergency',
        location: { lat: -33.44, lng: -70.65 },
        address: 'Av. Gran Hospital 10',
        phone: '911',
        open24h: true,
      },
      {
        id: '4',
        name: 'Hospital Regional',
        type: 'emergency',
        location: { lat: -33.435, lng: -70.645 },
        address: 'Calle Medicina 77',
        phone: '911',
        open24h: true,
      }
    ];

    const fetchClinics = async () => {
      try {
        const data = await getClinics();
        if (data.length > 0) setClinics(data);
        else setClinics(mockClinics);
      } catch (e) {
        setClinics(mockClinics);
      }
    };
    fetchClinics();
  }, []);

  const filteredClinics = clinics.filter(c => {
    const matchesFilter = filter === 'all' || c.type === filter;
    // For demo purposes, we show all pharmacies if searching for medication
    return matchesFilter;
  });

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-background">
      
      {/* Emergency Banner - Shown when in emergency mode */}
      <AnimatePresence>
        {isEmergencyMode && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-error-container text-on-error-container shrink-0 z-50 shadow-lg border-b border-error/50"
          >
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center border border-error/20">
                  <ShieldAlert className="w-6 h-6 text-error animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-error leading-tight">Modo Emergencia Activo</h3>
                  <p className="text-[10px] font-bold opacity-80 uppercase font-mono">{triageSummary?.condition || 'Compromiso Cardiovascular Detectado'}</p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold opacity-70 uppercase tracking-tighter">ETA Guardia Central</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-display font-black text-error leading-none tracking-tighter">08:42</span>
                  <span className="text-xs font-bold text-error uppercase">min</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar: Logistical Clarity */}
        <aside className="w-full md:w-[420px] lg:w-[480px] bg-surface-container-low border-r border-outline-variant/20 flex flex-col z-20 shadow-xl overflow-hidden relative">
          
          {/* Context Header */}
          <div className="p-6 bg-surface-container border-b border-outline-variant/30 shrink-0">
            {isEmergencyMode ? (
              <>
                <div className="mb-4 bg-error-container/10 rounded-2xl p-4 border border-error/20 flex gap-4">
                  <div className="bg-error/10 p-2 rounded-xl h-fit border border-error/20">
                    <Stethoscope className="w-5 h-5 text-error" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-[10px] font-bold text-error uppercase tracking-widest font-mono">Resumen de Triaje IA</h4>
                    <p className="text-xs font-medium text-on-surface-variant leading-relaxed">
                      {triageSummary?.description || 'Dolor torácico agudo reportado. Posible compromiso cardiovascular. Prioridad Alta.'}
                    </p>
                  </div>
                </div>

                {/* Direct Communication Section from Mockup */}
                <div className="bg-error-container/10 border border-error/20 rounded-2xl p-4 flex flex-col gap-4 shadow-inner">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-mono">Comunicación Directa</h4>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-error rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-error uppercase tracking-widest font-mono">Grabando...</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button className="w-12 h-12 bg-error text-on-error rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(240,68,56,0.3)] animate-pulse hover:scale-105 active:scale-95 transition-all outline-none">
                      <Mic className="w-5 h-5 fill-current" />
                    </button>
                    
                    <div className="flex-1 h-8 flex items-center gap-1 overflow-hidden">
                      {[0, 0.2, 0.4, 0.1, 0.3, 0.5, 0.2, 0.4, 0.1, 0.0].map((delay, i) => (
                        <div 
                          key={i}
                          style={{ 
                            animationDelay: `${delay}s`,
                            height: `${40 + Math.random() * 60}%` 
                          }}
                          className="w-0.5 bg-error/40 rounded-full animate-voice-bounce origin-center"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest/50 border border-outline-variant/30 rounded-xl p-3 shadow-inner">
                    <h5 className="text-[9px] font-bold text-outline-variant uppercase tracking-widest mb-2 flex items-center gap-2">
                       <span className="w-1 h-1 bg-primary rounded-full" />
                       Transcripción en tiempo real
                    </h5>
                    <p className="text-xs text-on-surface font-medium italic leading-relaxed">
                      "Siento un dolor punzante en el pecho que se extiende hacia el brazo izquierdo..."
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-error/20 border border-error/40 hover:bg-error/30 text-error py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                      <Send className="w-3 h-3" />
                      Confirmar y Enviar
                    </button>
                    <button className="px-3 bg-surface-container-high border border-outline-variant/30 text-on-surface-variant rounded-xl flex items-center justify-center hover:bg-surface-container-highest transition-all group">
                      <RotateCcw className="w-4 h-4 group-hover:rotate-[-45deg] transition-transform" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                    <Search className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-on-surface">Red de Salud</h2>
                </div>
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setSearchTerm('')}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary hover:bg-primary/20 transition-all font-mono"
                  >
                    <span>{searchTerm.toUpperCase()}</span>
                    <X className="w-3 h-3" />
                  </motion.button>
                )}
              </div>
            )}
            
            <div className="flex gap-2 mt-2 md:mt-6 overflow-x-auto scrollbar-hide pb-1">
               {[
                 { id: 'all', label: 'Todos', icon: Globe },
                 { id: 'pharmacy', label: 'Farmacias', icon: Pill },
                 { id: 'emergency', label: 'Urgencias', icon: Activity }
               ].map((f) => (
                 <button
                   key={f.id}
                   onClick={() => setFilter(f.id as any)}
                   className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap shadow-sm font-mono ${
                     filter === f.id 
                       ? 'bg-primary text-on-primary border-primary' 
                       : 'bg-surface-container-high text-on-surface-variant border-outline-variant/30 hover:border-primary/40'
                   }`}
                 >
                   <f.icon className="w-3.5 h-3.5" />
                   {f.label.toUpperCase()}
                 </button>
               ))}
            </div>
          </div>

          <div className="p-4 px-6 bg-surface-container-low border-b border-outline-variant/10">
            <h3 className="text-[10px] font-bold text-outline-variant uppercase tracking-[0.2em] font-mono">Centros Cercanos Prioritarios</h3>
          </div>

          {/* Scrollable Pharmacy List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {filteredClinics.map((clinic) => (
              <motion.div
                layout
                key={clinic.id}
                onClick={() => setSelectedClinic(clinic)}
                className={`group relative bg-surface-container p-5 rounded-2xl border transition-all cursor-pointer ${
                  selectedClinic?.id === clinic.id 
                    ? 'border-primary ring-1 ring-primary/40 shadow-[0_8px_24px_rgba(46,144,250,0.15)] bg-surface-container-high' 
                    : isEmergencyMode && clinic.type === 'emergency'
                      ? 'border-error/30 bg-error/5 hover:bg-error/10'
                      : 'border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container-high'
                }`}
              >
                {selectedClinic?.id === clinic.id && (
                  <div className={`absolute top-0 left-0 w-1.5 h-full rounded-l-full ${clinic.type === 'emergency' ? 'bg-error' : 'bg-primary'}`} />
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-current transition-colors ${
                      clinic.type === 'emergency' ? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary'
                    }`}>
                      {clinic.type === 'emergency' ? <Activity className="w-5 h-5" /> : <Pill className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className={`font-display font-bold text-lg leading-tight transition-colors ${
                        clinic.type === 'emergency' ? 'text-on-surface group-hover:text-error' : 'text-on-surface group-hover:text-secondary'
                      }`}>
                        {clinic.name}
                      </h3>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1 font-medium italic opacity-70">
                        <MapPin className="w-3 h-3" /> {clinic.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-xl font-display font-bold leading-none ${clinic.type === 'emergency' ? 'text-error' : 'text-primary'}`}>
                      {clinic.id === '3' ? '2.4 km' : '1.2 km'}
                    </span>
                    {clinic.type === 'emergency' ? (
                      <span className="text-[10px] font-bold text-error uppercase tracking-tighter mt-1 font-mono">Espera: 5 min</span>
                    ) : (
                      <span className="text-[10px] font-bold text-on-surface-variant font-mono uppercase tracking-tighter mt-1">Aprox. 5 min</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {clinic.type === 'pharmacy' && (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-colors ${
                      searchTerm 
                        ? 'bg-secondary-container text-on-secondary-container border-secondary-container animate-pulse' 
                        : 'bg-secondary-container/10 text-secondary-container border-secondary-container/20'
                    }`}>
                      <CheckCircle2 className="w-3 h-3" /> 
                      {searchTerm ? `Stock de ${searchTerm} Confirmado` : 'Stock Confirmado'}
                    </div>
                  )}
                  {clinic.open24h && (
                    <div className="flex items-center gap-1.5 bg-surface-container-highest text-on-surface-variant px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border border-outline-variant/30">
                      <Clock className="w-3 h-3" /> 24 Horas
                    </div>
                  )}
                </div>

                <button className={`w-full py-3.5 px-4 rounded-[18px] font-display font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  selectedClinic?.id === clinic.id
                    ? clinic.type === 'emergency' ? 'bg-error text-on-error shadow-lg shadow-error/20' : 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                    : 'bg-surface-container-highest text-on-surface border border-outline-variant/30 hover:bg-surface-container transition-all active:scale-[0.98]'
                }`}>
                  <Route className="w-4 h-4" />
                  Iniciar Navegación
                </button>
              </motion.div>
            ))}
          </div>

          {/* Emergency Contacts Section from Mockup */}
          {isEmergencyMode && (
            <div className="p-6 bg-surface-container border-t border-outline-variant/20 flex flex-col gap-4">
               <h3 className="text-[10px] font-bold text-outline-variant uppercase tracking-[0.2em] font-mono pl-1">Contactos de Emergencia</h3>
               <button className="w-full bg-surface-container-high border border-outline-variant/30 rounded-2xl p-4 flex items-center gap-4 hover:border-primary group transition-all shadow-sm">
                 <div className="w-12 h-12 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-all">
                   <User className="w-6 h-6 fill-current" />
                 </div>
                 <div className="flex-1 text-left">
                   <h4 className="font-bold text-on-surface text-sm">María (Hija)</h4>
                   <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest mt-0.5">Aviso de Emergencia</p>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-all shadow-sm">
                   <Phone className="w-5 h-5" />
                 </div>
               </button>
            </div>
          )}

          {isEmergencyMode && (
             <div className="px-6 pb-6 pt-2 space-y-4">
                <button className="w-full h-14 bg-primary text-on-primary font-display font-black text-sm uppercase tracking-[0.15em] rounded-2xl shadow-[0_8px_20px_rgba(46,144,250,0.3)] hover:shadow-[0_12px_28px_rgba(46,144,250,0.4)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  <Navigation className="w-5 h-5 fill-current" />
                  Iniciar Navegación
                </button>

                <button 
                  onClick={() => setIsEmergencyMode(false)}
                  className="w-full py-3 text-[10px] font-bold text-outline-variant hover:text-error uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-dashed border-outline-variant/30 rounded-xl"
                >
                  <X className="w-3.5 h-3.5" /> Finalizar Modo Emergencia
                </button>
             </div>
          )}
        </aside>

        {/* Map Section */}
        <section className="flex-1 relative bg-background overflow-hidden">
          {hasValidKey ? (
            <APIProvider apiKey={API_KEY}>
              <Map
                defaultCenter={center}
                defaultZoom={13}
                mapId="DARK_MODE_MAP"
                className="w-full h-full"
                gestureHandling="greedy"
                disableDefaultUI
                styles={[
                   {
                     "featureType": "all",
                     "elementType": "labels.text.fill",
                     "stylers": [{"color": "#8a919e"}]
                   },
                   {
                     "featureType": "all",
                     "elementType": "labels.icon",
                     "stylers": [{"visibility": "off"}]
                   },
                   {
                     "featureType": "landscape",
                     "elementType": "all",
                     "stylers": [{"color": "#0b1326"}]
                   },
                   {
                     "featureType": "poi",
                     "elementType": "all",
                     "stylers": [{"visibility": "off"}]
                   },
                   {
                      "featureType": "road",
                      "elementType": "all",
                      "stylers": [{"color": "#171f33"}]
                   },
                   {
                      "featureType": "water",
                      "elementType": "all",
                      "stylers": [{"color": "#060e20"}]
                   }
                ]}
              >
                {clinics.map(clinic => (
                  <ClinicMarker 
                    key={clinic.id} 
                    clinic={clinic} 
                    onClick={setSelectedClinic} 
                  />
                ))}

                {selectedClinic && (
                  <InfoWindow
                    position={selectedClinic.location}
                    onCloseClick={() => setSelectedClinic(null)}
                  >
                    <div className="p-1 min-w-[200px]">
                      <h4 className={`font-display font-bold ${selectedClinic.type === 'emergency' ? 'text-error' : 'text-primary'}`}>{selectedClinic.name}</h4>
                      <p className="text-xs text-on-surface-variant mt-1">{selectedClinic.address}</p>
                      <div className="mt-3 pt-3 border-t border-outline-variant/30 flex gap-2">
                         <button className={`flex-1 py-1.5 rounded-lg text-xs font-bold shadow-md ${selectedClinic.type === 'emergency' ? 'bg-error text-on-error' : 'bg-primary text-on-primary'}`}>Llegar</button>
                         <a href={`tel:${selectedClinic.phone}`} className="w-10 h-8 flex items-center justify-center bg-surface-container rounded-lg border border-outline-variant/30 text-on-surface-variant hover:text-primary">
                            <Phone className="w-4 h-4" />
                         </a>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          ) : (
            <div className="absolute inset-0 w-full h-full bg-cover bg-center grayscale opacity-60 mix-blend-screen" 
                 style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAr1biyQAoYA3-Hq4qI8fOnXgkDERfbtqJkhE-oG7uZ4-nBBThi8jcCdIv0NgUFbXo3y-ZgwB_s_1I-5wAnm4FvBemeWNmid3vACTSYEsbzGZBuGoR5bXL2UudJAMv0AWlhvwFnKwgmGd5DOvNAdY8rTU1fkU19OHPwJpJD9sffZaPnlLUf3ZKASDhmvchKGnkH0COXzxRyi9GhwHgSlHa9ab-IfkSp-uJRxlwfm70XGgys-UtZ2YPaMWxQInl8Pz-lQNgr3E_C5g')` }}
            />
          )}

          {/* Route Overlay: Desktop only floating panel */}
          <div className="hidden md:flex absolute top-6 right-6 p-6 glass-panel-elevated rounded-2xl w-[320px] flex-col gap-4 z-10 shadow-2xl border border-outline-variant/20">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${isEmergencyMode ? 'bg-error/20 text-error border-error/30' : 'bg-primary/20 text-primary border-primary/30'}`}>
                {isEmergencyMode ? <AlertCircle className="w-4 h-4 animation-pulse" /> : <Route className="w-4 h-4" />}
              </div>
              <h3 className="font-display font-bold text-lg text-on-surface leading-tight">
                {isEmergencyMode ? 'Ruta de Urgencia' : 'Ruta Activa'}
              </h3>
            </div>
            
            <div className="flex justify-between items-end border-b border-outline-variant/20 pb-3">
              <span className="text-xs text-on-surface-variant font-medium">Llegada estimada</span>
              <span className={`text-2xl font-display font-bold ${isEmergencyMode ? 'text-error' : 'text-primary'}`}>14:35</span>
            </div>

            <div className={`flex items-center gap-3 ${isEmergencyMode ? 'text-error' : 'text-secondary-container'}`}>
              <CheckCircle2 className={`w-5 h-5 shrink-0 ${isEmergencyMode ? 'animate-pulse' : ''}`} />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono leading-tight">
                {isEmergencyMode ? 'Prioridad Médica Notificada' : 'Stock Reservado Temporalmente'}
              </p>
            </div>

            {!hasValidKey && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-error leading-tight">Configuración de API Key requerida para navegación real.</p>
              </div>
            )}
            
            {isEmergencyMode && (
              <div className="bg-surface-container-high rounded-xl p-3 border border-error/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-bold text-error uppercase tracking-widest">Estado Guardia</span>
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase bg-error/10 px-2 py-0.5 rounded-full">Alta Demanda</span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                   <div className="bg-error h-full w-4/5 animate-shimmer" />
                </div>
              </div>
            )}
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-10">
             <button className="w-12 h-12 bg-surface-container border border-outline-variant/30 rounded-2xl shadow-xl flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-all active:scale-95">
               <Target className="w-6 h-6" />
             </button>
             <div className="flex flex-col bg-surface-container border border-outline-variant/30 rounded-2xl shadow-xl overflow-hidden">
               <button className="w-12 h-12 flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-all border-b border-outline-variant/20">
                 <Plus className="w-6 h-6" />
               </button>
               <button className="w-12 h-12 flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-all">
                 <Minus className="w-6 h-6" />
               </button>
             </div>
          </div>

          {/* Mobile Toggle: Map View Label */}
          <div className="md:hidden absolute top-4 left-1/2 -translate-x-1/2 bg-surface-container/80 backdrop-blur-md border border-outline-variant/20 px-4 py-1.5 rounded-full text-[10px] font-bold text-primary-fixed uppercase tracking-widest shadow-lg">
            Vista Satelital IA
          </div>
        </section>
      </div>

    </div>
  );
}
