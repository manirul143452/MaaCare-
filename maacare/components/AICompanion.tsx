
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { getAICompanionResponse } from '../geminiService';
import { 
  Send, 
  User, 
  Bot, 
  Loader2, 
  Sparkles, 
  Bolt, 
  Image as ImageIcon, 
  X, 
  Camera, 
  Scan,
  ShieldAlert,
  ArrowDown,
  Trash2
} from 'lucide-react';

const STORAGE_KEY = 'maacare_ai_chat_history';

const AICompanion: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        // Ensure timestamps are Date objects
        const hydrated = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(hydrated);
      } catch (err) {
        console.error("Failed to parse chat history", err);
        initializeWelcomeMessage();
      }
    } else {
      initializeWelcomeMessage();
    }
  }, []);

  // Save history to localStorage when messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const initializeWelcomeMessage = () => {
    setMessages([
      { 
        id: '1', 
        role: 'assistant', 
        content: "Hello! I'm your MaaCare AI Companion. I'm equipped with Vision! You can upload a photo of a rash, a baby's symptom, or even a nutrition label, and I'll help you analyze it. What's on your mind today?", 
        timestamp: new Date() 
      }
    ]);
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear your chat history? This cannot be undone.")) {
      localStorage.removeItem(STORAGE_KEY);
      initializeWelcomeMessage();
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      setIsAtBottom(scrollHeight - scrollTop <= clientHeight + 100);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert("Please select an image smaller than 4MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setImageMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImageMimeType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input || (selectedImage ? "[Attached Image]" : ""),
      imageUrl: selectedImage || undefined,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    
    const currentInput = input;
    const currentImage = selectedImage;
    const currentMime = imageMimeType;

    setInput('');
    removeSelectedImage();
    setIsLoading(true);

    try {
      // Create chat history for context (last 5 messages for token efficiency)
      const history = updatedMessages.slice(-6).map(m => ({ 
        role: m.role, 
        content: m.content 
      }));
      
      let imageData = undefined;
      if (currentImage && currentMime) {
        imageData = {
          data: currentImage.split(',')[1],
          mimeType: currentMime
        };
      }

      const response = await getAICompanionResponse(history, currentInput, imageData);
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || "I'm processing your request. One moment please.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: "I apologize, but I encountered an error while analyzing your request. This could be due to connection issues or file size. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col relative">
      {/* Chat Header */}
      <div className="bg-white rounded-t-[2.5rem] border border-gray-100 p-6 flex items-center justify-between shadow-sm z-20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-[1.25rem] flex items-center justify-center relative shadow-inner">
            <Bot size={32} />
            <div className="absolute -top-1 -right-1 bg-amber-400 text-white p-1 rounded-full border-2 border-white animate-pulse">
              <Sparkles size={12} fill="currentColor" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">MaaCare Companion</h2>
              <span className="flex items-center gap-1 px-2.5 py-0.5 bg-teal-50 text-teal-600 rounded-full border border-teal-100 text-[9px] font-black uppercase tracking-widest">
                <Scan size={10} /> Multimodal
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Vision & Audio Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={clearHistory}
             className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
             title="Clear Chat History"
           >
             <Trash2 size={20} />
           </button>
           <button className="hidden sm:flex p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all">
             <ShieldAlert size={20} />
           </button>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 bg-white border-x border-gray-100 overflow-y-auto p-6 space-y-8 no-scrollbar scroll-smooth"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex gap-4 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-pink-100 text-pink-600' : 'bg-teal-100 text-teal-600'
              }`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-5 rounded-[1.75rem] text-[15px] leading-relaxed shadow-sm border ${
                  msg.role === 'user' 
                  ? 'bg-pink-600 text-white rounded-tr-none border-pink-500' 
                  : 'bg-gray-50 text-gray-700 rounded-tl-none border-gray-100'
                }`}>
                  {msg.imageUrl && (
                    <div className="mb-4 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl max-w-sm group relative">
                      <img src={msg.imageUrl} alt="Context" className="w-full h-auto object-cover max-h-72 transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  )}
                  <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                  <div className={`text-[9px] mt-3 font-black uppercase tracking-widest opacity-60 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-400 flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div className="bg-gray-50 p-5 rounded-[1.75rem] rounded-tl-none border border-gray-100 flex items-center gap-3">
                <Loader2 className="animate-spin text-teal-600" size={18} />
                <span className="text-sm text-gray-400 font-black uppercase tracking-widest">MaaCare is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Floating Scroll Down Button */}
      {!isAtBottom && (
        <button 
          onClick={scrollToBottom}
          className="absolute bottom-32 right-8 p-3 bg-white text-teal-600 rounded-full shadow-2xl border border-gray-100 animate-bounce z-10"
        >
          <ArrowDown size={20} />
        </button>
      )}

      {/* Input Area */}
      <div className="p-6 bg-white rounded-b-[2.5rem] border border-gray-100 shadow-sm relative">
        {selectedImage && (
          <div className="mb-6 flex items-center gap-4 animate-in slide-in-from-bottom-4 bg-gray-50 p-4 rounded-3xl border border-dashed border-teal-200">
            <div className="relative group overflow-hidden rounded-2xl shadow-xl">
              <img src={selectedImage} className="w-24 h-24 object-cover" alt="Preview" />
              <div className="absolute inset-0 bg-teal-600/20 animate-pulse flex items-center justify-center">
                 <Scan className="text-white" size={24} />
              </div>
              <button 
                onClick={removeSelectedImage}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-gray-800 uppercase tracking-widest mb-1">Visual context added</p>
              <p className="text-xs text-gray-400 font-medium">Click send to analyze this image.</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <input 
            type="file" 
            ref={cameraInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            capture="environment"
            className="hidden"
          />
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-4 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-2xl transition-all border border-gray-100 shadow-sm"
              title="Upload Photo"
            >
              <ImageIcon size={22} />
            </button>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="p-4 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-2xl transition-all border border-gray-100 shadow-sm"
              title="Take Photo"
            >
              <Camera size={22} />
            </button>
          </div>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedImage ? "Add a question about this photo..." : "Ask me anything about your health..."}
            className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 outline-none focus:bg-white focus:border-teal-500 transition-all text-[15px] font-medium placeholder:text-gray-300"
          />
          
          <button
            type="submit"
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className="bg-teal-600 text-white p-4 rounded-2xl hover:bg-teal-700 disabled:opacity-50 transition-all shadow-xl shadow-teal-100 flex items-center justify-center min-w-[3.5rem] active:scale-95"
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AICompanion;
