'use client';

import { User, Post, PostComment } from '@/types';

const STORAGE_KEYS = {
  USERS: 'social_users',
  POSTS: 'social_posts',
  CURRENT_USER: 'social_current_user'
};

const MOCKED_POSTS: Post[] = [
  {
    id: 1,
    autor: "Whiskers Felino",
    autorId: "mock_gato1",
    autorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Whiskers",
    conteudo: "Meu gato finalmente pegou o rato de brinquedo depois de 3 horas de caça! 🐱🎯 Ele está muito orgulhoso!",
    imagem: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500",
    data: new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    curtidas: [],
    comentarios: []
  },
  {
    id: 2,
    autor: "Mia Miau",
    autorId: "mock_gato2",
    autorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia",
    conteudo: "Sabe aquele momento que seu gato decide que seu teclado é a melhor cama do mundo? 🐱💻 Pois é... trabalho vai ter que esperar!",
    imagem: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500",
    data: new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    curtidas: [],
    comentarios: []
  },
  {
    id: 3,
    autor: "Tom Gatuno",
    autorId: "mock_gato3",
    autorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
    conteudo: "Meu gato trouxe um 'presente' hoje... uma folha seca. Ele estava tão feliz que eu tive que elogiar! 🍂😸",
    imagem: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=500",
    data: new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    curtidas: [],
    comentarios: []
  },
  {
    id: 4,
    autor: "Luna Peluda",
    autorId: "mock_gato4",
    autorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
    conteudo: "Dica do dia: caixa de papelão >>> qualquer brinquedo caro. Meu gato confirma! 📦🐱",
    imagem: "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=500",
    data: new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    curtidas: [],
    comentarios: []
  },
  {
    id: 5,
    autor: "Simba Real",
    autorId: "mock_gato5",
    autorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Simba",
    conteudo: "3 da manhã e meu gato decidiu que é hora do rock'n'roll. Correria pela casa inteira! 🏃‍♂️🐱🎸",
    imagem: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=500",
    data: new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    curtidas: [],
    comentarios: []
  },
  {
    id: 6,
    autor: "Nina Ronron",
    autorId: "mock_gato6",
    autorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nina",
    conteudo: "Adotei um novo membro para a família! Conheçam o Frederico, o gato mais dengoso do mundo! 🐱❤️",
    imagem: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=500",
    data: new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    curtidas: [],
    comentarios: []
  },
  {
    id: 7,
    autor: "Felix Esperto",
    autorId: "mock_gato7",
    autorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    conteudo: "Meu gato aprendeu a abrir a geladeira. Estou com medo. Muito medo. O que ele fará com esse poder? 😱🐱",
    imagem: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=500",
    data: new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    curtidas: [],
    comentarios: []
  },
  {
    id: 8,
    autor: "Bolinha Fofa",
    autorId: "mock_gato8",
    autorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bolinha",
    conteudo: "Quem mais tem um gato que dorme em posições completamente aleatórias? Mostrem seus gatos doidões! 😸🛌",
    imagem: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500",
    data: new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    curtidas: [],
    comentarios: []
  },
  {
    id: 9,
    autor: "Garfield Laranja",
    autorId: "mock_gato9",
    autorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Garfield",
    conteudo: "Segunda-feira é o dia de ódio nacional do meu gato. Ele só quer dormir e comer. Almas gêmeas! 😾😸",
    imagem: "https://images.unsplash.com/photo-1577023311546-cdc07a8454d9?w=500",
    data: new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    curtidas: [],
    comentarios: []
  },
  {
    id: 10,
    autor: "Gatinho",
    autorId: "mock_gato10",
    autorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Princesa",
    conteudo: "Meu gato exige que a porta fique entreaberta exatamente 5cm. Nem mais, nem menos. Caso contrário, o drama é imenso! 🚪🐱",
    imagem: undefined,
    data: new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    curtidas: [],
    comentarios: []
  }
];

export const storage = {
  getUsers: (): User[] => {
    if (typeof window === 'undefined') return [];
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },

  saveUsers: (users: User[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  saveCurrentUser: (user: User | null): void => {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getPosts: (): Post[] => {
    if (typeof window === 'undefined') return [];
    
    const storedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
    let userPosts: Post[] = storedPosts ? JSON.parse(storedPosts) : [];
    
    const allPosts = [...MOCKED_POSTS, ...userPosts];
    
    const uniquePosts = allPosts.filter((post, index, self) => 
      index === self.findIndex((p) => p.id === post.id)
    );
    
    uniquePosts.sort((a, b) => b.id - a.id);
    
    return uniquePosts;
  },

  savePosts: (posts: Post[]): void => {
    if (typeof window === 'undefined') return;
    
    const userPosts = posts.filter(post => post.id > 100);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(userPosts));
  },

  addPost: (post: Post): void => {
    const currentPosts = storage.getPosts();
    const userPosts = currentPosts.filter(p => p.id > 100);
    userPosts.unshift(post);
    storage.savePosts(userPosts);
  },

  deletePost: (postId: number): void => {
    // Não permitir deletar posts mockados (IDs <= 100)
    if (postId <= 100) {
      alert('🐱 Posts sobre gatos são eternos! Não podem ser deletados. 😸');
      return;
    }
    
    const currentPosts = storage.getPosts();
    const userPosts = currentPosts.filter(p => p.id > 100);
    const filteredPosts = userPosts.filter(post => post.id !== postId);
    storage.savePosts(filteredPosts);
  },

  updatePost: (postId: number, updates: Partial<Post>): void => {
    if (postId <= 100) return; // Não atualizar posts mockados
    
    const currentPosts = storage.getPosts();
    const userPosts = currentPosts.filter(p => p.id > 100);
    const index = userPosts.findIndex(p => p.id === postId);
    if (index !== -1) {
      userPosts[index] = { ...userPosts[index], ...updates };
      storage.savePosts(userPosts);
    }
  },

  toggleLike: (postId: number, userId: string): void => {
    const posts = storage.getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      if (post.curtidas.includes(userId)) {
        post.curtidas = post.curtidas.filter(id => id !== userId);
      } else {
        post.curtidas.push(userId);
      }
      
      // Salvar apenas se não for post mockado
      if (postId > 100) {
        const userPosts = posts.filter(p => p.id > 100);
        storage.savePosts(userPosts);
      }
    }
  },

  addComment: (postId: number, comment: PostComment): void => {
    const posts = storage.getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.comentarios.push(comment);
      
      if (postId > 100) {
        const userPosts = posts.filter(p => p.id > 100);
        storage.savePosts(userPosts);
      }
    }
  },

  getUserPosts: (userId: string): Post[] => {
    const posts = storage.getPosts();
    return posts.filter(post => post.autorId === userId && post.id > 100);
  },

  updateUser: (userId: string, updates: Partial<User>): void => {
    const users = storage.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      storage.saveUsers(users);
      
      const currentUser = storage.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        storage.saveCurrentUser(users[index]);
      }
    }
  }
};