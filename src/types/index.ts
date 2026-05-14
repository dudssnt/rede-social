export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string; // URL da foto de perfil (base64)
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: number;
  autorId: string;
  autor: string;
  autorAvatar?: string; // Mudar para string | undefined (sem null)
  conteudo: string;
  data: string;
}

export interface Post {
  id: number;
  autor: string;
  autorId: string;
  autorAvatar?: string; // Mudar para string | undefined (sem null)
  conteudo: string;
  imagem?: string;
  data: string;
  curtidas: string[];
  comentarios: Comment[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}