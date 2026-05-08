import React from 'react';
import { motion } from 'motion/react';
import { Car, CreditCard, ArrowRight, Shield, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SubscriptionPage = () => {
  const navigate = useNavigate();

  const options = [
    {
      id: 'parking',
      title: 'Abonnement Parking',
      description: 'Accès illimité à nos places de parking privées et sécurisées dans toute l\'Algérie.',
      icon: Car,
      color: 'bg-primary',
      textColor: 'text-primary',
      path: '/subscriptions/checkout?type=parking',
      features: ['Accès 24/7', 'Places garanties', 'Assurance incluse']
    },
    {
      id: 'toll',
      title: 'Abonnement Péage',
      description: 'Péage intelligent et télépéage : Ceci est une simulation d\'une future ouverture des systémes de péages en Algérie. Passez les barrières de péage A1/A2 sans attente avec nos badges télépéage.',
      icon: CreditCard,
      color: 'bg-secondary',
      textColor: 'text-secondary',
      path: '/subscriptions/checkout?type=toll',
      features: ['Voies réservées T', 'Crédit rechargeable', 'Facturation mensuelle']
    }
  ];

  return (
    <div className="min-h-screen pt-10 pb-6 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <h1 className="text-4xl font-black text-foreground tracking-tighter mb-4 uppercase">
            Choisissez votre <span className="text-accent italic">Abonnement</span>
          </h1>
          <p className="text-muted-foreground font-medium max-w-xl mx-auto">
            Optimisez vos trajets quotidiens avec nos forfaits sur mesure pour le stationnement et les autoroutes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(option.path)}
              className="group cursor-pointer bg-card border-4 border-muted p-4 hover:border-accent hover:shadow-[8px_8px_0px_0px_var(--color-accent)] transition-all relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${option.color} opacity-10 -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform`} />
              
              <div className={`${option.color} text-background w-12 h-12 flex items-center justify-center rounded-xl mb-2 shadow-lg shadow-white/5`}>
                <option.icon size={24} />
              </div>

              <h2 className="text-2xl font-black text-foreground mb-2 flex items-center gap-2">
                {option.title}
                <ArrowRight className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all text-accent" size={20} />
              </h2>

              <p className="text-muted-foreground font-medium mb-4 text-sm">
                {option.description}
              </p>

              <ul className="space-y-2 mb-4">
                {option.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-bold text-foreground/80">
                    <div className={`w-5 h-5 rounded-full ${option.color} text-background flex items-center justify-center text-[10px]`}>
                      ✓
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 ${option.color} text-background font-black uppercase tracking-widest text-xs group-hover:bg-accent transition-colors`}>
                Voir les forfaits
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 text-center"
        >
          <div className="p-3 bg-card rounded-2xl border-2 border-muted">
            <Zap className="mx-auto mb-1 text-accent" size={32} />
            <h3 className="font-black text-foreground uppercase text-[10px] tracking-widest mb-1">Activation Rapide</h3>
            <p className="text-[10px] text-muted-foreground">Badge prêt en 24h</p>
          </div>
          <div className="p-3 bg-card rounded-2xl border-2 border-muted">
            <Shield className="mx-auto mb-1 text-primary" size={32} />
            <h3 className="font-black text-foreground uppercase text-[10px] tracking-widest mb-1">Sans Engagement</h3>
            <p className="text-[10px] text-muted-foreground">Annulez à tout moment</p>
          </div>
          <div className="p-3 bg-card rounded-2xl border-2 border-muted">
            <Clock className="mx-auto mb-1 text-secondary" size={32} />
            <h3 className="font-black text-foreground uppercase text-[10px] tracking-widest mb-1">Support 24/7</h3>
            <p className="text-[10px] text-muted-foreground">Assistance prioritaire</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
