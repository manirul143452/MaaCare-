
import React, { useState, useEffect, useRef } from 'react';
import { generateCommunityTips } from '../geminiService';
import { ForumPost } from '../types';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Search, 
  Filter, 
  PlusCircle, 
  Loader2, 
  RefreshCw, 
  Bolt, 
  Sparkles,
  ChevronRight,
  Image as ImageIcon,
  Video as VideoIcon,
  X,
  Send,
  Globe,
  MoreHorizontal,
  Camera,
  Play
} from 'lucide-react';

const CATEGORIES = [
  "General Parenting",
  "Pregnancy",
  "Newborn Care",
  "Sleep Training",
  "Mental Health",
  "Nutrition"
];

const ParentsPark: React.FC = () => {
  const [feed, setFeed] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("General Parenting");
  const [isPostingModalOpen, setIsPostingModalOpen] = useState(false);
  
  // Post Creation State
  const [postText, setPostText] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postCategory, setPostCategory] = useState("General Parenting");
  const [mediaFile, setMediaFile] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const fetchTrending = async (category: string = activeCategory) => {
    setLoading(true);
    try {
      const data = await generateCommunityTips(category);
      const enrichedData: ForumPost[] = data.map((item: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        author: item.author,
        authorAvatar: `https://picsum.photos/seed/${item.author}/48/48`,
        title: item.title,
        content: item.content,
        likes: Math.floor(Math.random() * 500) + 50,
        comments: Math.floor(Math.random() * 100) + 10,
        tags: item.tags,
        time: "Just now",
        isAiGenerated: true
      }));
      setFeed(enrichedData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
  }, [activeCategory]);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaFile(reader.result as string);
        setMediaType(type);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPostState = () => {
    setPostText("");
    setPostTitle("");
    setMediaFile(null);
    setMediaType(null);
    setIsPostingModalOpen(false);
  };

  const handlePublish = () => {
    if (!postText.trim() && !mediaFile) return;

    setIsPublishing(true);
    
    // Simulate API Delay
    setTimeout(() => {
      const newPost: ForumPost = {
        id: Date.now().toString(),
        author: "You",
        authorAvatar: "https://picsum.photos/seed/mama/48/48",
        title: postTitle || "Community Update",
        content: postText,
        likes: 0,
        comments: 0,
        tags: [postCategory],
        time: "Just now",
        isAiGenerated: false,
        mediaUrl: mediaFile || undefined,
        mediaType: mediaType || undefined
      };

      setFeed([newPost, ...feed]);
      setIsPublishing(false);
      clearPostState();
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 px-4">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Parents Park</h1>
          <p className="text-gray-500 font-medium">Join the circle. Share milestones, ask questions, or just vent.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => fetchTrending()}
            disabled={loading}
            className="p-4 bg-white text-gray-400 rounded-2xl border border-gray-100 hover:text-pink-600 hover:border-pink-200 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => setIsPostingModalOpen(true)}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-xl shadow-indigo-100 active:scale-95"
          >
            <PlusCircle size={20} /> Start Discussion
          </button>
        </div>
      </header>

      {/* Categories */}
      <div className="flex overflow-x-auto pb-2 gap-3 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border shadow-sm ${
              activeCategory === cat 
              ? 'bg-pink-600 border-pink-600 text-white shadow-pink-100 scale-105' 
              : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 space-y-8">
          
          {/* Quick Create Bar */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-xl transition-all duration-500">
             <img src="https://picsum.photos/seed/mama/48/48" className="w-14 h-14 rounded-2xl shadow-inner border-2 border-white" alt="Me" />
             <button 
               onClick={() => setIsPostingModalOpen(true)}
               className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-400 font-medium px-8 py-4 rounded-2xl text-left transition-all border border-gray-50"
             >
               Share a photo, video, or a question...
             </button>
             <div className="flex gap-2">
                <button onClick={() => { setIsPostingModalOpen(true); setTimeout(() => fileInputRef.current?.click(), 100); }} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors">
                  <ImageIcon size={20} />
                </button>
                <button onClick={() => { setIsPostingModalOpen(true); setTimeout(() => videoInputRef.current?.click(), 100); }} className="p-3 bg-pink-50 text-pink-600 rounded-xl hover:bg-pink-100 transition-colors">
                  <VideoIcon size={20} />
                </button>
             </div>
          </div>

          {/* Search bar */}
          <div className="bg-white p-3 rounded-[2rem] shadow-sm border border-gray-100 flex items-center px-6 gap-4">
            <Search className="text-gray-300" size={22} />
            <input 
              type="text" 
              placeholder="Search trending topics..." 
              className="flex-1 bg-transparent py-3 outline-none text-gray-700 font-medium"
            />
            <button className="p-3 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors">
              <Filter size={20} />
            </button>
          </div>

          {/* Feed */}
          <div className="space-y-8">
            {loading ? (
              <div className="bg-white rounded-[3rem] py-32 border border-gray-100 flex flex-col items-center justify-center gap-6">
                <div className="relative">
                  <Loader2 className="animate-spin text-pink-600" size={64} />
                  <Bolt className="absolute inset-0 m-auto text-amber-500" size={24} fill="currentColor" />
                </div>
                <p className="text-gray-400 font-black uppercase tracking-widest animate-pulse">Syncing Community Hub...</p>
              </div>
            ) : (
              feed.map((post) => (
                <article key={post.id} className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all group animate-in fade-in slide-in-from-bottom-4">
                  <div className="p-8 pb-4">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <img src={post.authorAvatar} className="w-14 h-14 rounded-2xl object-cover border-4 border-gray-50 shadow-inner" alt={post.author} />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-gray-900 text-lg leading-none">{post.author}</h4>
                            {post.isAiGenerated && (
                              <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100 text-[9px] font-black uppercase tracking-widest">
                                <Bolt size={8} fill="currentColor" /> AI Insight
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1.5">{post.time}</p>
                        </div>
                      </div>
                      <button className="p-3 text-gray-300 hover:text-gray-600 rounded-xl hover:bg-gray-50 transition-all">
                        <MoreHorizontal size={24} />
                      </button>
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-lg font-medium leading-relaxed mb-6 whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {/* Media Display */}
                    {post.mediaUrl && (
                      <div className="mb-8 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl bg-gray-50">
                        {post.mediaType === 'video' ? (
                          <video src={post.mediaUrl} controls className="w-full h-auto max-h-[500px]" />
                        ) : (
                          <img src={post.mediaUrl} className="w-full h-auto object-cover max-h-[600px] hover:scale-105 transition-transform duration-700" alt="Post media" />
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-8">
                      {post.tags?.map((tag) => (
                        <span key={tag} className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-indigo-100">
                          #{tag.replace(/\s+/g, '')}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-50 flex items-center gap-8">
                    <button className="flex items-center gap-2 text-gray-400 hover:text-pink-600 transition-all active:scale-90">
                      <ThumbsUp size={22} className="group-hover:animate-bounce" /> 
                      <span className="font-black text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition-all active:scale-90">
                      <MessageSquare size={22} /> 
                      <span className="font-black text-sm">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-green-600 transition-all ml-auto">
                      <Share2 size={22} />
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="bg-indigo-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <h4 className="font-black text-2xl mb-4 relative z-10 tracking-tight">Active Circles</h4>
            <p className="text-sm text-indigo-100/70 mb-8 relative z-10 font-medium">Connect with parents in your exact trimester.</p>
            <div className="space-y-4 relative z-10">
              {[
                { name: '1st Trimester Hub', members: '4.2k', icon: '🌱' },
                { name: 'Sleep Solutions', members: '12.4k', icon: '💤' },
                { name: 'Toddler Meals', members: '8.1k', icon: '🥣' }
              ].map((group, i) => (
                <button key={i} className="w-full bg-white/10 hover:bg-white/20 p-5 rounded-[1.5rem] flex items-center justify-between transition-all border border-white/5 active:scale-95 group/btn">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl filter drop-shadow-lg">{group.icon}</span>
                    <div className="text-left">
                      <p className="text-xs font-black uppercase tracking-widest">{group.name}</p>
                      <p className="text-[10px] text-indigo-300 font-bold">{group.members} online</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-indigo-400 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
            <Users className="absolute -right-12 -bottom-12 text-white opacity-5 w-64 h-64 rotate-12" />
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
            <h4 className="font-black text-gray-900 mb-8 flex items-center gap-3 tracking-tight">
              <Sparkles size={22} className="text-pink-500" /> Active Mentors
            </h4>
            <div className="space-y-8">
              {[
                { name: 'Dr. Sarah', specialty: 'Pediatrician', img: 'doc1' },
                { name: 'Nurse Emma', specialty: 'Postpartum', img: 'doc3' },
                { name: 'Mark Wilson', specialty: 'Family Psych', img: 'doc2' }
              ].map((mentor, i) => (
                <div key={i} className="flex items-center gap-5 group cursor-pointer">
                  <div className="relative shrink-0">
                    <img src={`https://picsum.photos/seed/${mentor.img}/100/100`} className="w-14 h-14 rounded-2xl object-cover border-4 border-gray-50 shadow-inner group-hover:scale-105 transition-transform" alt="" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-800 leading-none">{mentor.name}</p>
                    <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mt-1.5">{mentor.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Posting Modal */}
      {isPostingModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={clearPostState} />
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
             <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl">
                    <PlusCircle size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-xl tracking-tight">New Discussion</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Post to the MaaCare Community</p>
                  </div>
               </div>
               <button onClick={clearPostState} className="p-3 hover:bg-white rounded-2xl text-gray-400 transition-all border border-transparent hover:border-gray-100">
                 <X size={28} />
               </button>
             </div>

             <div className="p-10 space-y-8 overflow-y-auto max-h-[70vh] no-scrollbar">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Title</label>
                  <input 
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="E.g. Help with sleep training!"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-lg font-black outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Description</label>
                  <textarea 
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder="What would you like to share or ask?"
                    className="w-full h-48 px-6 py-6 bg-gray-50 border border-gray-100 rounded-[2.5rem] text-lg font-medium outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all resize-none"
                  />
                </div>

                {mediaFile && (
                  <div className="relative rounded-[2rem] overflow-hidden border border-gray-100 shadow-xl group animate-in slide-in-from-bottom-4">
                    {mediaType === 'video' ? (
                      <video src={mediaFile} className="w-full h-auto max-h-64 object-cover" />
                    ) : (
                      <img src={mediaFile} className="w-full h-auto max-h-64 object-cover" alt="Preview" />
                    )}
                    <button 
                      onClick={() => { setMediaFile(null); setMediaType(null); }}
                      className="absolute top-4 right-4 bg-red-600 text-white p-3 rounded-2xl shadow-2xl hover:bg-red-700 transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex gap-2">
                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => handleMediaUpload(e, 'image')} />
                    <input type="file" ref={videoInputRef} hidden accept="video/*" onChange={(e) => handleMediaUpload(e, 'video')} />
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-5 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs hover:bg-indigo-100 transition-all active:scale-95">
                      <ImageIcon size={18} /> Add Photo
                    </button>
                    <button onClick={() => videoInputRef.current?.click()} className="flex items-center gap-2 px-5 py-3 bg-pink-50 text-pink-600 rounded-xl font-bold text-xs hover:bg-pink-100 transition-all active:scale-95">
                      <VideoIcon size={18} /> Add Video
                    </button>
                  </div>
                  <div className="flex-1" />
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Circle:</span>
                    <select 
                      value={postCategory}
                      onChange={(e) => setPostCategory(e.target.value)}
                      className="px-4 py-2.5 bg-gray-100 rounded-xl text-xs font-black uppercase text-indigo-600 outline-none border-none cursor-pointer"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
             </div>

             <div className="p-10 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3 text-gray-400">
                   <Globe size={18} />
                   <p className="text-[10px] font-black uppercase tracking-widest">Publicly visible post</p>
                </div>
                <button 
                  onClick={handlePublish}
                  disabled={isPublishing || (!postText.trim() && !mediaFile)}
                  className="w-full sm:w-auto px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {isPublishing ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Publish</>}
                </button>
             </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ParentsPark;
