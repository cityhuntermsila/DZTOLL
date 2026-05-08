import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Plus, Calendar, DollarSign, Users, TrendingUp, QrCode, Settings, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function OwnerDashboard() {
  const { t } = useTranslation();

  const stats = [
    { label: 'Revenus (Mars)', value: '1,240€', icon: DollarSign, trend: '+12%', color: 'bg-primary/10 text-primary' },
    { label: 'Réservations', value: '48', icon: Calendar, trend: '+5%', color: 'bg-secondary/10 text-secondary' },
    { label: 'Taux d\'occupation', value: '82%', icon: TrendingUp, trend: '+3%', color: 'bg-accent/10 text-accent' },
    { label: 'Nouveaux clients', value: '12', icon: Users, trend: '+8%', color: 'bg-muted text-muted-foreground' },
  ];

  const recentBookings = [
    { id: '1', user: 'Jean D.', spot: 'Garage Centre', date: '25 Mars', time: '14:00 - 18:00', amount: '24€', status: 'Confirmé' },
    { id: '2', user: 'Marie L.', spot: 'Place Gare', date: '26 Mars', time: '08:00 - 12:00', amount: '18€', status: 'En attente' },
    { id: '3', user: 'Paul B.', spot: 'Box Résidence', date: '27 Mars', time: 'Journée entière', amount: '45€', status: 'Confirmé' },
  ];

  return (
    <div className="container mx-auto px-6 py-12 flex flex-col gap-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-primary uppercase">Tableau de Bord</h1>
          <p className="text-muted-foreground font-medium text-base">Gérez vos revenus et vos réservations en un coup d'œil.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-10 px-6 rounded-xl border-2 border-muted bg-card hover:border-primary transition-all flex items-center gap-2 font-bold text-xs">
            <Bell className="h-4 w-4 text-primary" />
            Notifications
          </button>
          <Link to="/owner/new">
            <button className="h-10 px-6 rounded-xl bg-primary text-white font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-primary/20 text-xs">
              <Plus className="h-4 w-4" />
              Nouvelle Annonce
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-[1.5rem] bg-card border-2 border-transparent hover:border-primary shadow-sm hover:shadow-2xl transition-all flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div className={cn("p-3 rounded-xl", stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 uppercase tracking-widest">
                {stat.trend}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
              <span className="text-2xl font-black text-primary">{stat.value}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-primary uppercase tracking-tight">Réservations Récentes</h2>
            <button className="text-xs text-accent font-black uppercase tracking-widest hover:underline">Voir tout</button>
          </div>
          <div className="border-2 border-muted rounded-[1.5rem] overflow-hidden bg-card shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b-2 border-muted">
                  <th className="p-4 font-black text-[10px] uppercase tracking-widest text-primary/60">Client</th>
                  <th className="p-4 font-black text-[10px] uppercase tracking-widest text-primary/60">Place</th>
                  <th className="p-4 font-black text-[10px] uppercase tracking-widest text-primary/60">Date & Heure</th>
                  <th className="p-4 font-black text-[10px] uppercase tracking-widest text-primary/60">Montant</th>
                  <th className="p-4 font-black text-[10px] uppercase tracking-widest text-primary/60">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b-2 border-muted last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-xs font-bold text-primary">{booking.user}</td>
                    <td className="p-4 text-xs font-medium">{booking.spot}</td>
                    <td className="p-4 text-xs">
                      <div className="flex flex-col">
                        <span className="font-bold">{booking.date}</span>
                        <span className="text-[10px] text-muted-foreground font-medium">{booking.time}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-black text-accent">{booking.amount}</td>
                    <td className="p-4 text-xs">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                        booking.status === 'Confirmé' ? "bg-secondary/10 text-secondary" : "bg-accent/10 text-accent"
                      )}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Access */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-black text-primary uppercase tracking-tight">Accès Rapide</h2>
          <div className="flex flex-col gap-4">
            <div className="p-5 rounded-[1.5rem] bg-card border-2 border-transparent hover:border-primary shadow-sm hover:shadow-2xl transition-all flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <QrCode className="h-5 w-5 text-secondary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-primary text-sm">QR Code d'Accès</span>
                  <span className="text-[10px] text-muted-foreground font-medium">Générez un code pour vos clients.</span>
                </div>
              </div>
              <div className="aspect-square bg-muted rounded-2xl flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                <span className="text-muted-foreground italic font-medium text-xs">[ QR Code Generator ]</span>
              </div>
              <button className="w-full h-10 bg-accent text-white rounded-xl font-black uppercase tracking-widest hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 text-xs">
                Générer un code
              </button>
            </div>

            <div className="p-5 rounded-[1.5rem] bg-card border-2 border-muted shadow-sm flex flex-col gap-4">
              <h3 className="font-black text-primary uppercase tracking-widest text-[10px]">Paramètres</h3>
              <div className="flex flex-col gap-2">
                <button className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-all text-xs font-bold text-primary">
                  <span>Modifier les tarifs</span>
                  <Settings className="h-4 w-4 text-accent" />
                </button>
                <button className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-all text-xs font-bold text-primary">
                  <span>Gérer le calendrier</span>
                  <Calendar className="h-4 w-4 text-accent" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
