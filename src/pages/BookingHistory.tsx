import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, MessageSquare, Star, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

export default function BookingHistory() {
  const { t } = useTranslation();

  const bookings = [
    {
      id: '1',
      title: 'Garage Centre Ville',
      address: '12 Rue de la Paix, Paris',
      date: '25 Mars 2026',
      time: '14:00 - 18:00',
      price: '24€',
      status: 'Confirmé',
      image: 'https://www.metalstructure.dz/wp-content/uploads/2018/02/Parking2.jpg',
    },
    {
      id: '2',
      title: 'Place privée - Gare',
      address: '5 Avenue Foch, Lyon',
      date: '12 Mars 2026',
      time: '08:00 - 12:00',
      price: '18€',
      status: 'Terminé',
      image: 'https://aeroportalger.dz/assets/images/header/parking_to.jpg',
    },
    {
      id: '3',
      title: 'Box Résidence',
      address: '8 Blvd Victor Hugo, Nice',
      date: '05 Mars 2026',
      time: 'Journée entière',
      price: '45€',
      status: 'Terminé',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXXe5jlPsYLOPwjw4cCHo3t2kO0QRved-cnw&s',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-primary">Historique des Réservations</h1>
        <p className="text-xs text-muted-foreground">Retrouvez toutes vos réservations passées et à venir.</p>
      </div>

      <div className="flex flex-col gap-3">
        {bookings.map((booking, i) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-card border rounded-2xl p-3 md:p-4 flex flex-col md:flex-row items-center gap-4 hover:shadow-lg transition-all"
          >
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl overflow-hidden flex-shrink-0">
              <img src={booking.image} alt={booking.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 flex flex-col gap-1.5 w-full">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-primary">{booking.title}</h3>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold",
                  booking.status === 'Confirmé' ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"
                )}>
                  {booking.status}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" /> {booking.address}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" /> {booking.date}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" /> {booking.time}
                </div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="font-bold text-base text-primary">{booking.price}</span>
                <div className="flex items-center gap-1.5">
                  <Link to="/chat">
                    <button className="h-8 px-3 rounded-lg border bg-background hover:bg-muted transition-all flex items-center gap-1.5 text-[10px] font-medium">
                      <MessageSquare className="h-3 w-3" /> Chat
                    </button>
                  </Link>
                  {booking.status === 'Terminé' && (
                    <button className="h-8 px-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-1.5 text-[10px] font-medium">
                      <Star className="h-3 w-3" /> Noter
                    </button>
                  )}
                  <button className="h-8 w-8 rounded-lg border bg-background hover:bg-muted transition-all flex items-center justify-center">
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
