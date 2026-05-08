import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, Shield, Bell, Globe, Moon, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function ProfilePage() {
  const { t, i18n } = useTranslation();

  const settings = [
    { icon: User, label: 'Informations personnelles', value: 'Mohamed Amine' },
    { icon: Mail, label: 'Email', value: 'amine.m@exemple.dz' },
    { icon: Phone, label: 'Téléphone', value: '+213 5 12 34 56 78' },
    { icon: Shield, label: 'Sécurité', value: 'Mot de passe, 2FA' },
  ];

  const preferences = [
    { icon: Bell, label: 'Notifications', value: 'Activées' },
    { icon: Globe, label: 'Langue', value: i18n.language === 'fr' ? 'Français' : 'Arabe' },
    { icon: Moon, label: 'Mode sombre', value: 'Désactivé' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-md flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center relative group">
          <User className="h-8 w-8 text-primary" />
          <button className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-2 border-background hover:scale-110 transition-transform">
            <Globe className="h-3 w-3" />
          </button>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-primary">Mohamed Amine</h1>
          <span className="text-[10px] text-muted-foreground">Membre depuis Janvier 2024</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <section className="flex flex-col gap-2">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-4">Mon Compte</h2>
          <div className="bg-card border rounded-2xl overflow-hidden">
            {settings.map((item, i) => (
              <button
                key={i}
                className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-all border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium">{item.label}</span>
                    <span className="text-[10px] text-muted-foreground">{item.value}</span>
                  </div>
                </div>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-4">Préférences</h2>
          <div className="bg-card border rounded-2xl overflow-hidden">
            {preferences.map((item, i) => (
              <button
                key={i}
                className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-all border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium">{item.label}</span>
                    <span className="text-[10px] text-muted-foreground">{item.value}</span>
                  </div>
                </div>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>

        <button className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border border-destructive/20 text-destructive font-bold hover:bg-destructive/10 transition-all text-xs">
          <LogOut className="h-4 w-4" />
          {t('logout', 'Déconnexion')}
        </button>
      </div>
    </div>
  );
}
