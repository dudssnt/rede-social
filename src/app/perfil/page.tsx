'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth';
import { storage } from '@/lib/storage';
import { User, Post, PostComment } from '@/types'; // Mudar de Comment para PostComment
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon, Mail, FileText, Edit2, Camera } from 'lucide-react';

export default function PerfilPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
    
    if (user) {
      setEditName(user.name);
      setEditBio(user.bio || '');
      setEditAvatar(user.avatar || null);
      const posts = storage.getUserPosts(user.id);
      setUserPosts(posts);
    }
    
    setLoading(false);
  }, [router]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (currentUser) {
      const updates = {
        name: editName,
        bio: editBio,
        avatar: editAvatar || undefined
      };
      AuthService.updateProfile(updates);
      
      setCurrentUser({ ...currentUser, ...updates });
      setIsEditing(false);
      
      const posts = storage.getUserPosts(currentUser.id);
      setUserPosts(posts);
    }
  };

  const handleDeletePost = (postId: number) => {
    storage.deletePost(postId);
    if (currentUser) {
      const updatedPosts = storage.getUserPosts(currentUser.id);
      setUserPosts(updatedPosts);
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
          {/* Informações do Perfil */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Perfil
              </CardTitle>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              )}
            </CardHeader>
            
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={editAvatar || ''} />
                        <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          {editName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </div>
                    
                    <div className="w-full space-y-2">
                      <label className="text-sm font-medium">Nome</label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </div>
                    
                    <div className="w-full space-y-2">
                      <label className="text-sm font-medium">Bio</label>
                      <Textarea
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        placeholder="Conte um pouco sobre você..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveProfile} className="flex-1">
                        Salvar
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={currentUser.avatar || ''} />
                      <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold text-xl">{currentUser.name}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {currentUser.email}
                      </div>
                    </div>
                  </div>
                  
                  {currentUser.bio && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-700">{currentUser.bio}</div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                    <FileText className="h-4 w-4" />
                    Total de posts: {userPosts.length}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Posts do Usuário */}
          <Card>
            <CardHeader>
              <CardTitle>Meus Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {userPosts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Você ainda não fez nenhum post.
                </div>
              ) : (
                <div className="space-y-4">
                  {userPosts.map(post => (
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
                      onLike={() => {}}
                      onComment={() => {}}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}