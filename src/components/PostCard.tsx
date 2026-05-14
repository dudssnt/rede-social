'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Trash2, Send } from 'lucide-react';
import Image from 'next/image';
import { PostComment } from '@/types'; // Mudar de Comment para PostComment

interface PostCardProps {
  id: number;
  autor: string;
  autorId: string;
  autorAvatar?: string;
  conteudo: string;
  imagem?: string;
  data: string;
  curtidas: string[];
  comentarios: PostComment[]; // Mudar para PostComment[]
  currentUserId?: string;
  currentUserAvatar?: string;
  currentUserName?: string;
  onDelete?: (id: number) => void;
  onLike?: (id: number) => void;
  onComment?: (id: number, comment: string) => void;
}

export default function PostCard({ 
  id, 
  autor, 
  autorId, 
  autorAvatar,
  conteudo, 
  imagem,
  data, 
  curtidas,
  comentarios,
  currentUserId,
  currentUserAvatar,
  currentUserName,
  onDelete,
  onLike,
  onComment
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const isOwner = currentUserId === autorId;
  const isLiked = currentUserId ? curtidas.includes(currentUserId) : false;

  const handleComment = () => {
    if (newComment.trim() && onComment) {
      onComment(id, newComment);
      setNewComment('');
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Avatar>
          <AvatarImage src={autorAvatar || ''} />
          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            {autor.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-semibold">{autor}</div>
          <div className="text-xs text-muted-foreground">{data}</div>
        </div>
        {isOwner && onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-700 whitespace-pre-wrap">{conteudo}</p>
        
        {imagem && (
          <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={imagem}
              alt="Post image"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-4">
        <div className="flex gap-4 w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike?.(id)}
            className={isLiked ? 'text-red-500' : ''}
          >
            <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
            {curtidas.length} curtidas
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {comentarios.length} comentários
          </Button>
        </div>

        {showComments && (
          <div className="w-full space-y-4 pt-4 border-t">
            {/* Comentários existentes */}
            {comentarios.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.autorAvatar || ''} />
                  <AvatarFallback className="text-xs">
                    {comment.autor.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="font-semibold text-sm">{comment.autor}</div>
                    <div className="text-sm">{comment.conteudo}</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{comment.data}</div>
                </div>
              </div>
            ))}
            
            {/* Novo comentário */}
            {currentUserId && (
              <div className="flex gap-3 items-start">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUserAvatar || ''} />
                  <AvatarFallback>
                    {currentUserName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Textarea
                    placeholder="Escreva um comentário..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[60px] resize-none"
                  />
                  <Button onClick={handleComment} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}