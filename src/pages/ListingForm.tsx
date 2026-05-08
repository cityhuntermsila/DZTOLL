import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, Camera, Info, DollarSign, Clock, CheckCircle2, Navigation } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

const listingSchema = z.object({
  title: z.string().min(5, "Le titre doit faire au moins 5 caractères"),
  description: z.string().min(20, "La description doit faire au moins 20 caractères"),
  address: z.string().min(5, "L'adresse est requise"),
  type: z.enum(['garage', 'private_spot', 'reserved_space', 'toll_badge']),
  pricePerHour: z.number().min(10, "Le prix minimum est de 10 DA"),
  pricePerDay: z.number().min(100, "Le prix minimum est de 100 DA"),
});

type ListingFormValues = z.infer<typeof listingSchema>;

export default function ListingForm() {
  const navigate = useNavigate();
  const [isLocating, setIsLocating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      type: 'private_spot',
      pricePerHour: 100,
      pricePerDay: 800,
    }
  });

  const handleUseLocation = () => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Reverse geocoding using Nominatim (free OSM service)
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            if (data.display_name) {
              setValue('address', data.display_name);
            } else {
              setValue('address', `${latitude}, ${longitude}`);
            }
          } catch (error) {
            console.error("Reverse geocoding error:", error);
            setValue('address', `${latitude}, ${longitude}`);
          } finally {
            setIsLocating(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsLocating(false);
        }
      );
    }
  };

  const onSubmit = (data: ListingFormValues) => {
    console.log(data);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl min-h-[60vh] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border-4 border-muted p-8 rounded-[2.5rem] shadow-2xl text-center space-y-6 max-w-sm"
        >
          <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-green-500/20">
            <CheckCircle2 size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black text-primary tracking-tight uppercase">Annonce Publiée !</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
              Votre parking est maintenant visible par des milliers de conducteurs en Algérie.
            </p>
          </div>
          <button 
            onClick={() => navigate('/owner')}
            className="w-full h-10 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-lg shadow-primary/20"
          >
            Aller au tableau de bord
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-primary">Créer une Annonce</h1>
          <p className="text-xs text-muted-foreground">Remplissez les détails de votre parking pour commencer à gagner de l'argent.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 bg-card border rounded-2xl p-6 shadow-sm">
          {/* Section: Photos */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold flex items-center gap-2 text-primary">
              <Camera className="h-4 w-4 text-primary" />
              Photos du parking
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 hover:bg-muted transition-all cursor-pointer">
                <PlusIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-[10px] font-medium text-muted-foreground">Ajouter</span>
              </div>
              {[
                'https://www.metalstructure.dz/wp-content/uploads/2018/02/Parking2.jpg',
                'https://aeroportalger.dz/assets/images/header/parking_to.jpg',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXXe5jlPsYLOPwjw4cCHo3t2kO0QRved-cnw&s'
              ].map((src, i) => (
                <div key={i} className="aspect-square rounded-xl bg-muted overflow-hidden relative group">
                  <img src={src} alt="parking" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" className="text-white text-[10px] font-bold underline">Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Details */}
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-bold flex items-center gap-2 text-primary">
              <Info className="h-4 w-4 text-primary" />
              Informations générales
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-primary">Titre de l'annonce</label>
                <input
                  {...register('title')}
                  placeholder="Ex: Garage sécurisé proche du métro"
                  className={cn(
                    "h-9 px-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-xs",
                    errors.title && "border-destructive"
                  )}
                />
                {errors.title && <span className="text-[10px] text-destructive">{errors.title.message}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-primary">Adresse précise</label>
                  <button
                    type="button"
                    onClick={handleUseLocation}
                    disabled={isLocating}
                    className="flex items-center gap-1 text-[10px] font-bold text-secondary hover:text-secondary/80 transition-all disabled:opacity-50"
                  >
                    <Navigation className={cn("h-3 w-3", isLocating && "animate-pulse")} />
                    {isLocating ? "Localisation..." : "Ma position"}
                  </button>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    {...register('address')}
                    placeholder="Rue Didouche Mourad, Alger"
                    className={cn(
                      "w-full h-9 pl-8 pr-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-xs",
                      errors.address && "border-destructive"
                    )}
                  />
                </div>
                {errors.address && <span className="text-[10px] text-destructive">{errors.address.message}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-primary">Description</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  placeholder="Décrivez l'accès, la sécurité, les dimensions..."
                  className={cn(
                    "p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none transition-all resize-none text-xs",
                    errors.description && "border-destructive"
                  )}
                />
                {errors.description && <span className="text-[10px] text-destructive">{errors.description.message}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-primary">Type de parking</label>
                <select
                  {...register('type')}
                  className="h-9 px-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-xs"
                >
                  <option value="garage">Garage / Box</option>
                  <option value="private_spot">Parking privé</option>
                  <option value="reserved_space">Espace réservé</option>
                  <option value="toll_badge">Badge Péage / Service</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Pricing */}
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-bold flex items-center gap-2 text-primary">
              <DollarSign className="h-4 w-4 text-primary" />
              Tarification flexible
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-primary">Prix par heure (DA)</label>
                <div className="relative">
                  <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="number"
                    step="0.1"
                    {...register('pricePerHour', { valueAsNumber: true })}
                    className="w-full h-9 pl-8 pr-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-xs"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-primary">Prix par jour (DA)</label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="number"
                    step="1"
                    {...register('pricePerDay', { valueAsNumber: true })}
                    className="w-full h-9 pl-8 pr-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="h-10 w-full bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-primary/20"
          >
            <CheckCircle2 className="h-4 w-4" />
            Publier l'annonce
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
