import React, { useMemo } from 'react';
import { useUser } from '../../contexts/UserContext';
import { NICARAGUA_HOSPITALS } from '../../data/nicaraguaHospitals';
import { PUBLIC_HEALTH_NETWORK } from '../../data/nicaraguaPublicHealthNetwork';

import { motion } from 'motion/react';
import { 
  Search as SearchIcon, 
  Stethoscope, 
  Hospital, 
  Store, 
  FlaskConical, 
  Star, 
  MapPin, 
  Calendar,
  PlusSquare,
  Navigation,
  ChevronRight,
  ShieldCheck,
  Activity,
  Building2,
  Lock
} from 'lucide-react';

interface SearchProps {
  onOpenRegistration: (type?: 'doctor' | 'clinic' | 'lab_pharmacy') => void;
}

export default function Search({ onOpenRegistration }: SearchProps) {
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const { isPremium } = useUser();

  const categories = [
    { id: 'public_health', icon: Building2, label: 'Salud Pública', isPublic: true },
    { id: 'doctor', icon: Stethoscope, label: 'Doctores' },
    { id: 'clinic', icon: Hospital, label: 'Clínicas' },
    { id: 'pharmacy', icon: Store, label: 'Farmacias' },
    { id: 'lab', icon: FlaskConical, label: 'Laboratorios' }
  ];

  const publicItems = useMemo(() => {
    const combined = [...NICARAGUA_HOSPITALS, ...PUBLIC_HEALTH_NETWORK];
    return combined
      .filter(item => item.sector === 'public')
      .map((item, index) => ({
        id: `public-${index}`,
        category: 'public_health',
        name: item.name,
        description: item.description || item.address || 'Institución Pública de Salud',
        image: item.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400',
        rating: item.rating || 4.0,
        distance: 'Centro MINSA',
        status: item.open24h ? 'Abierto 24h' : 'Horario Regular',
        statusType: 'available'
      }));
  }, []);

  const allItems = [
    ...publicItems,
    {
      id: '1',
      category: 'doctor',
      name: 'Dr. Alejandro Martínez',
      description: 'Cardiología Intervencionista',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200',
      rating: 4.9,
      distance: '2.4 km',
      status: 'Disponible Ahora',
      statusType: 'available'
    },
    {
      id: '2',
      category: 'doctor',
      name: 'Dra. Valentina Silva',
      description: 'Neurología Clínica',
      image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200',
      rating: 4.8,
      distance: '3.1 km',
      status: 'Mañana, 09:00',
      statusType: 'scheduled'
    },
    {
      id: '3',
      category: 'clinic',
      name: 'Clínica Santa Clara',
      description: 'Políclinico Multidisciplinario',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=200',
      rating: 4.7,
      distance: '1.2 km',
      status: 'Abierto 24h',
      statusType: 'available'
    },
    {
      id: '4',
      category: 'pharmacy',
      name: 'Farmacia San Jorge',
      description: 'Medicamentos y Convenios',
      image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=200',
      rating: 4.5,
      distance: '0.5 km',
      status: 'Cierra a las 22:00',
      statusType: 'limited'
    },
    {
      id: '5',
      category: 'lab',
      name: 'Laboratorio LabQuest',
      description: 'Análisis Clínicos y Biotecnología',
      image: 'https://images.unsplash.com/photo-1579152276558-9f196a575a7c?auto=format&fit=crop&q=80&w=200',
      rating: 4.6,
      distance: '4.2 km',
      status: 'Resultados en 24h',
      statusType: 'available'
    }
  ];

  const filteredItems = activeCategory 
    ? allItems.filter(item => item.category === activeCategory)
    : allItems;

  return (
    <div className="flex flex-col gap-8 pb-20 md:pb-0">
      {/* Search & Filters Hero */}
      <section className="bg-surface-container border border-outline-variant/30 rounded-3xl p-8 md:p-10 relative overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-on-surface mb-2 tracking-tight">
              Búsqueda Global
            </h1>
            <p className="text-on-surface-variant text-base font-medium opacity-70 mb-8">
              Encuentra especialistas, clínicas y servicios médicos al instante.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-[2] group/search">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within/search:text-primary transition-colors w-5 h-5" />
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/50 text-on-surface placeholder-on-surface-variant/50 rounded-xl pl-12 pr-4 py-4 focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" 
                placeholder="Buscar doctor, especialidad, síntomas..." 
                type="text"
              />
            </div>
            <div className="relative flex-1 group/location">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within/location:text-primary transition-colors w-5 h-5" />
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/50 text-on-surface placeholder-on-surface-variant/50 rounded-xl pl-12 pr-4 py-4 focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" 
                placeholder="Localidad..." 
                type="text"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isLocked = !cat.isPublic && !isPremium;
              return (
                <button 
                  key={cat.id}
                  onClick={() => {
                    if (isLocked) {
                      window.dispatchEvent(new CustomEvent('changeTab', { detail: 'membership' }));
                      return;
                    }
                    setActiveCategory(activeCategory === cat.id ? null : cat.id);
                  }}
                  className={`px-5 py-2.5 rounded-full flex items-center gap-2 font-display font-medium text-xs transition-all border ${
                    activeCategory === cat.id 
                      ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20 scale-105' 
                      : isLocked 
                        ? 'bg-surface-container-low text-on-surface-variant/50 border-outline-variant/20 opacity-80'
                        : 'bg-surface-container-high text-on-surface-variant border-outline-variant/40 hover:border-primary/50'
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                  {isLocked && <Lock className="w-3 h-3 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column: Results */}
        <div className="flex-1 flex flex-col gap-8">
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold text-on-surface flex items-center gap-3">
                <Star className="w-6 h-6 text-secondary fill-secondary" />
                {activeCategory 
                  ? `Resultados para ${categories.find(c => c.id === activeCategory)?.label}`
                  : 'Resultados Destacados'
                }
              </h2>
              {activeCategory && (
                <button 
                  onClick={() => setActiveCategory(null)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Ver todos
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -4 }}
                  className="bg-surface-container border border-outline-variant/30 rounded-2xl p-6 flex flex-col gap-6 shadow-xl relative overflow-hidden"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-surface-bright overflow-hidden shrink-0 border-2 border-surface-container-high shadow-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow pt-1">
                      <h3 className="text-lg font-display font-bold text-on-surface">{item.name}</h3>
                      <p className="text-primary text-sm font-medium mb-1">{item.description}</p>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                        <span className="flex items-center text-secondary gap-1">
                          <Star className="w-3.5 h-3.5 fill-secondary" /> {item.rating}
                        </span>
                        <span className="flex items-center gap-1 opacity-70">
                          <MapPin className="w-3.5 h-3.5" /> {item.distance}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/10">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                      item.statusType === 'available' 
                        ? 'bg-secondary/15 text-secondary' 
                        : 'bg-surface-container-highest text-on-surface-variant'
                    }`}>
                      {item.statusType === 'available' && <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>}
                      {item.status}
                    </span>
                    <button className="bg-primary text-on-primary hover:brightness-110 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm">
                      {item.category === 'doctor' ? 'Agendar' : 'Ver Detalles'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="p-12 text-center bg-surface-container border border-outline-variant/30 rounded-3xl">
                <p className="text-on-surface-variant font-medium">No se encontraron resultados para esta categoría.</p>
              </div>
            )}
          </section>

          {/* Registration Banner */}
          <section className="bg-gradient-to-r from-surface-container to-surface-container-low border border-outline-variant/30 rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="flex-1 relative z-10 flex flex-col gap-2">
              <h3 className="text-2xl font-display font-bold text-on-surface flex items-center gap-3">
                <PlusSquare className="w-6 h-6 text-primary" />
                Únete a la Red
              </h3>
              <p className="text-on-surface-variant text-base font-medium opacity-70 max-w-md leading-relaxed">
                Amplía tu alcance. Conecta con pacientes que buscan atención de calidad en tu especialidad o zona.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full md:w-auto">
              <button 
                onClick={() => onOpenRegistration('doctor')}
                className="px-8 py-4 bg-surface-container-highest text-on-surface font-display font-bold text-sm rounded-2xl hover:bg-surface-bright transition-all border border-outline-variant/50 shadow-lg"
              >
                ¿Eres Doctor? Regístrate
              </button>
              <button 
                onClick={() => onOpenRegistration('clinic')}
                className="px-8 py-4 bg-primary text-on-primary font-display font-bold text-sm rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-primary/20"
              >
                ¿Tienes una clínica? Únete
              </button>
            </div>
          </section>
        </div>

        {/* Right column: Map */}
        <aside className="w-full lg:w-96 shrink-0 h-[400px] lg:h-auto min-h-[500px] rounded-[32px] overflow-hidden border border-outline-variant bg-surface-container relative group shadow-2xl">
          <div className="absolute inset-0 bg-surface-container-lowest">
            <img 
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000" 
              alt="Map View" 
              className="w-full h-full object-cover opacity-20 contrast-[1.2] grayscale mix-blend-luminosity scale-110 group-hover:scale-100 transition-transform duration-[10s]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent opacity-90" />
            
            {/* Simulated Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping" />
                <div className="relative w-10 h-10 bg-primary rounded-full flex items-center justify-center text-on-primary shadow-2xl border-2 border-surface">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 p-6 flex flex-col h-full justify-between pointer-events-none">
            <div className="flex justify-end pointer-events-auto">
              <button className="bg-surface/80 backdrop-blur-xl p-4 rounded-2xl border border-outline-variant/30 text-on-surface-variant hover:text-primary transition-all shadow-xl">
                <Navigation className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 pointer-events-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface/90 backdrop-blur-2xl border border-outline-variant/30 rounded-3xl p-5 shadow-2xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                    <Hospital className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-lg text-on-surface">Clínica Santa Clara</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                      <span className="text-[10px] font-mono font-black text-secondary uppercase tracking-widest">Guardia Activa</span>
                    </div>
                  </div>
                </div>
                <button className="w-full py-3 bg-primary text-on-primary rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg">
                  Ver Detalles
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
