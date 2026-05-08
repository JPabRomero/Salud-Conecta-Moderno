import React, { useState } from 'react';
import { 
  Store, 
  Activity, 
  Clock, 
  MapPin, 
  Locate, 
  Save, 
  Info,
  ChevronLeft,
  Stethoscope,
  Hospital,
  FlaskConical,
  GraduationCap,
  ShieldCheck,
  Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EntityRegistrationProps {
  onBack: () => void;
  initialType?: RegistrationType;
}

type RegistrationType = 'doctor' | 'clinic' | 'lab_pharmacy';

export default function EntityRegistration({ onBack, initialType = 'lab_pharmacy' }: EntityRegistrationProps) {
  const [regType, setRegType] = useState<RegistrationType>(initialType);

  const types = [
    { id: 'doctor', label: 'Soy Doctor', icon: Stethoscope, color: 'text-primary', bg: 'bg-primary/10' },
    { id: 'clinic', label: 'Clínica', icon: Hospital, color: 'text-secondary', bg: 'bg-secondary/10' },
    { id: 'lab_pharmacy', label: 'Laboratorio / Farmacia', icon: Store, color: 'text-tertiary', bg: 'bg-tertiary/10' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      {/* Emergency Triage Bar */}
      <div className="w-full bg-secondary-container text-on-secondary-container px-4 py-2 flex items-center justify-center gap-2 sticky top-0 z-[60] shadow-sm">
        <Info className="w-4 h-4 fill-current" />
        <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-center">
          Modo de Registro Activo - Red Salud Conecta™
        </span>
      </div>

      {/* Header */}
      <header className="w-full px-6 py-8 flex items-center justify-between bg-surface-container-low border-b border-outline-variant/30">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-2 rounded-xl hover:bg-surface-container-high active:scale-95 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-primary-fixed-dim tracking-tight">Portal de Registro</h1>
            <p className="text-sm text-on-surface-variant opacity-60 font-medium">Únete a la red médica digitalizada más avanzada</p>
          </div>
        </div>
        <div className="hidden sm:block text-primary-fixed-dim text-xl font-display font-black tracking-tighter opacity-80">
          Salud Conecta IA
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-10 flex flex-col gap-10">
        
        {/* Type Selector */}
        <section>
          <h2 className="text-xs font-black text-outline-variant uppercase tracking-[0.3em] mb-6 ml-1">Selecciona tu perfil</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {types.map((type) => (
              <button
                key={type.id}
                onClick={() => setRegType(type.id as RegistrationType)}
                className={`relative group p-6 rounded-[32px] border-2 transition-all flex items-center gap-4 overflow-hidden ${
                  regType === type.id 
                    ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' 
                    : 'border-outline-variant/20 hover:border-primary/40 bg-surface-container-low'
                }`}
              >
                {regType === type.id && (
                  <motion.div 
                    layoutId="active-bg"
                    className="absolute inset-0 bg-primary/5 pointer-events-none"
                  />
                )}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${type.bg} ${type.color} shrink-0 group-hover:scale-110 transition-transform`}>
                  <type.icon className="w-6 h-6" />
                </div>
                <div className="text-left relative z-10">
                  <span className={`block font-display font-black text-sm tracking-tight ${regType === type.id ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {type.label}
                  </span>
                  <span className="block text-[10px] font-bold text-outline-variant uppercase tracking-widest mt-0.5">
                    {type.id === 'doctor' ? 'Profesional' : 'Establecimiento'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <AnimatePresence mode="wait">
          <motion.div
            key={regType}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8"
          >
            {/* Form Fields */}
            <form className="md:col-span-8 flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
              
              {/* Identification Card */}
              <div className="bg-surface-container border border-outline-variant/30 rounded-[32px] p-8 flex flex-col gap-6 relative overflow-hidden shadow-xl">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-[32px]" />
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    {regType === 'doctor' ? <ShieldCheck className="w-6 h-6" /> : <Building className="w-6 h-6" />}
                  </div>
                  <h3 className="text-xl font-display font-black text-on-surface">
                    {regType === 'doctor' ? 'Información Profesional' : 'Identificación Oficial'}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {regType === 'doctor' ? (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em] ml-1">Nombre Completo</label>
                        <input className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 text-on-surface px-5 py-4 font-medium transition-all outline-none" placeholder="Dr. Juan Perez" type="text" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em] ml-1">Nº Matrícula Profesional</label>
                        <input className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 text-on-surface px-5 py-4 font-medium transition-all outline-none" placeholder="MP-XXXXXX" type="text" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em] ml-1">Razón Social</label>
                        <input className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 text-on-surface px-5 py-4 font-medium transition-all outline-none" placeholder={regType === 'clinic' ? 'Ej. Clínica San Rafael' : 'Ej. Laboratorios Global'} type="text" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em] ml-1">CUIT / Registro Sanitario</label>
                        <input className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 text-on-surface px-5 py-4 font-medium transition-all outline-none" placeholder="30-XXXXXXXX-X" type="text" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Specialized Fields */}
              {regType === 'doctor' && (
                <div className="bg-surface-container border border-outline-variant/30 rounded-[32px] p-8 flex flex-col gap-6 shadow-xl">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-display font-black text-on-surface">Especialidades</h3>
                  </div>
                  <div className="flex flex-col gap-4">
                     <select className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 text-on-surface px-5 py-4 font-medium transition-all outline-none appearance-none">
                        <option>Cardiología</option>
                        <option>Dermatología</option>
                        <option>Pediatría</option>
                        <option>Neurología</option>
                        <option>Ginecología</option>
                     </select>
                     <div className="flex flex-wrap gap-2">
                        {['Medicina Interna', 'Cardiología Intervencionista'].map(tag => (
                          <span key={tag} className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest">{tag}</span>
                        ))}
                     </div>
                  </div>
                </div>
              )}

              {/* Services / Equipment */}
              {regType !== 'doctor' && (
                <div className="bg-surface-container border border-outline-variant/30 rounded-[32px] p-8 flex flex-col gap-6 shadow-xl">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
                      <Activity className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-display font-black text-on-surface">Servicios y Capacidades</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(regType === 'clinic' 
                      ? [
                          { title: 'Urgencias', sub: 'Guardia 24h', icon: '🚑' },
                          { title: 'Cirugía', sub: 'Quirófanos alta comp.', icon: '⚡' },
                          { title: 'Consultorios', sub: 'Especialidades', icon: '📋' }
                        ]
                      : [
                          { title: 'Análisis Clínicos', sub: 'Extracciones', icon: '🧪' },
                          { title: 'Imágenes', sub: 'Rayos X, ECO', icon: '📸' },
                          { title: 'Farmacia', sub: 'Despacho receta', icon: '💊' }
                        ]
                    ).map((service) => (
                      <label key={service.title} className="group flex items-start gap-4 p-5 border border-outline-variant/20 rounded-3xl bg-surface-container-low cursor-pointer hover:border-primary/50 hover:bg-surface-bright transition-all">
                        <div className="mt-1">
                          <input className="w-5 h-5 rounded-lg border-outline-variant/30 bg-surface text-primary focus:ring-primary transition-all cursor-pointer" type="checkbox" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{service.title}</span>
                          <span className="text-[10px] font-medium text-on-surface-variant opacity-60 leading-tight mt-0.5">{service.sub}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Section: Availability */}
              <div className="bg-surface-container border border-outline-variant/30 rounded-[32px] p-8 flex flex-col gap-6 shadow-xl">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-display font-black text-on-surface">Horarios de Atención</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em] ml-1">Inicio de Atención</label>
                    <input className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 text-on-surface px-5 py-4 font-medium transition-all outline-none" type="time" defaultValue="08:00" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em] ml-1">Cierre de Atención</label>
                    <input className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 text-on-surface px-5 py-4 font-medium transition-all outline-none" type="time" defaultValue="20:00" />
                  </div>
                </div>

                <label className="flex items-center gap-4 mt-2 p-4 bg-secondary/5 rounded-2xl border border-secondary/10 cursor-pointer group">
                  <input className="w-5 h-5 rounded-lg border-secondary/30 bg-surface text-secondary focus:ring-secondary transition-all cursor-pointer" type="checkbox" />
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-secondary uppercase tracking-[0.1em]">Atención / Guardia 24 Horas</span>
                    <span className="text-[10px] font-bold text-secondary/70 uppercase tracking-widest leading-tight">Servicio ininterrumpido en la red</span>
                  </div>
                </label>
              </div>
            </form>

            {/* Right Column: Location & Summary */}
            <aside className="md:col-span-4 flex flex-col gap-8">
              <div className="bg-surface-container border border-outline-variant/30 rounded-[32px] p-8 flex flex-col gap-6 shadow-xl sticky top-24">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-display font-black text-on-surface">Ubicación</h3>
                </div>

                <div className="w-full h-56 bg-surface-container-low rounded-3xl border border-outline-variant/30 relative overflow-hidden group shadow-inner">
                  <img 
                    alt="Map Preview" 
                    className="w-full h-full object-cover opacity-30 mix-blend-luminosity grayscale group-hover:scale-105 transition-transform duration-700" 
                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=600" 
                  />
                  <div className="absolute inset-0 bg-primary/5 flex items-center justify-center backdrop-blur-[2px]">
                    <button 
                      className="bg-surface/90 border border-outline-variant/50 px-6 py-3 rounded-2xl font-display font-bold text-[10px] uppercase tracking-widest text-primary flex items-center gap-3 hover:bg-surface hover:scale-105 active:scale-95 transition-all shadow-2xl" 
                      type="button"
                    >
                      <Locate className="w-4 h-4" />
                      Detectar Ubicación
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em] ml-1">Dirección Exacta</label>
                  <textarea 
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 text-on-surface px-5 py-4 font-medium transition-all outline-none resize-none" 
                    placeholder="Calle, Número, Localidad..." 
                    rows={3}
                  />
                </div>

                {/* Submit Actions */}
                <div className="flex flex-col gap-4 mt-4 pt-6 border-t border-outline-variant/10">
                  <button 
                    className="w-full h-16 bg-primary text-on-primary font-display font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3" 
                    type="button"
                  >
                    <Save className="w-5 h-5" />
                    Registrar Perfil
                  </button>
                  <button 
                    onClick={onBack}
                    className="w-full h-14 bg-surface-container-high border border-outline-variant/30 text-on-surface-variant font-display font-bold text-[10px] uppercase tracking-[0.15em] rounded-2xl hover:bg-surface-bright hover:text-on-surface transition-all active:scale-[0.98]" 
                    type="button"
                  >
                    Volver Atrás
                  </button>
                </div>
              </div>
            </aside>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
