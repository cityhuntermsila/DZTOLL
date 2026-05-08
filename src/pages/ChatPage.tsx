import React, { useState } from 'react';
import { Send, User, MapPin, Calendar, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', sender: 'owner', text: 'Bonjour ! Votre réservation est confirmée. Voici le code d\'accès : 1234.', time: '10:00' },
    { id: '2', sender: 'renter', text: 'Merci beaucoup ! Est-ce que le garage est facile à trouver ?', time: '10:05' },
    { id: '3', sender: 'owner', text: 'Oui, c\'est la porte bleue juste après la boulangerie.', time: '10:07' },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), sender: 'renter', text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setMessage('');
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl h-[calc(100vh-4rem)] flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4 flex-1 overflow-hidden">
        {/* Sidebar: Booking Info */}
        <div className="w-full md:w-64 flex flex-col gap-3">
          <div className="p-4 rounded-2xl border bg-card flex flex-col gap-3 shadow-sm">
            <h2 className="font-bold text-base text-primary">Détails de la réservation</h2>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden">
                <img src="https://www.aeroportcasablanca.ma/var/onda/storage/images/nos-a%C3%A9roports/a%C3%A9roport-casablanca-mohammed-v/acc%C3%A8s-facilitations/parkings/parking-terminal-2/216526-2-fre-FR/Parking-Terminal-2_mv_actu_liste.jpg" alt="parking" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs text-primary">Garage Centre Ville</span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-2.5 w-2.5" /> Paris, France
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 border-t pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" /> Date
                </span>
                <span className="font-medium">25 Mars 2026</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Info className="h-3 w-3" /> Statut
                </span>
                <span className="text-secondary font-bold">Confirmé</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border bg-card flex flex-col gap-3 shadow-sm">
            <h2 className="font-bold text-base text-primary">Propriétaire</h2>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs text-primary">Jean Dupont</span>
                <span className="text-[10px] text-muted-foreground">Membre depuis 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-card border rounded-[1.5rem] overflow-hidden shadow-sm">
          <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-3 w-3 text-primary" />
              </div>
              <span className="font-bold text-xs text-primary">Jean Dupont</span>
            </div>
            <span className="text-[10px] text-muted-foreground">En ligne</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: msg.sender === 'renter' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "max-w-[80%] p-3 rounded-xl text-xs flex flex-col gap-0.5",
                  msg.sender === 'renter'
                    ? "bg-primary text-primary-foreground self-end rounded-tr-none"
                    : "bg-muted self-start rounded-tl-none"
                )}
              >
                <p>{msg.text}</p>
                <span className={cn(
                  "text-[9px] self-end opacity-70",
                  msg.sender === 'renter' ? "text-primary-foreground" : "text-muted-foreground"
                )}>
                  {msg.time}
                </span>
              </motion.div>
            ))}
          </div>

          <form onSubmit={handleSend} className="p-3 border-t bg-muted/30 flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-1 h-9 px-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-xs"
            />
            <button
              type="submit"
              className="h-9 w-9 bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
