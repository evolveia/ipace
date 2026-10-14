import React, { useState, useEffect } from 'react';
import { FeaturedEventsCarousel } from './FeaturedEventsCarousel';
import { PostCard } from './PostCard';
import { ReportModal } from './ReportModal';
import { EventItem, Post, ReportCategory } from '../../types';
import { StorageService, FEATURED_EVENTS } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  Flame,
  TrendingUp,
  Award,
  Users,
  Send,
  Calendar,
  ShoppingBag,
} from 'lucide-react';

interface HomeScreenProps {
  onSelectEvent: (event: EventItem) => void;
  onNavigateTab: (tab: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectEvent, onNavigateTab }) => {
  const { user, isAuthenticated } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'para-voce' | 'seguindo' | 'equipes' | 'profissionais'>('para-voce');
  const [isLoading, setIsLoading] = useState(true);
  const [newPostText, setNewPostText] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // Report modal state
  const [reportingPost, setReportingPost] = useState<Post | null>(null);

  // Load feed posts
  const loadPosts = async () => {
    setIsLoading(true);
    const data = await StorageService.getPosts();
    setPosts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleToggleLike = async (postId: string) => {
    await StorageService.toggleLikePost(postId);
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.likedByMe;
          return {
            ...p,
            likedByMe: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = async (postId: string, text: string) => {
    const updated = await StorageService.addComment(postId, text);
    setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
  };

  const handleToggleSave = async (postId: string) => {
    const saved = await StorageService.toggleSavePost(postId);
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, savedByMe: saved } : p)));
  };

  const handleToggleFollow = async (authorId: string) => {
    const following = await StorageService.toggleFollowAuthor(authorId);
    setPosts((prev) =>
      prev.map((p) => (p.authorId === authorId ? { ...p, isFollowingAuthor: following } : p))
    );
  };

  const handleReportSubmit = async (category: ReportCategory, notes: string) => {
    if (reportingPost) {
      await StorageService.reportPost(reportingPost.id, category, notes);
    }
  };

  const handleBlockUser = async (authorId: string) => {
    await StorageService.blockUser(authorId);
    setPosts((prev) => prev.filter((p) => p.authorId !== authorId));
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() || !user) return;
    setIsPosting(true);
    const newPost: Post = {
      id: `post_${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorUsername: user.username,
      authorAvatar: user.avatar,
      authorType: 'user',
      isFollowingAuthor: true,
      content: newPostText.trim(),
      createdAt: 'Agora mesmo',
      likesCount: 0,
      likedByMe: false,
      comments: [],
      savedByMe: false,
    };
    const updated = [newPost, ...posts];
    setPosts(updated);
    setNewPostText('');
    setIsPosting(false);
  };

  // Filter posts based on active tab
  const filteredPosts = posts.filter((post) => {
    if (activeTab === 'seguindo') return post.isFollowingAuthor;
    if (activeTab === 'equipes') return post.authorType === 'team';
    if (activeTab === 'profissionais') return post.authorType === 'pro';
    return true;
  });

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* 5.5 Featured Carousel: EXATAMENTE 3 EVENTOS */}
      <FeaturedEventsCarousel
        events={FEATURED_EVENTS}
        onSelectEvent={onSelectEvent}
      />

      {/* QUICK STATS 4 CARDS: REFINED FONT SIZES & ELEGANT UI/UX */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Card 1: Meta Semanal */}
        <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-2xl p-3.5 flex items-center gap-3 transition-transform hover:scale-[1.02]">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 flex items-center justify-center text-[var(--ipace-primary)] shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--ipace-text-2)] truncate">
              Meta Semanal
            </div>
            <div className="font-heading font-black text-sm text-[var(--ipace-text)] truncate mt-0.5">
              {user ? `${user.totalKm > 35 ? 35 : (user.totalKm % 35).toFixed(1)} / 35 km` : '28.8 / 35 km'}
            </div>
          </div>
        </div>

        {/* Card 2: Seu Recorde 10K */}
        <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-2xl p-3.5 flex items-center gap-3 transition-transform hover:scale-[1.02]">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--ipace-text-2)] truncate">
              Recorde 10K
            </div>
            <div className="font-heading font-black text-sm text-[var(--ipace-text)] truncate mt-0.5">
              49:42 min
            </div>
          </div>
        </div>

        {/* Card 3: Rotas Populares */}
        <button
          type="button"
          onClick={() => onNavigateTab('tracking')}
          className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] hover:border-[var(--ipace-primary)] rounded-2xl p-3.5 flex items-center gap-3 text-left transition-all hover:scale-[1.02] cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--ipace-text-2)] truncate">
              Rotas no App
            </div>
            <div className="font-heading font-black text-sm text-[var(--ipace-text)] truncate mt-0.5">
              Explorar 40+
            </div>
          </div>
        </button>

        {/* Card 4: IA Coach */}
        <button
          type="button"
          onClick={() => onNavigateTab('ai-panel')}
          className="bg-[var(--ipace-soft)] border border-red-200 dark:border-red-900 rounded-2xl p-3.5 flex items-center gap-3 text-left transition-all hover:scale-[1.02] cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--ipace-primary)] text-white flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--ipace-primary)] truncate">
              IA Coach
            </div>
            <div className="font-heading font-black text-sm text-[var(--ipace-text)] truncate mt-0.5">
              Novo Feedback
            </div>
          </div>
        </button>
      </div>

      {/* Quick Post Box */}
      {isAuthenticated && user && (
        <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-4 shadow-sm">
          <form onSubmit={handleCreatePost}>
            <div className="flex items-start gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-[var(--ipace-border)] shrink-0"
              />
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="Compartilhe seu treino, meta ou foto com os amigos corredores..."
                rows={2}
                className="flex-1 p-2.5 rounded-2xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)] placeholder-[var(--ipace-text-2)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)] resize-none"
              />
            </div>
            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[var(--ipace-border)]">
              <span className="text-[11px] text-[var(--ipace-text-2)] flex items-center gap-1 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[var(--ipace-primary)]" />
                Dica: treinos gravados no app são publicados automaticamente!
              </span>
              <button
                type="submit"
                disabled={!newPostText.trim() || isPosting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-heading font-extrabold text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] disabled:opacity-40 transition-all shadow-sm cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Publicar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feed Filter Tabs */}
      <div className="flex items-center justify-between border-b border-[var(--ipace-border)] pb-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          {[
            { id: 'para-voce', label: 'Para você' },
            { id: 'seguindo', label: 'Seguindo' },
            { id: 'equipes', label: 'Equipes & Assessorias' },
            { id: 'profissionais', label: 'Profissionais' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[var(--ipace-primary)] text-white shadow-sm'
                    : 'bg-[var(--ipace-surface-2)] text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <span className="text-[11px] font-semibold text-[var(--ipace-text-2)] hidden sm:inline">
          {filteredPosts.length} postagens
        </span>
      </div>

      {/* Posts Feed List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-5 shadow-sm space-y-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[var(--ipace-surface-2)]" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-32 h-4 rounded bg-[var(--ipace-surface-2)]" />
                  <div className="w-20 h-3 rounded bg-[var(--ipace-surface-2)]" />
                </div>
              </div>
              <div className="w-full h-12 rounded bg-[var(--ipace-surface-2)]" />
              <div className="w-full h-40 rounded-2xl bg-[var(--ipace-surface-2)]" />
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6">
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center text-[var(--ipace-primary)] mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-extrabold text-base text-[var(--ipace-text)] mb-1">
            Nenhuma publicação encontrada
          </h3>
          <p className="text-xs text-[var(--ipace-text-2)] max-w-sm mx-auto mb-4">
            Experimente mudar a aba para &ldquo;Para você&rdquo; ou comece a seguir outros atletas da comunidade.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('para-voce')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] cursor-pointer"
          >
            Ver Todas as Publicações
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onToggleLike={handleToggleLike}
              onAddComment={handleAddComment}
              onToggleSave={handleToggleSave}
              onToggleFollow={handleToggleFollow}
              onReport={(p) => setReportingPost(p)}
              onBlock={handleBlockUser}
            />
          ))}
        </div>
      )}

      {/* Report Modal */}
      {reportingPost && (
        <ReportModal
          isOpen={!!reportingPost}
          onClose={() => setReportingPost(null)}
          onSubmit={handleReportSubmit}
          targetTitle={reportingPost.content.slice(0, 40) + '...'}
        />
      )}
    </div>
  );
};
