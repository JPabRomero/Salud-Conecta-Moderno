import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History as HistoryIcon,
  ShieldCheck,
  Download,
  AlertCircle,
  Activity,
  FileText,
  Pill,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { TriageRecord } from '../../types';
import { auth, signInWithGoogle } from '../../lib/firebase';
import { getUserTriages } from '../../services/triageService';
import { onAuthStateChanged } from 'firebase/auth';

export default function History() {
  const [user, setUser] = useState<any>(null);
  const [triages, setTriages] = useState<TriageRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        fetchTriages(u.uid);
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchTriages = async (uid: string) => {
    setIsLoading(true);
    try {
      const trgs = await getUserTriages(uid);
      setTriages(trgs);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background min-h-[60vh]">
        <div className="max-w-md w-full bg-surface-container p-8 rounded-3xl border border-outline-variant shadow-xl text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <HistoryIcon className="w-10 h-10 text-primary opacity-40" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4 text-on-surface">Historial Reservado</h2>
          <p className="text-on-surface-variant mb-8 text-body-md leading-relaxed">
            Para ver tu pasaporte de salud y registros médicos, por favor inicia sesión.
          </p>
          <button 
            onClick={signInWithGoogle}
            className="w-full bg-primary text-on-primary py-4 rounded-2xl font-display font-bold text-lg hover:bg-primary-container transition-all flex items-center justify-center gap-3 shadow-lg"
          >
            Ver Mi Pasaporte
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 flex flex-col gap-10">
      <div className="flex flex-col gap-2 border-b border-outline-variant/20 pb-8">
        <h1 className="text-4xl font-display font-bold text-on-surface">Pasaporte de Salud</h1>
        <p className="text-on-surface-variant font-medium uppercase tracking-[0.2em] text-[10px] font-mono">Realon™ Health Systems • Sincronización Cloud-IA</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-bold text-on-surface-variant font-mono">Sincronizando Expediente...</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* QR PASSPORT SECTION */}
          <section className="bg-surface-container rounded-3xl p-8 border border-outline-variant/30 flex flex-col sm:flex-row items-center gap-10 shadow-lg group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
            
            <div className="w-[180px] h-[180px] bg-white rounded-2xl shrink-0 flex items-center justify-center overflow-hidden relative shadow-2xl ring-4 ring-primary/5 z-10 transition-transform group-hover:scale-105">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=REALON-HEALTH-${user.uid}`}
                alt="Pasaporte QR" 
                className="w-4/5 h-4/5 object-contain"
              />
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                 <ShieldCheck className="w-10 h-10 text-primary animate-pulse" />
              </div>
            </div>
            
            <div className="flex flex-col gap-5 w-full text-center sm:text-left z-10">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-primary">
                <CheckCircle2 className="w-4 h-4 fill-primary text-background" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono">DATOS ENCRIPTADOS END-TO-END</span>
              </div>
              <h2 className="text-3xl font-display font-bold text-on-surface leading-tight">Acceso Médico Seguro</h2>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-2 opacity-80">
                Presente este código al personal de salud para compartir su resumen clínico, alergias y triajes recientes de forma inmediata.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="flex-1 sm:flex-none bg-primary text-on-primary font-display font-bold py-3.5 px-8 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-container transition-all active:scale-95 shadow-xl">
                  <Download className="w-4 h-4" />
                  Descargar PDF
                </button>
                <button className="flex-1 sm:flex-none bg-surface-container-highest border border-outline-variant/30 text-on-surface px-6 py-3.5 rounded-2xl font-display font-bold text-sm hover:bg-surface-bright transition-all">
                  Imprimir
                </button>
              </div>
            </div>
          </section>

          {/* TRIAGE HISTORY */}
          <div className="space-y-8">
            <div className="flex justify-between items-end border-b border-outline-variant/20 pb-4">
              <h2 className="text-2xl font-display font-bold text-on-surface">Historial de Triajes</h2>
              <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest bg-surface-container px-3 py-1.5 rounded-xl border border-outline-variant/30">
                {triages.length} Registros
              </span>
            </div>

            {triages.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {triages.map((triage) => (
                  <motion.article
                    key={triage.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-surface-container rounded-[32px] p-8 border border-outline-variant/20 hover:border-primary/40 hover:bg-surface-container-high transition-all relative overflow-hidden group shadow-sm flex flex-col gap-6"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-2 ${
                      triage.urgency === 'emergency' ? 'bg-error shadow-[0_0_20px_#ffb4ab]' :
                      triage.urgency === 'high' ? 'bg-tertiary shadow-[0_0_15px_#ffb4aa]' :
                      triage.urgency === 'medium' ? 'bg-primary' : 'bg-secondary'
                    }`} />
                    
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                        <div className="flex flex-col gap-1.5">
                          <time className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest block opacity-60">
                            {new Date(triage.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()} • {new Date(triage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </time>
                          <h3 className="text-2xl font-display font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">
                            {triage.symptoms}
                          </h3>
                        </div>
                        <div className={`px-5 py-2 rounded-full text-[10px] font-mono font-black uppercase tracking-widest flex items-center gap-2 shrink-0 shadow-sm border ${
                          triage.urgency === 'emergency' ? 'bg-error/10 text-error border-error/20' :
                          triage.urgency === 'high' ? 'bg-tertiary/10 text-tertiary border-tertiary/20' :
                          triage.urgency === 'medium' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary/10 text-secondary border-secondary/20'
                        }`}>
                          {triage.urgency === 'emergency' && <AlertCircle className="w-3.5 h-3.5 animate-pulse" />}
                          {triage.urgency === 'emergency' ? 'EMERGENCIA' : 
                           triage.urgency === 'high' ? 'ALTA PRIORIDAD' : 
                           triage.urgency === 'medium' ? 'CONSULTA CLÍNICA' : 'OBSERVACIÓN'}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-on-surface/5 space-y-5">
                        <div className="flex flex-col gap-2 bg-surface-container-high/30 p-5 rounded-2xl border border-primary/5">
                          <span className="font-mono font-bold text-[10px] text-primary uppercase block tracking-widest">Protocolo Sugerido por IA:</span>
                          <p className="text-on-surface text-sm leading-relaxed font-sans italic font-medium">
                            "{triage.recommendation}"
                          </p>
                        </div>
                        
                        {triage.medication && (
                          <div className="flex items-center gap-4 bg-surface-container-high/50 p-4 rounded-2xl border border-outline-variant/10 shadow-inner">
                            <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20">
                              <Pill className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                               <span className="text-[10px] font-bold text-primary uppercase font-mono block tracking-wider">Tratamiento Recomendado</span>
                               <p className="text-sm font-bold text-on-surface">{triage.medication} {triage.dosage && `(${triage.dosage})`}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-surface-container-low rounded-[32px] border border-dashed border-outline-variant/30">
                <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Activity className="w-10 h-10 text-outline-variant/40 animate-pulse" />
                </div>
                <h3 className="text-2xl font-display font-bold text-on-surface mb-3 tracking-tight">Expediente Digital Vacío</h3>
                <p className="text-on-surface-variant max-w-sm mx-auto text-sm leading-relaxed mb-10">
                  Realiza tu primer triaje inteligente para comenzar a construir tu pasaporte de salud global seguro.
                </p>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'triage' }))}
                  className="bg-primary text-on-primary px-8 py-4 rounded-2xl font-display font-bold shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  Iniciar Evaluación IA
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
