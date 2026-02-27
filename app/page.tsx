"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, MessageCircle } from "lucide-react";

export default function LunaChat() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user", parts: [{ text: input }] };
    const currentHistory = [...history];
    setHistory([...currentHistory, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, history: currentHistory }),
      });

      const data = await res.json();
      setHistory(prev => [...prev, { role: "model", parts: [{ text: data.text }] }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#E5DDD5]">
      {/* Header Ala WA */}
      <header className="flex items-center gap-3 p-4 bg-[#075E54] text-white shadow-lg z-10">
        <div className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center font-bold shadow-inner">
          L
        </div>
        <div>
          <h1 className="font-bold leading-tight">Kuen Todi ✨</h1>
          <p className="text-[10px] opacity-80 uppercase tracking-widest">Online terus buat lo</p>
        </div>
      </header>

      {/* Area Pesan */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-40">
            <MessageCircle size={64} className="text-gray-600 mb-2" />
            <p className="text-gray-800 font-medium text-sm">Ayo curhat atau tanya apa aja...</p>
          </div>
        )}

        {history.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`relative max-w-[80%] px-4 py-2 rounded-xl text-sm shadow-sm ${
              msg.role === "user" 
                ? "bg-[#DCF8C6] text-gray-800 rounded-tr-none" 
                : "bg-white text-gray-800 rounded-tl-none"
            }`}>
              {msg.parts[0].text}
              <div className="text-[9px] text-gray-400 text-right mt-1">Baru saja</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm animate-pulse text-xs text-gray-500">
              Kuen Todi lagi ngetik...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </main>

      {/* Input Pesan */}
      <footer className="p-3 bg-[#F0F0F0] flex items-center gap-2">
        <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center shadow-inner">
          <input
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-700"
            placeholder="Ketik pesan..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
        </div>
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="bg-[#075E54] hover:bg-[#128C7E] text-white p-3 rounded-full transition-all active:scale-90 shadow-md disabled:bg-gray-400"
        >
          <Send size={18} />
        </button>
      </footer>
    </div>
  );
}
