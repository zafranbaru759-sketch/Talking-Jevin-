import React, { useState, useRef, useEffect } from 'react';
import { soundEngine } from '../utils/audio';
import { ChatMessage, ActivePet } from '../types';
import { Send, Volume2, Sparkles, X, MessageSquareQuote } from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCharacterSpeak: (character: 'jevin' | 'sky', text: string) => void;
  defaultCharacter?: ActivePet;
}

const PRESETS_JEVIN = [
  'Kenapa kamu ngantuk terus?',
  'Ceritain tentang temanmu si Sky!',
  'Mau snack donat apa?',
  'Ayo bangun kita main!',
];

const PRESETS_SKY = [
  'Hai Sky! Kamu lagi ngapain?',
  'Kenapa Jevin susah dibangunin?',
  'Apa makanan kesukaanmu?',
  'Ayo kita jalan-jalan ke dunia permen!',
];

const JEVIN_RESPONSES = [
  'Hooaammm... ngantuk itu bukan penyakit kawan, itu anugerah terindah.',
  'Sky itu temen beruang biru setiaku. Dia rajin, makanya aku suruh dia yang mikir.',
  'Donat gula atau susu hangat yang manis... langsung lumer di mulut nyam nyam...',
  'Bangun? Waduh, gravitasi di kasur ini lagi 10 kali lipat lebih kuat hari ini...',
  'Tips tidur nyenyak: jangan pasang alarm, tarik selimut, bayangin pulau permen. Zzz...',
  'Santai dulu ga sih... kerjaan bisa nunggu, tapi rebahan ga bisa ditunda.',
];

const SKY_RESPONSES = [
  'Halo sahabatku! Hari ini indah banget kan? Aku lagi nyemangatin Jevin biar ga tidur terus!',
  'Jevin tuh kalau udah ketemu bantal langsung nempel kayak permen karet, gemes banget deh!',
  'Aku suka banget makan ikan manis, madu, dan donat gula bareng Jevin!',
  'Ayo kita jelajahi dunia permen atau jadi kapten bajak laut! Aku siap nemenin kamu!',
  'Telinga beruangku bisa goyang-goyang kalau lagi hepi lho! Hehehe.',
  'Kamu mau main apa hari ini? Trik sulap, lari koin, atau dandanin kita?',
];

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  onCharacterSpeak,
  defaultCharacter = 'jevin',
}) => {
  const [targetChar, setTargetChar] = useState<'jevin' | 'sky' | 'duo'>(
    defaultCharacter === 'sky' ? 'sky' : 'jevin'
  );
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'jevin',
      text: 'Hooaam... Halo! Mau ngobrol santai sama Jevin atau sama Sky si beruang?',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const currentPresets = targetChar === 'sky' ? PRESETS_SKY : PRESETS_JEVIN;

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    soundEngine.playPop();
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let replySpeaker: 'jevin' | 'sky' = targetChar === 'sky' ? 'sky' : 'jevin';
      if (targetChar === 'duo') {
        replySpeaker = Math.random() > 0.5 ? 'sky' : 'jevin';
      }

      let reply = '';
      if (replySpeaker === 'sky') {
        reply = SKY_RESPONSES[Math.floor(Math.random() * SKY_RESPONSES.length)];
      } else {
        reply = JEVIN_RESPONSES[Math.floor(Math.random() * JEVIN_RESPONSES.length)];
      }

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: replySpeaker,
        text: reply,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      onCharacterSpeak(replySpeaker, reply);
      soundEngine.speakIndonesian(reply);
    }, 650);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md h-[560px] bg-slate-900 border-2 border-indigo-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-blue-900 via-indigo-900 to-cyan-900 border-b border-indigo-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-sky-300 flex items-center justify-center text-lg shadow-inner">
              {targetChar === 'sky' ? '🐻' : '😴'}
            </div>
            <div>
              <h3 className="font-bold text-white text-base leading-tight flex items-center gap-1.5">
                Ngobrol Bareng {targetChar === 'sky' ? 'Sky' : targetChar === 'duo' ? 'Jevin & Sky' : 'Jevin'}
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h3>
              <p className="text-[11px] text-sky-200">
                {targetChar === 'sky' ? 'Gaya Ceria & Penuh Semangat' : 'Gaya Santai & Mengantuk'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Character Pick Bar */}
        <div className="flex p-2 gap-1.5 bg-slate-950/70 border-b border-slate-800">
          <button
            onClick={() => {
              soundEngine.playPop();
              setTargetChar('jevin');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              targetChar === 'jevin'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            😴 Jevin
          </button>
          <button
            onClick={() => {
              soundEngine.playPop();
              setTargetChar('sky');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              targetChar === 'sky'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🐻 Sky
          </button>
          <button
            onClick={() => {
              soundEngine.playPop();
              setTargetChar('duo');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              targetChar === 'duo'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            👯 Keduanya
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/40">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm shadow-md leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : m.sender === 'sky'
                    ? 'bg-cyan-900/90 border border-cyan-500/60 text-cyan-100 rounded-bl-xs'
                    : 'bg-indigo-900/80 border border-indigo-700/60 text-indigo-100 rounded-bl-xs'
                }`}
              >
                {m.sender !== 'user' && (
                  <div className="flex items-center justify-between gap-2 mb-1 border-b border-white/10 pb-1">
                    <span className="text-[11px] font-black text-amber-300 flex items-center gap-1">
                      {m.sender === 'sky' ? '🐻 Sky' : '😴 Jevin'}
                    </span>
                    <button
                      onClick={() => soundEngine.speakIndonesian(m.text)}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-300 hover:text-sky-200 bg-slate-950/50 px-1.5 py-0.5 rounded-md"
                    >
                      <Volume2 className="w-3 h-3" /> Bacakan
                    </button>
                  </div>
                )}
                <div>{m.text}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-indigo-900/60 border border-indigo-700/40 rounded-2xl px-4 py-2 flex items-center gap-1.5 text-xs text-indigo-300">
                <span>{targetChar === 'sky' ? 'Sky sedang mengetik...' : 'Jevin sedang menguap...'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 animate-ping" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-slate-900/90 border-t border-slate-800 flex gap-2 overflow-x-auto no-scrollbar">
          {currentPresets.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-xs shrink-0 px-3 py-1.5 rounded-full bg-indigo-950 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/50 flex items-center gap-1 transition-colors"
            >
              <MessageSquareQuote className="w-3 h-3 text-sky-400" />
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-indigo-500/20 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Tulis pesan untuk ${targetChar === 'sky' ? 'Sky...' : targetChar === 'duo' ? 'Jevin & Sky...' : 'Jevin...'}`}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold flex items-center justify-center transition-all shadow-md active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
