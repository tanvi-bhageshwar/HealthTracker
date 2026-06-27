import React, { useState } from 'react';
import { MessageSquareHeart, Plus, Heart, MessageSquare, Send, Calendar, Sparkles } from 'lucide-react';
import { ForumPost, Comment, UserProfile } from '../types';

interface CommunityForumProps {
  posts: ForumPost[];
  profile: UserProfile;
  onAddPost: (content: string) => void;
  onLikePost: (id: string) => void;
  onAddComment: (postId: string, content: string) => void;
}

export default function CommunityForum({ posts, profile, onAddPost, onLikePost, onAddComment }: CommunityForumProps) {
  const [postText, setPostText] = useState('');
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;

    onAddPost(postText.trim());
    setPostText('');
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    onAddComment(postId, text.trim());
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const handleCommentInputChange = (postId: string, value: string) => {
    setCommentInputs({ ...commentInputs, [postId]: value });
  };

  return (
    <div id="forum-view" className="space-y-6 animate-fade-in">
      <div className="text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center md:justify-start gap-2">
            <MessageSquareHeart className="text-teal-500 w-6 h-6 animate-pulse" />
            Health & Wellness Forum
          </h2>
          <p className="text-sm text-slate-400 mt-1">Engage with community members. Post healthy lifestyle achievements and discussions.</p>
        </div>

        <div className="px-3 py-1 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 rounded-full text-xs font-semibold flex items-center gap-1.5 w-max mx-auto md:mx-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
          Realtime Social Engine
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form post */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm max-h-[350px]">
          <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-1.5">
            <span>📣</span> Share a Wellness Tip
          </h3>

          <form onSubmit={handlePostSubmit} className="space-y-4">
            <div>
              <textarea 
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="Share your daily healthy lifestyle habit with the community..." 
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-5/50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-teal-500 text-sm h-28 resize-none transition-all"
                maxLength={250}
                required
              ></textarea>
              <p className="text-[10px] text-slate-400 text-right mt-1 font-medium">Max 250 characters</p>
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-teal-500/15 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-sm"
            >
              <Plus className="w-5 h-5" />
              Publish Post To feed
            </button>
          </form>
        </div>

        {/* Right Column: Forum feed list */}
        <div className="lg:col-span-7 space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {posts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-white text-xs font-bold flex items-center justify-center uppercase shadow-sm">
                    {post.username.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{post.username}</h4>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-450" />
                      {post.time}
                    </p>
                  </div>
                </div>

                <span className="text-[9px] font-bold tracking-wider uppercase text-slate-400 bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-850">
                  Member
                </span>
              </div>

              {/* Post Content */}
              <p className="text-sm text-slate-750 dark:text-slate-300 leading-relaxed font-sans">
                {post.content}
              </p>

              {/* Post Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onLikePost(post.id)}
                    className={`flex items-center gap-1 py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                      post.likedByMe 
                        ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-500 font-bold' 
                        : 'hover:bg-rose-50/30 hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.likedByMe ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{post.likes}</span>
                  </button>

                  <button
                    onClick={() => setActiveCommentsPostId(activeCommentsPostId === post.id ? null : post.id)}
                    className={`flex items-center gap-1 py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                      activeCommentsPostId === post.id 
                        ? 'bg-teal-50 dark:bg-teal-950/30 text-teal-500 font-bold' 
                        : 'hover:bg-teal-50/30 hover:text-teal-550'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments.length} Comments</span>
                  </button>
                </div>
              </div>

              {/* Comments Area (Collapsible) */}
              {activeCommentsPostId === post.id && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-fade-in bg-slate-50/40 dark:bg-slate-950/10 p-3 rounded-xl">
                  {/* Comments list */}
                  {post.comments.length > 0 && (
                    <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 dark:text-slate-300">{comment.username}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
                            {comment.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add comment input */}
                  <form 
                    onSubmit={(e) => handleCommentSubmit(post.id, e)}
                    className="flex gap-2"
                  >
                    <input 
                      type="text" 
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => handleCommentInputChange(post.id, e.target.value)}
                      placeholder="Post a healthy reply..."
                      className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-850 rounded-lg bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-teal-500 text-xs"
                      required
                    />
                    <button 
                      type="submit"
                      className="p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all cursor-pointer flex items-center justify-center shrink-0"
                      title="Post comment"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
