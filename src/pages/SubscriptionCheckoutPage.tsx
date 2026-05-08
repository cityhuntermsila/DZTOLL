import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Shield, CreditCard, Car, Check, ArrowLeft, Info, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { formatCurrency } from '../lib/pricing';

const SubscriptionCheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const type = searchParams.get('type') || 'parking';

  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [tripsCount, setTripsCount] = useState(20);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    plateNumber: '',
    paymentMethod: 'edahabia'
  });

  const basePricePerTrip = 20;

  const getPlanMultiplier = (planId: string) => {
    switch (planId) {
      case 'annuel': return 10; // 10 months price for a year
      case 'weekly': return 0.3; // Roughly a quarter
      default: return 1;
    }
  };

  const plans = type === 'toll' ? [
    { id: 'weekly', name: 'Hebdomadaire', features: ['Voies T réservées', 'Validité 7 jours'] },
    { id: 'monthly', name: 'Mensuel', features: ['Voies T illimitées', 'Badge offert'] },
    { id: 'annual', name: 'Annuel', features: ['Tout illimité', '2 mois offerts'] }
  ] : [
    { id: 'weekly', name: 'Hebdomadaire', price: 2500, period: 'semaine', features: ['Place garantie'] },
    { id: 'monthly', name: 'Mensuel', price: 8000, period: 'mois', features: ['Accès 24/7', 'Assurance'] },
    { id: 'annual', name: 'Annuel', price: 80000, period: 'an', features: ['VIP Service', '2 mois offerts'] }
  ];

  const calculateFinalPrice = () => {
    let price = 0;
    if (type === 'toll') {
      const base = tripsCount * basePricePerTrip;
      const multiplier = getPlanMultiplier(selectedPlan);
      price = Math.round(base * multiplier);
    } else {
      price = (plans as any[]).find(p => p.id === selectedPlan)?.price || 0;
    }
    return Math.round(price * 0.9);
  };

  const finalPrice = calculateFinalPrice();

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm bg-card border-4 border-muted p-8 rounded-[2.5rem] shadow-2xl text-center space-y-6"
        >
          <div className="h-20 w-20 bg-green-500 rounded-full flex items-center justify-center text-background mx-auto shadow-xl shadow-green-500/20">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-foreground tracking-tight uppercase">Confirmé !</h1>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider leading-relaxed">
              Votre abonnement est actif. Bienvenue chez DzToll Algérie.
            </p>
          </div>
          <div className="bg-muted p-4 rounded-2xl flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-muted-foreground">Total Payé</span>
            <span className="text-lg font-black text-primary">{formatCurrency(finalPrice)}</span>
          </div>
          <button 
            onClick={() => navigate('/history')}
            className="w-full h-12 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg shadow-primary/20"
          >
            Voir mon historique
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-4 pb-12 px-4 bg-background">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
        
        {/* Left Side: Form */}
        <div className="lg:col-span-2 space-y-6">
          <button 
            onClick={() => navigate('/subscriptions')}
            className="flex items-center gap-2 text-muted-foreground font-black text-[10px] uppercase tracking-widest hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} />
            Retour
          </button>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border-4 border-muted p-6 rounded-3xl shadow-xl"
          >
            <h1 className="text-2xl font-black text-foreground tracking-tight mb-6 uppercase">
              Finaliser mon <span className="text-accent italic">Abonnement</span>
            </h1>

            {type === 'toll' && (
              <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-orange-600 leading-relaxed">
                  Péage intelligent et télépéage : Ceci est une simulation d'une future ouverture des systémes de péages en Algérie.
                </p>
              </div>
            )}

            <form onSubmit={handleConfirm} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Nom</label>
                  <input 
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Ex: Ahmed Benali"
                    className="w-full h-10 px-4 bg-background border border-muted focus:border-primary outline-none transition-all font-bold text-sm text-foreground rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Email</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="ahmed@example.com"
                    className="w-full h-10 px-4 bg-background border border-muted focus:border-primary outline-none transition-all font-bold text-sm text-foreground rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Plaque (Optionnel)</label>
                <input 
                  type="text"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({...formData, plateNumber: e.target.value})}
                  placeholder="Ex: 00123-116-16"
                  className="w-full h-10 px-4 bg-background border border-muted focus:border-primary outline-none transition-all font-bold text-sm text-foreground rounded-lg"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Paiement</label>
                <div className="grid grid-cols-2 gap-3">
                  {['edahabia', 'cib'].map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setFormData({...formData, paymentMethod: method})}
                      className={cn(
                        "h-12 flex items-center justify-between px-4 border rounded-xl font-black uppercase text-[10px] tracking-widest transition-all",
                        formData.paymentMethod === method 
                          ? "border-primary bg-primary/10 text-primary" 
                          : "border-muted text-muted-foreground hover:border-accent"
                      )}
                    >
                      {method}
                      {formData.paymentMethod === method && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full h-12 bg-accent text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-transform shadow-lg shadow-accent/20"
                >
                  Confirmer et Payer
                </button>
              </div>
            </form>
          </motion.div>

          <div className="flex items-start gap-4 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
            <Info className="text-primary mt-1 shrink-0" size={16} />
            <p className="text-[9px] font-bold text-muted-foreground leading-relaxed uppercase tracking-wider">
              Vos données sont sécurisées. Vous pourrez annuler votre abonnement à tout moment.
            </p>
          </div>
        </div>

        {/* Right Side: Plan Selection & Summary */}
        <div className="space-y-6">
          <div className="bg-card text-foreground p-6 rounded-3xl border-4 border-muted sticky top-24 shadow-xl">
            <h2 className="text-lg font-black mb-6 uppercase flex items-center gap-2 tracking-tight">
              <CreditCard size={18} className="text-accent" />
              Plan
            </h2>

            <div className="space-y-3 mb-6">
              {type === 'toll' && (
                <div className="mb-4 p-4 bg-background border border-muted rounded-2xl">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-3 text-center">
                    Trajets
                  </label>
                  <div className="flex items-center justify-between gap-4">
                    <button 
                      type="button"
                      onClick={() => setTripsCount(Math.max(10, tripsCount - 10))}
                      className="w-8 h-8 flex items-center justify-center border border-muted rounded-lg font-black hover:border-accent transition-all text-foreground"
                    >-</button>
                    <div className="text-center">
                      <span className="text-xl font-black text-foreground">{tripsCount}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setTripsCount(tripsCount + 10)}
                      className="w-8 h-8 flex items-center justify-center border border-muted rounded-lg font-black hover:border-accent transition-all text-foreground"
                    >+</button>
                  </div>
                </div>
              )}

              {plans.map((plan) => {
                const originalPrice = type === 'toll' 
                  ? Math.round(getPlanMultiplier(plan.id) * tripsCount * basePricePerTrip)
                  : (plan as any).price;
                const discountedPrice = Math.round(originalPrice * 0.9);

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={cn(
                      "w-full p-3 border rounded-2xl flex flex-col items-start gap-0.5 transition-all text-left",
                      selectedPlan === plan.id 
                        ? "border-accent bg-accent/5 ring-2 ring-accent/20" 
                        : "border-muted hover:border-muted-foreground"
                    )}
                  >
                    <div className="flex justify-between w-full items-center">
                      <span className="font-black uppercase text-[9px] tracking-widest">{plan.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="bg-red-500 text-white text-[8px] px-1 rounded font-black">-10%</span>
                        {selectedPlan === plan.id && <Check size={12} className="text-accent" />}
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black">{formatCurrency(discountedPrice)}</span>
                      <span className="text-[10px] line-through opacity-40 font-bold">{formatCurrency(originalPrice)}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-muted pt-6 space-y-4">
              <div className="pt-2 flex justify-between items-end">
                <span className="text-[9px] font-black uppercase opacity-60 text-muted-foreground tracking-widest">Total</span>
                <span className="text-2xl font-black text-accent tracking-tighter">
                  {formatCurrency(finalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SubscriptionCheckoutPage;
