'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth';
import { storage } from '@/lib/storage';
import { Post, User } from '@/types';
import Header from '@/components/Header';
import CreatePost from '@/components/CreatePost';
import PostCard from '@/components/PostCard';

export default function FeedPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
    loadPosts();
    setLoading(false);
  }, [router]);

  const loadPosts = () => {
    const allPosts = storage.getPosts();
    setPosts(allPosts);
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handleDeletePost = (postId: number) => {
    storage.deletePost(postId);
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  const handleLike = (postId: number) => {
    if (currentUser) {
      storage.toggleLike(postId, currentUser.id);
      loadPosts(); 
    }
  };

  const handleComment = (postId: number, commentText: string) => {
    if (currentUser) {
      const comment = {
        id: Date.now().toString(),
        postId,
        autorId: currentUser.id,
        autor: currentUser.name,
        autorAvatar: currentUser.avatar,
        conteudo: commentText,
        data: new Date().toLocaleDateString('pt-BR', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        })
      };
      storage.addComment(postId, comment);
      loadPosts(); 
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!currentUser) return null;

  return (
    <>
      <Header user={currentUser} />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          <CreatePost currentUser={currentUser} onPostCreated={handlePostCreated} />
          
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-muted-foreground">Nenhum post ainda. Seja o primeiro a publicar!</p>
              </div>
            ) : (
              posts.map(post => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  autor={post.autor}
                  autorId={post.autorId}
                  autorAvatar={post.autorAvatar}
                  conteudo={post.conteudo}
                  imagem={post.imagem}
                  data={post.data}
                  curtidas={post.curtidas}
                  comentarios={post.comentarios}
                  currentUserId={currentUser.id}
                  currentUserAvatar={currentUser.avatar}
                  currentUserName={currentUser.name}
                  onDelete={handleDeletePost}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}