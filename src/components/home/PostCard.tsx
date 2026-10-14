import React, { useState } from 'react';
import { Post, Comment } from '../../types';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Send,
  UserPlus,
  UserCheck,
  ShieldAlert,
  UserX,
  Activity as ActivityIcon,
  Flame,
  Check,
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onToggleSave: (postId: string) => void;
  onToggleFollow: (authorId: string) => void;
  onReport: (post: Post) => void;
  onBlock: (authorId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onToggleLike,
  onAddComment,
  onToggleSave,
  onToggleFollow,
  onReport,
  onBlock,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: `${post.authorName} no IPACE Running App`,
      text: post.content,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback to clipboard if dismissed
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${post.authorName} no IPACE: "${post.content}" - https://ipace.app/`);
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2200);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput.trim());
    setCommentInput('');
  };

  const authorBadge = {
    user: { label: 'Atleta', color: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300' },
    team: { label: 'Assessoria', color: 'bg-red-100 text-[var(--ipace-primary)] dark:bg-red-950/80 dark:text-red-300' },
    pro: { label: 'Profissional', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300' },
  }[post.authorType];

  return (
    <article className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-5 shadow-sm transition-all hover:shadow-md relative">
      {/* Toast Notification when link copied */}
      {copiedToast && (
        <div className="absolute top-4 right-14 z-20 bg-black/85 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg animate-fade-in">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          Link copiado para a área de transferência!
        </div>
      )}

      {/* Header: Author Info & Menu */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            className="w-11 h-11 rounded-full object-cover border border-[var(--ipace-border)] shrink-0"
            loading="lazy"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-heading font-black text-sm text-[var(--ipace-text)] truncate">
                {post.authorName}
              </h4>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${authorBadge.color}`}>
                {authorBadge.label}
              </span>
            </div>
            <div className="text-[11px] text-[var(--ipace-text-2)] flex items-center gap-1.5 mt-0.5">
              <span>@{post.authorUsername}</span>
              <span>•</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Right actions: Follow + Menu */}
        <div className="flex items-center gap-1 relative">
          <button
            type="button"
            onClick={() => onToggleFollow(post.authorId)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              post.isFollowingAuthor
                ? 'border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-[var(--ipace-text-2)] hover:border-red-400 hover:text-red-500'
                : 'bg-[var(--ipace-soft)] text-[var(--ipace-primary)] hover:bg-[var(--ipace-primary)] hover:text-white'
            }`}
          >
            {post.isFollowingAuthor ? (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                Seguindo
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                Seguir
              </>
            )}
          </button>

          {/* Three dots menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-full text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] hover:bg-[var(--ipace-surface-2)] transition-colors cursor-pointer"
              aria-label="Mais opções"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-44 bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-2xl shadow-xl py-1.5 z-30 animate-scale-up">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onReport(post);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Denunciar Post
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onBlock(post.authorId);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-semibold text-[var(--ipace-text)] hover:bg-[var(--ipace-surface-2)] flex items-center gap-2 cursor-pointer"
                >
                  <UserX className="w-4 h-4" />
                  Bloquear Usuário
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Text Content */}
      <p className="text-xs sm:text-sm text-[var(--ipace-text)] leading-relaxed mb-3 whitespace-pre-line">
        {post.content}
      </p>

      {/* Linked Activity Stats Box (if present) */}
      {post.activityStats && (
        <div className="bg-[var(--ipace-surface-2)] border border-[var(--ipace-border)] rounded-2xl p-3 sm:p-4 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 flex items-center justify-center text-[var(--ipace-primary)]">
              <ActivityIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--ipace-text-2)]">
                {post.activityStats.type === 'running' ? 'Treino de Corrida' : 'Caminhada'}
              </div>
              <div className="font-heading font-black text-base sm:text-lg text-[var(--ipace-text)]">
                {post.activityStats.distanceKm.toFixed(1)} km
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-right">
            <div>
              <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Duração</div>
              <div className="font-heading font-extrabold text-xs sm:text-sm text-[var(--ipace-text)]">
                {post.activityStats.durationStr}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Pace Médio</div>
              <div className="font-heading font-extrabold text-xs sm:text-sm text-[var(--ipace-primary)]">
                {post.activityStats.paceStr}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Image (if present) */}
      {post.imageUrl && (
        <div className="rounded-2xl overflow-hidden mb-3 border border-[var(--ipace-border)] max-h-96">
          <img
            src={post.imageUrl}
            alt="Foto do treino"
            className="w-full h-full object-cover hover:scale-101 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}

      {/* Interaction Footer: Curtir, Comentar, Compartilhar, Salvar */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--ipace-border)]">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Like Button with Counter */}
          <button
            type="button"
            onClick={() => onToggleLike(post.id)}
            className={`flex items-center gap-1.5 text-xs font-bold transition-all p-1.5 rounded-xl cursor-pointer ${
              post.likedByMe
                ? 'text-[var(--ipace-primary)] scale-105'
                : 'text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] hover:bg-[var(--ipace-surface-2)]'
            }`}
            aria-label="Curtir"
          >
            <Heart
              className={`w-5 h-5 transition-transform ${
                post.likedByMe ? 'fill-current text-[var(--ipace-primary)] animate-ping-once' : ''
              }`}
            />
            <span>{post.likesCount}</span>
          </button>

          {/* Comment Button with Counter */}
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-xs font-bold text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] p-1.5 rounded-xl hover:bg-[var(--ipace-surface-2)] transition-colors cursor-pointer"
            aria-label="Comentar"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments.length}</span>
          </button>

          {/* Share Button (Web Share API / Clipboard) */}
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-bold text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] p-1.5 rounded-xl hover:bg-[var(--ipace-surface-2)] transition-colors cursor-pointer"
            aria-label="Compartilhar"
          >
            <Share2 className="w-5 h-5" />
            <span className="hidden sm:inline">Compartilhar</span>
          </button>
        </div>

        {/* Save Post */}
        <button
          type="button"
          onClick={() => onToggleSave(post.id)}
          className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
            post.savedByMe
              ? 'text-[var(--ipace-primary)]'
              : 'text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] hover:bg-[var(--ipace-surface-2)]'
          }`}
          aria-label={post.savedByMe ? 'Salvo' : 'Salvar post'}
        >
          <Bookmark className={`w-5 h-5 ${post.savedByMe ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Inline Comments Thread */}
      {showComments && (
        <div className="mt-4 pt-3 border-t border-[var(--ipace-border)] space-y-3 animate-fade-in">
          {/* Comments List */}
          {post.comments.length === 0 ? (
            <div className="text-center py-2 text-xs text-[var(--ipace-text-2)]">
              Seja o primeiro a deixar uma mensagem de incentivo!
            </div>
          ) : (
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                  <img
                    src={comment.authorAvatar}
                    alt={comment.authorName}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 bg-[var(--ipace-surface-2)] rounded-2xl p-2.5 border border-[var(--ipace-border)]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[var(--ipace-text)]">{comment.authorName}</span>
                      <span className="text-[10px] text-[var(--ipace-text-2)]">{comment.createdAt}</span>
                    </div>
                    <p className="text-[var(--ipace-text-2)] mt-0.5">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Envie uma mensagem de incentivo..."
              className="flex-1 px-3.5 py-2 rounded-full border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)] placeholder-[var(--ipace-text-2)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)]"
            />
            <button
              type="submit"
              disabled={!commentInput.trim()}
              className="p-2 rounded-full bg-[var(--ipace-primary)] text-white hover:bg-[var(--ipace-hover)] disabled:opacity-40 transition-colors cursor-pointer"
              aria-label="Enviar comentário"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </article>
  );
};
