'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { Post, User } from '@/types';
import { storage } from '@/lib/storage';

interface CreatePostProps {
  currentUser: User;
  onPostCreated: (post: Post) => void;
}

export default function CreatePost({ currentUser, onPostCreated }: CreatePostProps) {
  const [conteudo, setConteudo] = useState('');
  const [imagem, setImagem] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagem(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagem(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conteudo.trim() && !imagem) return;

    setIsPosting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newPost: Post = {
      id: Date.now(),
      autor: currentUser.name,
      autorId: currentUser.id,
      autorAvatar: currentUser.avatar || undefined,
      conteudo: conteudo.trim() || "📷 Nova imagem!",
      imagem: imagem || undefined,
      data: new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      curtidas: [],
      comentarios: []
    };

    storage.addPost(newPost);
    onPostCreated(newPost);
    setConteudo('');
    setImagem(null);
    setIsPosting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Post</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="O que está acontecendo? Compartilhe algo com seus amigos..."
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            className="min-h-[100px] resize-none"
            disabled={isPosting}
          />
          
          {imagem && (
            <div className="relative">
              <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={imagem}
                  alt="Preview"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </CardContent>
        
        <CardFooter className="justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPosting}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Anexar foto
          </Button>
          
          <Button type="submit" disabled={isPosting || (!conteudo.trim() && !imagem)}>
            {isPosting ? 'Publicando...' : 'Publicar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}