import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, Scan, CheckCircle2, XCircle, AlertCircle, RefreshCcw, Database, ShieldCheck, Search, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { GoogleGenAI } from "@google/genai";

interface PlateData {
  id: string;
  number: string;
  owner: string;
  status: 'authorized' | 'unauthorized' | 'blacklisted';
  wilaya: string;
  brand?: string;
  model?: string;
  color?: string;
}

const MOCK_DB: PlateData[] = [
  { id: '1', number: '14117 105 26', owner: 'Mounir Belkacem', status: 'authorized', wilaya: '26 - Médéa', brand: 'Dacia', model: 'Duster', color: 'Gris Platine' },
  { id: '2', number: '007233 118 34', owner: 'Samir Hamidi', status: 'authorized', wilaya: '34 - Bordj Bou Arreridj', brand: 'Renault', model: 'Clio 4', color: 'Blanc' },
  { id: '3', number: '00123 116 19', owner: 'Karim Mansouri', status: 'unauthorized', wilaya: '19 - Sétif', brand: 'Hyundai', model: 'Tucson', color: 'Noir' },
  { id: '4', number: '99999 116 25', owner: 'Inconnu', status: 'blacklisted', wilaya: '25 - Constantine', brand: 'Renault', model: 'Symbol', color: 'Bleu' },
];

const EXAMPLE_PLATES = [
  { id: 'ex1', url: 'https://cdn9.ouedkniss.com/400/medias/announcements/images/qY71xD/zDeMgTg8J91l0s65NRGIARiqxjgP5mQpe48mecwd.jpg', number: '14117 105 26' }, 
  { id: 'ex2', url: 'https://cdn8.ouedkniss.com/400/medias/announcements/images/82GKBo/FKbwUeivvGhI7nBqWBRw3SAaVRfLmtv2UnEQbILO.jpg', number: '007233 118 34' },
  { id: 'ex3', url: 'https://cdn8.ouedkniss.com/400/medias/announcements/images/822zwj/cBLXKJXkMEgL0MPwdNAy06IO8uh2H9uhQi2V0jAu.jpg', number: '00123 116 19' },
  { id: 'ex4', url: 'https://cdn8.ouedkniss.com/400/medias/announcements/images/RoLNRE/evDWAtya5JnRUv2cbJTIrLzRYSsLgU0I6y6tNfaM.jpg', number: '99999 116 25' },
];

// Removed global initialization to prevent fatal errors if API key is missing
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const PlateTestPage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<PlateData | null>(null);
  const [scanStep, setScanStep] = useState<string>('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Impossible d'accéder à la caméra. Vérifiez vos permissions.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        stopCamera();
        processImage(dataUrl, true);
      }
    }
  };

  const performOCR = async (base64Data: string) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('GEMINI_API_KEY is missing. OCR will return mock result.');
        return 'MOCK_PLATE';
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Data.split(',')[1] || base64Data
                }
              },
              {
                text: "Extract the Algerian license plate number from this image. Algerian plates typically follow the format 'XXXXX XXX XX' (e.g., '12345 116 16'). Respond with ONLY the number sequence formatted with spaces. If you cannot find any plate, respond with 'NO_PLATE'."
              }
            ]
          }
        ]
      });

      const extractedText = response.text?.trim() || 'NO_PLATE';
      return extractedText;
    } catch (error) {
      console.error('OCR Error:', error);
      return 'ERROR';
    }
  };

  const processImage = async (imageUrl: string, isBase64: boolean = false) => {
    setSelectedImage(imageUrl);
    setIsScanning(true);
    setResult(null);
    setScanStep('Initialisation de l\'IA...');

    let base64ToScan = imageUrl;

    if (!isBase64) {
      setScanStep('Traitement de l\'image...');
      try {
        // Use our proxy to avoid CORS
        const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(imageUrl)}`);
        const blob = await response.blob();
        base64ToScan = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.error('Fetch error:', err);
        setScanStep('Erreur de téléchargement...');
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    setScanStep('Détection de la plaque...');
    const plateNumber = await performOCR(base64ToScan);
    
    setScanStep('Comparaison base de données...');
    await new Promise(r => setTimeout(r, 1000)); // Just for UX

    if (plateNumber === 'NO_PLATE' || plateNumber === 'ERROR') {
      setResult({
        id: 'error',
        number: 'Non détectée',
        owner: 'Inconnu',
        status: 'unauthorized',
        wilaya: 'Inconnue'
      });
    } else if (plateNumber === 'MOCK_PLATE') {
      // Return a random mock plate from the example set if Gemini is missing
      const randomExample = EXAMPLE_PLATES[Math.floor(Math.random() * EXAMPLE_PLATES.length)];
      const match = MOCK_DB.find(p => p.number === randomExample.number);
      setResult(match || null);
    } else {
      // Look for match in mock DB
      const match = MOCK_DB.find(p => p.number.replace(/\s/g, '') === plateNumber.replace(/\s/g, ''));
      
      if (match) {
        setResult(match);
      } else {
        setResult({
          id: 'unknown',
          number: plateNumber,
          owner: 'Visiteur Inconnu',
          status: 'unauthorized',
          wilaya: 'Détection Externe'
        });
      }
    }

    setIsScanning(false);
    setScanStep('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        processImage(event.target?.result as string, true);
      };
      reader.readAsDataURL(file);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setResult(null);
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen pt-4 pb-8 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 py-1.5 px-3 rounded-full mb-2 border-2 border-accent/20">
            <Scan className="text-accent h-3 w-3" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent">Laboratoire IA - Démo</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter uppercase mb-2 leading-none">
            Tester votre <span className="text-primary italic">Plaque</span>
          </h1>
          <p className="text-muted-foreground font-medium max-w-2xl mx-auto text-xs leading-relaxed">
            Consultez instantanément le statut d'un véhicule grâce à notre système de reconnaissance automatisé performant.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel: Upload & Examples */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-card border-4 border-muted p-6 rounded-3xl shadow-xl">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 h-14 bg-accent text-background flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-transform shadow-lg shadow-accent/20"
                >
                  <Upload size={20} />
                  Importer une photo
                </button>
                <input 
                  type="file" 
                  hidden 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                />
                <button 
                  onClick={startCamera}
                  className="flex-1 h-14 border-4 border-muted text-foreground flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest hover:border-primary/50 transition-colors"
                >
                  <Camera size={20} />
                  Prendre une photo
                </button>
              </div>

              <canvas ref={canvasRef} hidden />

              <AnimatePresence>
                {isCameraOpen && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4"
                  >
                    <div className="relative w-full max-w-2xl aspect-video bg-muted rounded-3xl overflow-hidden border-4 border-white/20">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 border-2 border-accent/50 m-8 rounded-xl pointer-events-none">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-accent" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-accent" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-accent" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent" />
                      </div>
                    </div>
                    
                    <div className="flex gap-6 mt-8">
                      <button 
                        onClick={stopCamera}
                        className="w-16 h-16 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md transition-all border border-white/10"
                      >
                        <X size={32} className="text-white" />
                      </button>
                      <button 
                        onClick={capturePhoto}
                        className="w-20 h-20 bg-accent hover:scale-110 rounded-full flex items-center justify-center shadow-2xl shadow-accent/40 transition-transform"
                      >
                        <div className="w-16 h-16 border-4 border-white rounded-full flex items-center justify-center">
                           <div className="w-12 h-12 bg-white rounded-full" />
                        </div>
                      </button>
                    </div>

                    <p className="mt-6 text-white/60 font-black uppercase text-[10px] tracking-widest">Ciblez la plaque d'immatriculation</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                  <Database size={12} />
                  Exemples de test rapide
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {EXAMPLE_PLATES.map((ex) => (
                    <motion.div
                      key={ex.id}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => processImage(ex.url)}
                      className="cursor-pointer group relative aspect-square bg-muted rounded-2xl border-2 border-transparent hover:border-accent overflow-hidden transition-all"
                    >
                      <img 
                        src={ex.url} 
                        alt="Example plate" 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-2 left-2 text-[8px] font-black text-white uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                        Tester ce véhicule
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scanning View */}
            <AnimatePresence mode="wait">
              {(selectedImage || isScanning) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative aspect-video bg-black rounded-3xl overflow-hidden border-4 border-muted shadow-2xl group"
                >
                  <img 
                    src={selectedImage!} 
                    alt="Current test" 
                    className={cn(
                      "w-full h-full object-contain transition-all duration-700",
                      isScanning && "blur-[2px] opacity-70"
                    )}
                  />
                  
                  {isScanning && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <motion.div 
                        animate={{ 
                          top: ["0%", "100%", "0%"]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-accent/80 shadow-[0_0_15px_rgba(255,90,95,0.8)] z-10"
                      />
                      <div className="relative">
                        <RefreshCcw className="animate-spin text-accent h-16 w-16 mb-4" />
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1.2, opacity: 0.2 }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="absolute inset-0 bg-accent rounded-full -z-10"
                        />
                      </div>
                      <p className="text-xs font-black uppercase tracking-[0.3em] bg-black/50 px-4 py-2 backdrop-blur-md rounded-full border border-white/10">
                        {scanStep}
                      </p>
                    </div>
                  )}

                  {!isScanning && result && (
                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/90 to-transparent">
                       <button 
                        onClick={reset}
                        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition-all border border-white/10"
                       >
                         <RefreshCcw size={16} className="text-white" />
                       </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel: Results */}
          <div className="lg:col-span-4 h-full">
            <div className="bg-card border-4 border-muted rounded-3xl overflow-hidden h-full flex flex-col shadow-xl">
              <div className="p-4 border-b-2 border-muted flex items-center justify-between bg-muted/30">
                <h3 className="font-black text-[10px] uppercase tracking-widest">Rapport d'analyse</h3>
                {result && (
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full animate-pulse",
                    result.status === 'authorized' ? 'bg-emerald-500' : 'bg-red-500'
                  )} />
                )}
              </div>
              
              <div className="flex-1 p-6 flex flex-col">
                <AnimatePresence mode="wait">
                  {isScanning ? (
                    <motion.div 
                      key="scanning"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex flex-col items-center justify-center text-center space-y-4"
                    >
                      <Search size={48} className="text-muted-foreground opacity-20 animate-bounce" />
                      <p className="text-muted-foreground text-xs font-bold">Synchronisation avec le serveur central en cours...</p>
                    </motion.div>
                  ) : result ? (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-8"
                    >
                      <div>
                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-2">Immatriculation Détectée</label>
                        <div className="text-xl font-black text-foreground font-mono tracking-wider tabular-nums bg-background p-4 rounded-xl border-2 border-muted shadow-inner whitespace-nowrap overflow-hidden text-ellipsis">
                          {result.number}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block">Propriétaire</label>
                          <p className="text-sm font-bold text-foreground">{result.owner}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block">Wilaya</label>
                          <p className="text-sm font-bold text-foreground">{result.wilaya}</p>
                        </div>
                      </div>

                      {result.brand && (
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-muted/50">
                          <div className="space-y-1">
                            <label className="text-[7px] font-black text-muted-foreground uppercase tracking-widest block">Marque</label>
                            <p className="text-xs font-bold text-foreground">{result.brand}</p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[7px] font-black text-muted-foreground uppercase tracking-widest block">Modèle</label>
                            <p className="text-xs font-bold text-foreground">{result.model}</p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[7px] font-black text-muted-foreground uppercase tracking-widest block">Couleur</label>
                            <p className="text-xs font-bold text-foreground">{result.color}</p>
                          </div>
                        </div>
                      )}

                      <div className="pt-6 border-t-2 border-muted">
                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-4">Décision Système</label>
                        
                        {result.status === 'authorized' && (
                          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
                            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-background shadow-lg shadow-emerald-500/20">
                              <CheckCircle2 size={24} />
                            </div>
                            <div>
                              <h4 className="text-emerald-500 font-black uppercase text-[10px] tracking-widest mb-0.5">ACCÈS AUTORISÉ</h4>
                              <p className="text-[9px] font-bold text-emerald-500/70">Véhicule en règle</p>
                            </div>
                          </div>
                        )}

                        {result.status === 'unauthorized' && (
                          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
                            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-background shadow-lg shadow-amber-500/20">
                              <AlertCircle size={24} />
                            </div>
                            <div>
                              <h4 className="text-amber-500 font-black uppercase text-[10px] tracking-widest mb-0.5">ACCÈS REFUSÉ</h4>
                              <p className="text-[9px] font-bold text-amber-500/70">Abonnement invalide</p>
                            </div>
                          </div>
                        )}

                        {result.status === 'blacklisted' && (
                          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
                            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-background shadow-lg shadow-red-500/20">
                              <XCircle size={24} />
                            </div>
                            <div>
                              <h4 className="text-red-500 font-black uppercase text-[10px] tracking-widest mb-0.5">SIGNALÉ / VOLÉ</h4>
                              <p className="text-[9px] font-bold text-red-500/70">Alerte sécurité active</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-8">
                        <button 
                          onClick={reset}
                          className="w-full py-4 border-2 border-muted hover:border-accent text-muted-foreground hover:text-accent font-black uppercase text-[10px] tracking-widest transition-all rounded-xl flex items-center justify-center gap-2"
                        >
                          <RefreshCcw size={14} />
                          Nouveau Test
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex-1 flex flex-col items-center justify-center text-center space-y-4"
                    >
                      <ShieldCheck size={48} className="text-muted-foreground opacity-10" />
                      <div>
                        <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1">Prêt pour Analyse</p>
                        <p className="text-muted-foreground/60 text-[9px] font-medium leading-relaxed px-4">
                          Sélectionnez une image ou importez une nouvelle photo pour lancer la reconnaissance.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlateTestPage;
