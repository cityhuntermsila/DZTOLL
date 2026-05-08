import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, Star, Clock, Car, Info, Navigation, X, Calendar, MessageSquare, ShieldCheck, CreditCard } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { calculateBookingPrice, formatCurrency } from '../lib/pricing';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { cn } from '@/src/lib/utils';
import { api } from '@/src/services/api';
import { ParkingListing } from '@/src/types';

// Fix for Leaflet default icon issue
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const UserIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function SearchPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<'list' | 'map'>('list');
  const [listings, setListings] = useState<ParkingListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initial location from URL or default BBA, Algeria
  const initialLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : 36.0731;
  const initialLng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : 4.7611;

  const [userLocation, setUserLocation] = useState<[number, number]>([initialLat, initialLng]);
  const [hasLocation, setHasLocation] = useState(!!searchParams.get('lat'));

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>('BBA');
  const [selectedParking, setSelectedParking] = useState<ParkingListing | null>(null);
  const [activeParking, setActiveParking] = useState<ParkingListing | null>(null);
  const [bookingHours, setBookingHours] = useState(1);
  const [bookingStep, setBookingStep] = useState<'details' | 'info' | 'success'>('details');
  const [userInfo, setUserInfo] = useState({ name: '', phone: '', vehicle: '' });
  const navigate = useNavigate();

  const cities = ['Toutes', 'Alger', 'Oran', 'Constantine', 'Sétif', 'Djelfa', 'Béjaïa', 'Boumerdes', 'Blida', 'BBA'];
  const parkingTypes = [
    { id: 'private_spot', label: 'Parking Privées' },
    { id: 'garage', label: 'Garages' },
    { id: 'garden_spot', label: 'Parking Mall' },
    { id: 'toll_badge', label: 'Péages' }
  ];

  const [selectedType, setSelectedType] = useState('private_spot');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await api.getListings();
        setListings(data);
        
        const typeParam = searchParams.get('type');
        if (typeParam) {
          setSelectedType(typeParam);
        }

        const latParam = searchParams.get('lat');
        const lngParam = searchParams.get('lng');

        // Find nearest city if coordinates provided
        if (latParam && lngParam) {
          const lat = parseFloat(latParam);
          const lng = parseFloat(lngParam);
          
          const cityCoords: Record<string, [number, number]> = {
            'Alger': [36.7525, 3.0420],
            'Oran': [35.6971, -0.6308],
            'Constantine': [36.3650, 6.6147],
            'Setif': [36.1898, 5.4108],
            'Djelfa': [34.6727, 3.2630],
            'Bejaia': [36.7515, 5.0557],
            'Boumerdes': [36.7597, 3.4739],
            'Blida': [36.4701, 2.8288],
            'BBA': [36.0731, 4.7611]
          };

          let nearest = 'Alger';
          let minDistance = Infinity;
          
          for (const [city, coords] of Object.entries(cityCoords)) {
            const distance = Math.sqrt(Math.pow(lat - coords[0], 2) + Math.pow(lng - coords[1], 2));
            if (distance < minDistance) {
              minDistance = distance;
              nearest = city;
            }
          }
          
          if (minDistance < 0.2) {
            setSelectedCity(nearest);
          } else {
            // If not near any city, default to BBA as requested
            setSelectedCity('BBA');
            setUserLocation([36.0731, 4.7611]);
          }
        } else {
          // No params, ensure BBA is selected
          setSelectedCity('BBA');
          setUserLocation([36.0731, 4.7611]);
        }
        // Handle parkingId from URL
        const parkingIdParam = searchParams.get('parkingId');
        if (parkingIdParam) {
          const p = data.find(item => item.id === parkingIdParam);
          if (p) {
            setSelectedParking(p);
            if (p.location) {
              setUserLocation([p.location.lat, p.location.lng]);
              setHasLocation(true);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, [searchParams]);

  const filteredListings = listings.filter(listing => {
    const isToll = listing.type === 'toll_badge';
    const matchesQuery = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         listing.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    // For tolls, we don't care about the city filter if selectedType is toll_badge
    // because tolls are predefined trajets.
    const matchesCity = isToll || !selectedCity || selectedCity === 'Toutes' ||
                        listing.address.toLowerCase().includes(selectedCity.toLowerCase()) ||
                        (selectedCity === 'BBA' && listing.address.toLowerCase().includes('bordj bou arreridj'));
    
    const matchesType = listing.type === selectedType;
    
    return matchesQuery && matchesCity && matchesType;
  });

  // If no results for the selected city, fall back to showing all listings of that type
  const displayListings = filteredListings.length > 0 ? filteredListings : listings.filter(listing => {
    const matchesQuery = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         listing.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = listing.type === selectedType;
    return matchesQuery && matchesType;
  });

  const isShowingFallback = filteredListings.length === 0 && listings.length > 0 && selectedCity !== 'Toutes' && selectedCity !== null;

  const handleCityClick = (city: string) => {
    if (city === 'Toutes') {
      setSelectedCity(null);
      return;
    }
    const newCity = selectedCity === city ? null : city;
    setSelectedCity(newCity);
    
    // Center map on city if selected
    const cityCoords: Record<string, [number, number]> = {
      'Alger': [36.7525, 3.0420],
      'Oran': [35.6971, -0.6308],
      'Constantine': [36.3650, 6.6147],
      'Setif': [36.1898, 5.4108],
      'Djelfa': [34.6727, 3.2630],
      'Bejaia': [36.7515, 5.0557],
      'Boumerdes': [36.7597, 3.4739],
      'Blida': [36.4701, 2.8288],
      'BBA': [36.0731, 4.7611]
    };
    
    if (newCity && cityCoords[newCity]) {
      setUserLocation(cityCoords[newCity]);
      setHasLocation(true);
    }
  };

  const handleRecenter = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setHasLocation(true);
        }
      );
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Search Header */}
      <div className="border-b bg-background p-3 md:px-6 flex flex-col md:flex-row items-center gap-3">
        {selectedType !== 'toll_badge' && (
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-full border bg-muted focus:ring-2 focus:ring-primary outline-none text-xs"
            />
          </div>
        )}
        
        {/* Type Quick Filters */}
        <div className="flex flex-col gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            {parkingTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={cn(
                  "whitespace-nowrap h-9 px-5 rounded-xl border-2 text-[11px] font-black uppercase tracking-widest transition-all relative overflow-hidden group",
                  selectedType === type.id 
                    ? "bg-accent text-white border-accent shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-y-[-2px] translate-x-[-1px]" 
                    : "bg-background hover:border-accent/50 text-muted-foreground border-muted hover:shadow-lg active:translate-y-0"
                )}
              >
                {type.label}
              </button>
            ))}
          </div>
          
            {/* City Selection (Hidden for tolls) */}
          {selectedType !== 'toll_badge' && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
              {cities.map(city => (
                <button
                  key={city}
                  onClick={() => handleCityClick(city)}
                  className={cn(
                    "whitespace-nowrap h-7 px-4 rounded-lg border-2 text-[10px] font-bold transition-all",
                    selectedCity === city || (city === 'Toutes' && !selectedCity)
                      ? "bg-primary text-primary-foreground border-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                      : "bg-background border-muted/30 text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none h-9 px-4 rounded-full border bg-background hover:bg-muted transition-all flex items-center justify-center gap-1.5 text-xs font-medium">
            <Filter className="h-3.5 w-3.5" />
            Filtres
          </button>
          <div className="flex border rounded-full overflow-hidden h-9">
            <button
              onClick={() => setView('list')}
              className={cn(
                "px-4 h-full transition-all text-xs font-medium",
                view === 'list' ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"
              )}
            >
              Liste
            </button>
            <button
              onClick={() => setView('map')}
              className={cn(
                "px-4 h-full transition-all text-xs font-medium",
                view === 'map' ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"
              )}
            >
              Carte
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* List View */}
        <div className={cn(
          "flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min",
          view === 'map' && "hidden md:grid md:w-1/2 lg:w-1/3"
        )}>
          {selectedType === 'toll_badge' && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full mb-6 p-6 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-[2rem] flex flex-col md:flex-row items-center gap-4 text-center md:text-left"
            >
              <div className="h-12 w-12 rounded-2xl bg-orange-500/20 flex items-center justify-center shrink-0">
                <CreditCard className="h-6 w-6 text-orange-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-black text-orange-700 uppercase tracking-widest">Péage intelligent et télépéage</h3>
                <p className="text-[10px] font-bold text-orange-600/80 leading-relaxed max-w-2xl">
                  Ceci est une simulation d'une future ouverture des systèmes de péages en Algérie. Les trajets affichés sont à titre illustratif pour démontrer la technologie DzToll.
                </p>
              </div>
            </motion.div>
          )}

          {isShowingFallback && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full p-4 bg-muted/50 rounded-2xl border-2 border-dashed border-muted text-center mb-6"
            >
              <p className="text-xs font-bold text-muted-foreground">
                Aucun résultat à <span className="text-primary">{selectedCity}</span>. Voici des parkings dans d'autres wilayas :
              </p>
            </motion.div>
          )}

          {isLoading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-card/30 rounded-2xl p-3 flex flex-col gap-3 animate-pulse border border-white/5">
                <div className="aspect-[4/3] bg-muted/50 rounded-xl mb-1" />
                <div className="h-3 bg-muted/50 rounded-full w-3/4" />
                <div className="h-2 bg-muted/50 rounded-full w-1/2" />
                <div className="flex justify-between items-center mt-1">
                  <div className="h-2 bg-muted/50 rounded-full w-1/4" />
                  <div className="h-2 bg-muted/50 rounded-full w-1/4" />
                </div>
                <div className="h-7 bg-muted/50 rounded-lg mt-1" />
              </div>
            ))
          ) : displayListings.length > 0 ? (
            displayListings.map((parking) => (
              <motion.div
                key={parking.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "group bg-card border-2 border-transparent hover:border-primary rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all flex",
                  view === 'map' ? "flex-row h-32" : "flex-row h-40 sm:flex-col sm:h-auto"
                )}
              >
                <div 
                  onClick={() => setSelectedParking(parking)}
                  className={cn(
                    "relative overflow-hidden flex-shrink-0 cursor-pointer",
                    view === 'map' ? "w-1/3 h-full" : "w-1/3 h-full sm:w-full sm:aspect-[4/3]",
                    parking.type === 'toll_badge' && "bg-orange-500/10 flex items-center justify-center h-auto aspect-square sm:aspect-video"
                  )}
                >
                  {parking.type === 'toll_badge' ? (
                    <CreditCard className="h-10 w-10 text-orange-500 opacity-50" />
                  ) : (
                    <img
                      src={parking.images?.[0] || 'https://aeroportalger.dz/assets/images/header/parking_to.jpg'}
                      alt={parking.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <div className="bg-primary/90 backdrop-blur-md text-white px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest">
                      {parking.type === 'garage' ? 'Garage' : parking.type === 'garden_spot' ? 'Jardin' : parking.type === 'toll_badge' ? 'Péage' : 'Parking Privé'}
                    </div>
                  </div>
                  {view !== 'map' && (
                    <div className="absolute bottom-2 right-2 bg-card/90 backdrop-blur-md text-primary px-2 py-1 rounded-lg text-[10px] font-black shadow-lg hidden sm:block">
                      {parking.type === 'toll_badge' ? '20 DA / trajet' : `${parking.pricePerHour} DA / h`}
                    </div>
                  )}
                </div>
                <div className={cn(
                  "p-3.5 flex flex-col gap-2 flex-1 min-w-0 justify-between sm:justify-start"
                )}>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-black text-sm leading-tight text-primary truncate">{parking.title}</h3>
                    <div className="flex items-center text-muted-foreground text-[10px] font-medium gap-1">
                      <MapPin className="h-2.5 w-2.5 text-primary flex-shrink-0" />
                      <span className="truncate">{parking.address}</span>
                    </div>
                  </div>
                  
                  {view === 'map' ? (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-accent">{parking.type === 'toll_badge' ? '20 DA/trajet' : `${parking.pricePerHour} DA/h`}</span>
                      <button 
                        onClick={() => setSelectedParking(parking)}
                        className="h-7 px-3 bg-accent text-white rounded-lg font-black uppercase tracking-widest hover:bg-accent/90 transition-all text-[8px]"
                      >
                        Réserver
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <div className="flex items-center gap-1 text-primary">
                          <Star className="h-2.5 w-2.5 text-yellow-400 fill-yellow-400" />
                          <span>4.5</span>
                          <span className="text-muted-foreground font-medium text-[9px]">(12)</span>
                        </div>
                        {parking.type === 'toll_badge' ? (
                          <div className="flex items-center gap-1 text-blue-600">
                             <Navigation className="h-2.5 w-2.5" />
                             Trajet
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-secondary">
                            <Clock className="h-2.5 w-2.5" />
                            Dispo.
                          </div>
                        )}
                      </div>
                      <div className="mt-auto flex gap-2">
                        <button 
                          onClick={() => setSelectedParking(parking)}
                          className="flex-1 h-8 bg-accent text-white rounded-lg font-black uppercase tracking-widest hover:bg-accent/90 transition-all shadow-lg shadow-accent/10 text-[9px]"
                        >
                          Réserver
                        </button>
                        <button 
                          onClick={() => {
                            setActiveParking(parking);
                            if (parking.location) {
                              setUserLocation([parking.location.lat, parking.location.lng]);
                            }
                            setView('map');
                          }}
                          className="w-10 h-8 border-2 border-primary text-primary rounded-lg flex items-center justify-center hover:bg-primary/5 transition-all"
                        >
                          <MapPin className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center h-48 text-muted-foreground">
              <Car className="h-10 w-10 mb-3 opacity-20" />
              <p className="text-sm">Aucun parking trouvé.</p>
            </div>
          )}
        </div>

        {/* Map View */}
        <div className={cn(
          "flex-1 bg-muted relative z-0",
          view === 'list' && "hidden md:block"
        )}>
          <MapContainer
            center={userLocation}
            zoom={12}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <ChangeView center={userLocation} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {hasLocation && (
              <Marker position={userLocation} icon={UserIcon}>
                <Popup>Vous êtes ici</Popup>
              </Marker>
            )}
            
            {/* Draw toll routes if selected or if relevant */}
            {displayListings.filter(l => l.type === 'toll_badge' && l.route).map((listing) => (
              <Polyline 
                key={`route-${listing.id}`}
                positions={[
                  [listing.route!.start.lat, listing.route!.start.lng],
                  [listing.route!.end.lat, listing.route!.end.lng]
                ]}
                color={activeParking?.id === listing.id ? "#FF5A5F" : "#3B82F6"}
                weight={activeParking?.id === listing.id ? 8 : 4}
                opacity={activeParking?.id === listing.id ? 1 : 0.6}
                eventHandlers={{
                  click: () => setActiveParking(listing),
                }}
              >
                <Popup>
                  <div className="p-1 font-bold text-xs">
                    {listing.title}
                  </div>
                </Popup>
              </Polyline>
            ))}

            {displayListings.map((listing) => (
              <Marker
                key={listing.id}
                position={[listing.location.lat, listing.location.lng]}
                eventHandlers={{
                  click: () => setActiveParking(listing),
                }}
              >
                <Popup>
                  <div className="p-1 flex flex-col gap-2 min-w-[150px]">
                    <div 
                      onClick={() => setSelectedParking(listing)}
                      className="aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer"
                    >
                      <img 
                        src={listing.images?.[0] || 'https://aeroportalger.dz/assets/images/header/parking_to.jpg'} 
                        alt={listing.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="font-black text-[10px] text-primary leading-tight">{listing.title}</h4>
                      <p className="text-[9px] font-bold text-accent">{listing.type === 'toll_badge' ? '20 DA / trajet' : `${listing.pricePerHour} DA / h`}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedParking(listing)}
                      className="w-full h-6 bg-primary text-white rounded-md text-[8px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all"
                    >
                      Réserver
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Active Parking Card (Mobile Map View) */}
          <AnimatePresence>
            {activeParking && view === 'map' && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="absolute bottom-20 left-4 right-4 z-[1000] md:hidden"
              >
                <div className="bg-card rounded-2xl p-3 shadow-2xl border-2 border-primary flex items-center gap-3 relative">
                  <button 
                    onClick={() => setActiveParking(null)}
                    className="absolute -top-2 -right-2 h-6 w-6 bg-background border-2 border-primary rounded-full flex items-center justify-center text-primary shadow-lg"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div 
                    onClick={() => setSelectedParking(activeParking)}
                    className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
                  >
                    <img 
                      src={activeParking.images?.[0] || 'https://aeroportalger.dz/assets/images/header/parking_to.jpg'} 
                      alt={activeParking.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <h4 className="font-black text-xs text-primary truncate">{activeParking.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-accent">{activeParking.pricePerHour} DA / h</span>
                      <button 
                        onClick={() => setSelectedParking(activeParking)}
                        className="h-7 px-4 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest"
                      >
                        Réserver
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recenter Button */}
          <button
            onClick={handleRecenter}
            className="absolute bottom-6 right-6 z-[1000] bg-background border-2 border-primary text-primary p-3 rounded-full shadow-2xl hover:bg-primary hover:text-primary-foreground transition-all"
            title="Ma position"
          >
            <Navigation className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedParking && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-background w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl border border-white/10"
            >
              <div className="relative h-32 md:h-40">
                <img 
                  src={selectedParking.images?.[0] || 'https://aeroportalger.dz/assets/images/header/parking_to.jpg'} 
                  alt={selectedParking.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => setSelectedParking(null)}
                  className="absolute top-3 right-3 p-1.5 bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-black/60 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 md:p-5 space-y-4">
                <AnimatePresence mode="wait">
                  {bookingStep === 'details' ? (
                    <motion.div
                      key="step-details"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <h2 className="text-lg font-black text-primary leading-tight">{selectedParking.title}</h2>
                        <p className="text-muted-foreground text-[10px] flex items-center gap-1 mt-1 font-medium uppercase tracking-wider">
                          <MapPin className="h-2.5 w-2.5" /> {selectedParking.address}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black text-primary uppercase tracking-widest">
                            {selectedParking.type === 'toll_badge' ? 'Trajets' : 'Heures'}
                          </label>
                          <div className="flex items-center gap-2 bg-muted p-1 rounded-xl">
                            <button 
                              onClick={() => setBookingHours(Math.max(1, bookingHours - 1))}
                              className="h-7 w-7 flex items-center justify-center bg-background rounded-lg shadow-sm font-bold text-primary hover:bg-accent hover:text-white transition-all text-xs"
                            >-</button>
                            <span className="w-6 text-center font-black text-primary text-xs">
                              {bookingHours}
                            </span>
                            <button 
                              onClick={() => setBookingHours(bookingHours + 1)}
                              className="h-7 w-7 flex items-center justify-center bg-background rounded-lg shadow-sm font-bold text-primary hover:bg-accent hover:text-white transition-all text-xs"
                            >+</button>
                          </div>
                        </div>

                        <div className="bg-accent/5 p-3 rounded-[1.5rem] border border-accent/10 space-y-2">
                          <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                            <span>Tarif {selectedParking.type === 'toll_badge' ? 'Unitaire' : 'Par heure'}</span>
                            <span>{formatCurrency(selectedParking.pricePerHour)}</span>
                          </div>
                          
                          <div className="pt-1.5 border-t border-accent/10 flex justify-between items-end">
                            <span className="text-xs font-black text-primary uppercase tracking-widest">Total</span>
                            <span className="text-xl font-black text-accent tracking-tighter">
                              {formatCurrency(calculateBookingPrice(selectedParking.pricePerHour, bookingHours))}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => setBookingStep('info')}
                          className="h-10 bg-primary text-white rounded-xl font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-[10px]"
                        >
                          Confirmer
                        </button>
                        {selectedParking.isNegotiable && (
                          <button 
                            onClick={() => {
                              navigate('/chat', { state: { parkingId: selectedParking.id, negotiate: true } });
                            }}
                            className="h-10 bg-white text-primary border-2 border-primary rounded-xl font-black uppercase tracking-widest hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-[10px]"
                          >
                            <MessageSquare className="h-3 w-3" />
                            Négocier
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ) : bookingStep === 'info' ? (
                    <motion.div
                      key="step-info"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setBookingStep('details')}
                          className="text-primary font-black text-[9px] uppercase tracking-widest hover:underline"
                        >
                          ← Revoir l'offre
                        </button>
                      </div>

                      <h3 className="text-sm font-black text-primary uppercase tracking-tight">Coordonnées</h3>
                      
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Nom</label>
                          <input 
                            type="text" 
                            value={userInfo.name}
                            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                            placeholder="Votre nom"
                            className="w-full h-9 px-3 rounded-lg bg-muted border-none focus:ring-2 focus:ring-primary outline-none text-xs font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Téléphone</label>
                          <input 
                            type="tel" 
                            value={userInfo.phone}
                            onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                            placeholder="05 / 06 / 07 ..."
                            className="w-full h-9 px-3 rounded-lg bg-muted border-none focus:ring-2 focus:ring-primary outline-none text-xs font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Véhicule (Plaque)</label>
                          <input 
                            type="text" 
                            value={userInfo.vehicle}
                            onChange={(e) => setUserInfo({ ...userInfo, vehicle: e.target.value })}
                            placeholder="Ex: 01234-116-19"
                            className="w-full h-9 px-3 rounded-lg bg-muted border-none focus:ring-2 focus:ring-primary outline-none text-xs font-medium"
                          />
                        </div>
                      </div>

                      <button 
                        disabled={!userInfo.name || !userInfo.phone}
                        onClick={() => setBookingStep('success')}
                        className="w-full h-11 bg-accent text-white rounded-xl font-black uppercase tracking-widest hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 disabled:opacity-50 text-[10px]"
                      >
                        Valider
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step-success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-4 flex flex-col items-center text-center gap-3"
                    >
                      <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-1">
                        <ShieldCheck className="h-7 w-7" />
                      </div>
                      <h3 className="text-xl font-black text-primary">Confirmé !</h3>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider px-4">
                        SMS de confirmation en cours d'envoi.
                      </p>
                      
                      <div className="w-full bg-muted p-3 rounded-xl mt-2 text-left">
                        <div className="flex justify-between text-[10px] mb-1 font-bold">
                          <span className="text-muted-foreground uppercase tracking-widest">Total</span>
                          <span className="text-primary">{formatCurrency(calculateBookingPrice(selectedParking.pricePerHour, bookingHours))}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-muted-foreground uppercase tracking-widest">Paiement</span>
                          <span className="text-green-600 uppercase">Sur place</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          setSelectedParking(null);
                          setBookingStep('details');
                          setUserInfo({ name: '', phone: '', vehicle: '' });
                        }}
                        className="w-full h-10 bg-primary text-white rounded-xl font-black uppercase tracking-widest mt-2 text-[10px]"
                      >
                        Terminer
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
