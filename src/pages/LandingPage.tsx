import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ShieldCheck, Calendar, QrCode, Search, Star, ArrowRight, Navigation, Clock, Scan, Cpu, Coins, Rocket, Car, GraduationCap, CreditCard, Lock, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { api } from '@/src/services/api';
import { ParkingListing } from '@/src/types';

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLocating, setIsLocating] = useState(false);
  const [featuredListings, setFeaturedListings] = useState<ParkingListing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await api.getListings();
        setFeaturedListings(data.slice(0, 3)); // Show first 3 as featured
      } catch (error) {
        console.error('Failed to fetch featured listings:', error);
      } finally {
        setIsLoadingListings(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleNearMe = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          navigate(`/search?lat=${latitude}&lng=${longitude}`);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          setIsLocating(false);
          navigate('/search');
        }
      );
    } else {
      navigate('/search');
    }
  };

  return (
    <div className="flex flex-col gap-32 pb-32 hero-gradient">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-start overflow-hidden pt-0">
        <div className="container mx-auto px-6 relative z-10 pt-4">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-7 flex flex-col gap-10">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-accent font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl backdrop-blur-md"
                >
                  <Star className="h-3.5 w-3.5 fill-current" />
                  votre place vous attend, l'IA s'occupe du reste.
                </motion.div>
                <h1 className="text-xl md:text-3xl font-black text-white leading-tight tracking-tighter uppercase font-display">
                  Votre plaque d'immatriculation est <br /> <span className="text-accent italic">votre clé</span>
                </h1>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl font-medium"
              >
                DzToll est une plateforme intelligente de gestion du stationnement urbain qui combine réservation en temps réel, économie collaborative et technologies d’accès automatisé.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <motion.button 
                  whileHover={{ scale: 1.05, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/search?lat=36.0731&lng=4.7611')}
                  className="h-12 px-6 w-full sm:w-auto rounded-xl bg-primary text-white font-black uppercase tracking-widest hover:bg-primary/90 shadow-xl transition-all flex items-center justify-center gap-2 text-[10px]"
                >
                  <Search className="h-4 w-4" />
                  {t('find_parking')}
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/plate-test')}
                  className="h-12 px-6 w-full sm:w-auto rounded-xl bg-white text-primary font-black uppercase tracking-widest hover:bg-white/90 shadow-xl transition-all flex items-center justify-center gap-2 text-[10px]"
                >
                  <Scan className="h-4 w-4" />
                  Tester notre IA
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.05, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNearMe}
                  disabled={isLocating}
                  className="h-12 px-6 w-full sm:w-auto rounded-xl bg-secondary text-white font-black uppercase tracking-widest hover:bg-secondary/90 shadow-xl transition-all flex items-center justify-center gap-2 text-[10px] disabled:opacity-50"
                >
                  <Navigation className={cn("h-4 w-4", isLocating && "animate-pulse")} />
                  {isLocating ? 'Localisation...' : 'Parking près de vous'}
                </motion.button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 1.2, type: "spring", bounce: 0.3 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-[12px] border-white/5">
                <img 
                  src="https://www.cimaise.fr/wp-content/uploads/2024/02/parking.jpg" 
                  alt="Parking Hero" 
                  className="w-full aspect-[3/2] object-cover scale-105 group-hover:scale-110 transition-transform duration-[2s]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
              </div>
              
              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 glass p-6 rounded-3xl shadow-premium z-20 hidden xl:block"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="h-8 w-8 rounded-full border-2 border-card" alt="user" />
                    ))}
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-black border-2 border-card">+2k</div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Utilisateurs actifs</span>
                </div>
              </motion.div>

              <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/20 rounded-full blur-[100px] opacity-20 animate-pulse" />
              <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary/20 rounded-full blur-[120px] opacity-20 animate-pulse delay-1000" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Project Section - Enhanced Content */}
      <section className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-[4rem] p-12 md:p-24 shadow-premium border border-white/5 relative overflow-hidden group"
        >
          <div className="relative z-10 flex flex-col gap-24">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="h-1.5 w-24 bg-gradient-to-r from-accent to-primary rounded-full" />
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-[0.9] font-display">
                    UNE SOLUTION <br />
                    <span className="text-accent underline decoration-accent/20 underline-offset-[12px]">INTELLIGENTE</span>
                  </h2>
                </div>
                
                <div className="space-y-10">
                  <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                    L’objectif principal est de résoudre le problème du manque de places de parking dans les zones urbaines en optimisant l’utilisation des espaces existants, qu'ils soient publics ou privés.
                  </p>
                  
                  <div className="grid gap-8">
                    {[
                      {
                        title: "1. Réservation intelligente",
                        desc: "Recherchez, localisez et réservez une place à proximité en quelques secondes avec des options flexibles (heure, journée, abonnement).",
                        icon: Search,
                        color: "bg-primary/10",
                        text: "text-primary"
                      },
                      {
                        title: "2. Monétisation des espaces",
                        desc: "Mettez en location vos espaces vacants et générez des revenus passifs tout en optimisant l'espace urbain.",
                        icon: Coins,
                        color: "bg-accent/10",
                        text: "text-accent"
                      },
                      {
                        title: "3. Accès automatisé",
                        desc: "Contrôle d'accès basé sur la vision artificielle (reconnaissance de plaques), RFID et QR codes pour une fluidité totale.",
                        icon: Cpu,
                        color: "bg-secondary/10",
                        text: "text-secondary"
                      }
                    ].map((pillar, i) => (
                      <div key={i} className="flex gap-6 p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-all group/card">
                        <div className={cn("h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center group-hover/card:scale-110 transition-transform", pillar.color, pillar.text)}>
                           <pillar.icon className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-black text-white text-lg uppercase tracking-tight">{pillar.title}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="relative space-y-12">
                <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl rotate-2 group-hover:rotate-0 transition-all duration-1000 border-4 border-white/10 scale-95 group-hover:scale-100">
                  <img 
                    src="https://media.istockphoto.com/id/1397038664/fr/photo/voitures-gar%C3%A9es-dans-un-garage-%C3%A0-plusieurs-%C3%A9tages.jpg?s=612x612&w=0&k=20&c=m2ORn2YE5KOcKvqmck8iBDcxFVJEYk71S26Fx5kJ9zI=" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" 
                    alt="DzToll Mission"
                  />
                </div>

                <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 space-y-6">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                    <Rocket className="h-6 w-6 text-accent" />
                    Cas d’usage & Vision
                  </h3>
                  <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      Optimisé pour les environnements à forte affluence : <span className="text-white font-bold">Universités, Entreprises et Administrations</span>.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                        Gestion optimisée des flux
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                        Accès automatisé sécurisé
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                        Suivi en temps réel de l’occupation
                      </li>
                    </ul>
                    <p className="pt-4 border-t border-white/5 italic">
                      "DzToll est au cœur des initiatives de smart city, combinant innovation technologique et économie collaborative."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>


      {/* Application Domains Section */}
      <section className="container mx-auto px-6">
        <div className="flex flex-col gap-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white font-display text-center">DOMAINES D'APPLICATION</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto font-medium">
              DzToll s'adapte à divers environnements utilisant des concepts de gestion intelligente et de contrôle d'accès automatisé.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { title: "Gestion Parkings", icon: Car, color: "text-blue-400" },
              { title: "Smart Campus", icon: GraduationCap, color: "text-emerald-400" },
              { title: "Péage Intelligent", icon: CreditCard, color: "text-amber-400" },
              { title: "Contrôle d'Accès", icon: Lock, color: "text-red-400" },
              { title: "Smart City", icon: Globe, color: "text-purple-400" }
            ].map((domain, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-card/50 backdrop-blur-sm border border-white/5 p-8 rounded-[2rem] flex flex-col items-center text-center gap-6 hover:bg-white/5 transition-all"
              >
                <div className={cn("h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center", domain.color)}>
                  <domain.icon className="h-8 w-8" />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-tight">{domain.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="container mx-auto px-6">
        <div className="flex flex-col gap-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-[10px] uppercase tracking-widest">
                <MapPin className="h-3 w-3" />
                 Alger Centre & Environs
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white font-display">ANNONCES À LA UNE</h2>
            </div>
            <Link to="/search" className="group flex items-center gap-3 text-sm font-black uppercase tracking-widest text-accent hover:text-white transition-colors">
              Explorer tout le catalogue
              <div className="h-10 w-10 rounded-full border border-accent/30 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoadingListings ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card rounded-[2.5rem] p-6 space-y-6 animate-pulse">
                  <div className="aspect-[4/3] bg-white/5 rounded-[2rem]" />
                  <div className="space-y-3">
                    <div className="h-6 bg-white/5 rounded-full w-3/4" />
                    <div className="h-4 bg-white/5 rounded-full w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              featuredListings.map((parking, i) => (
                <motion.div
                  key={parking.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => navigate(`/search?parkingId=${parking.id}`)}
                  className="group bg-card rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-primary/30 shadow-premium transition-all duration-500 cursor-pointer"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={parking.images?.[0] || 'https://www.metalstructure.dz/wp-content/uploads/2018/02/Parking2.jpg'}
                      alt={parking.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-4 right-4 glass px-4 py-2 rounded-2xl text-accent font-black text-xs">
                      {parking.pricePerHour} DA/h
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="space-y-2">
                       <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors">{parking.title}</h3>
                       <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="truncate">{parking.address}</span>
                       </div>
                    </div>
                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-1.5">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-white font-bold text-sm">4.9</span>
                          <span className="text-muted-foreground text-xs">(128 avis)</span>
                       </div>
                       <button className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:bg-primary transition-all">
                          <ArrowRight className="h-4 w-4" />
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
