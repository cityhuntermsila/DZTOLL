import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { LogIn, UserPlus, MapPin, LayoutDashboard, LogOut, Globe, Moon, Sun, CreditCard, Scan, Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isRTL]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'fr' ? 'ar' : 'fr');
  };

  const navItems = [
    { name: t('find_parking'), path: '/search?lat=36.0731&lng=4.7611', icon: MapPin },
    { name: 'Tester notre IA', path: '/plate-test', icon: Scan },
    { name: 'Abonnements', path: '/subscriptions', icon: CreditCard },
    { name: t('list_parking'), path: '/owner/new', icon: LayoutDashboard },
  ];

  return (
    <div className={cn("min-h-screen bg-background text-foreground font-sans", isRTL && "font-arabic")}>
      <header className="sticky top-0 z-50 w-full glass h-16 sm:h-20 flex items-center shadow-premium">
        <div className="container mx-auto flex items-center justify-between px-6">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="inline-block font-black text-2xl tracking-tighter text-white group-hover:scale-105 transition-transform italic uppercase">Dz<span className="text-primary">Toll</span></span>
            </Link>
            <nav className="hidden lg:flex gap-10">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative flex items-center text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-white py-2 group/nav",
                    location.pathname === item.path ? "text-white" : "text-muted-foreground"
                  )}
                >
                  {item.name}
                  <span className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                    location.pathname === item.path ? "w-full" : "w-0 group-hover/nav:w-1/2"
                  )} />
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={toggleLanguage}
                className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                aria-label="Toggle language"
              >
                <Globe className="h-4 w-4 text-primary group-hover:rotate-12 transition-transform" />
              </button>
              <Link to="/login">
                <button className="h-10 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-all">
                  {t('login')}
                </button>
              </Link>
              <Link to="/signup">
                <button className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 hover:shadow-primary/40 active:scale-95 transition-all">
                  {t('signup')}
                </button>
              </Link>
            </div>
            {/* Hamburger Menu Icon */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-10 w-10 rounded-xl lg:hidden flex items-center justify-center hover:bg-white/5 border border-white/5 transition-all"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-primary" />
              ) : (
                <Menu className="h-5 w-5 text-primary" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute top-full left-0 w-full glass shadow-premium overflow-hidden"
            >
              <div className="container mx-auto px-6 py-12 flex flex-col gap-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center justify-between p-6 rounded-3xl transition-all border border-transparent shadow-sm hover:shadow-xl",
                      location.pathname === item.path ? "bg-white/10 border-white/10 text-white" : "text-muted-foreground hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-6">
                      <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", location.pathname === item.path ? "bg-primary text-white" : "bg-white/5")}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-[0.2em]">{item.name}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 opacity-30" />
                  </Link>
                ))}
                <div className="pt-8 flex flex-col gap-4 border-t border-white/5 md:hidden">
                  <Link to="/login" className="w-full">
                    <button className="w-full h-14 rounded-2xl text-xs font-black uppercase tracking-widest text-white border border-white/10 hover:bg-white/5 transition-all">
                      {t('login')}
                    </button>
                  </Link>
                  <Link to="/signup" className="w-full">
                    <button className="w-full h-14 rounded-2xl text-xs font-black uppercase tracking-widest bg-primary text-white shadow-xl shadow-primary/20 transition-all active:scale-95">
                      {t('signup')}
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
