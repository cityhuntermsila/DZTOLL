import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, Phone, ArrowRight, Github, Chrome } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function AuthPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const isSignup = searchParams.get('mode') === 'signup';
  const role = searchParams.get('role') || 'renter';

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulation
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="container mx-auto px-6 py-12 md:py-24 flex items-center justify-center min-h-[calc(100vh-5rem)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-sm bg-card border-2 border-primary/10 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />

        <div className="flex flex-col gap-2 text-center mb-6 relative z-10">
          <h1 className="text-2xl font-black tracking-tighter text-primary uppercase">
            {isSignup ? t('signup') : t('login')}
          </h1>
          <p className="text-xs text-muted-foreground font-medium">
            {isSignup ? "Rejoignez la communauté ParkHome" : "Heureux de vous revoir !"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary/70 px-1" htmlFor="email">{t('auth.email')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <input
                id="email"
                type="email"
                required
                placeholder="nom@exemple.com"
                className="w-full h-10 pl-10 pr-4 rounded-xl border-2 border-transparent bg-muted focus:border-primary focus:bg-white outline-none transition-all font-medium text-sm"
              />
            </div>
          </div>

          {isSignup && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary/70 px-1" htmlFor="phone">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                <input
                  id="phone"
                  type="tel"
                  placeholder="+33 6 00 00 00 00"
                  className="w-full h-10 pl-10 pr-4 rounded-xl border-2 border-transparent bg-muted focus:border-primary focus:bg-white outline-none transition-all font-medium text-sm"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary/70" htmlFor="password">{t('auth.password')}</label>
              {!isSignup && (
                <Link to="/forgot-password" title="Mot de passe oublié ?" className="text-[10px] text-accent font-bold hover:underline">
                  Oublié ?
                </Link>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full h-10 pl-10 pr-4 rounded-xl border-2 border-transparent bg-muted focus:border-primary focus:bg-white outline-none transition-all font-medium text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full bg-accent text-white rounded-xl font-black uppercase tracking-widest hover:bg-accent/90 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 shadow-xl shadow-accent/20 text-xs"
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isSignup ? t('signup') : t('login')}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t-2 border-muted" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
            <span className="bg-card px-3 text-muted-foreground">Ou</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 relative z-10">
          <button className="h-10 flex items-center justify-center gap-2 rounded-xl border-2 border-muted bg-card hover:border-primary transition-all font-bold text-xs">
            <Chrome className="h-4 w-4 text-primary" />
            Google
          </button>
          <button className="h-10 flex items-center justify-center gap-2 rounded-xl border-2 border-muted bg-card hover:border-primary transition-all font-bold text-xs">
            <Github className="h-4 w-4 text-primary" />
            GitHub
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 font-medium">
          {isSignup ? t('auth.have_account') : t('auth.no_account')}
          <Link
            to={isSignup ? "/login" : "/signup"}
            className="ml-2 text-primary font-black uppercase tracking-widest hover:underline"
          >
            {isSignup ? t('login') : t('signup')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
