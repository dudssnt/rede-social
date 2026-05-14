export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
}

export interface PostComment {  
  id: string;
  postId: number;
  autorId: string;
  autor: string;
  autorAvatar?: string;
  conteudo: string;
  data: string;
}

export interface Post {
  id: number;
  autor: string;
  autorId: string;
  autorAvatar?: string;
  conteudo: string;
  imagem?: string;
  data: string;
  curtidas: string[];
  comentarios: PostComment[];  
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}