'use client';

import { User, Post, Comment } from '@/types';

const STORAGE_KEYS = {
  USERS: 'social_users',
  POSTS: 'social_posts',
  CURRENT_USER: 'social_current_user'
};

export const storage = {
  // ============== USER METHODS ==============
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

  // ============== POST METHODS ==============
  getPosts: (): Post[] => {
    if (typeof window === 'undefined') return [];
    const posts = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (!posts) {
      // Retorna array vazio ao invés de posts pré-definidos
      storage.savePosts([]);
      return [];
    }
    return JSON.parse(posts);
  },

  savePosts: (posts: Post[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  },

  addPost: (post: Post): void => {
    const posts = storage.getPosts();
    posts.unshift(post);
    storage.savePosts(posts);
  },

  deletePost: (postId: number): void => {
    const posts = storage.getPosts();
    const filteredPosts = posts.filter(post => post.id !== postId);
    storage.savePosts(filteredPosts);
  },

  updatePost: (postId: number, updates: Partial<Post>): void => {
    const posts = storage.getPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...updates };
      storage.savePosts(posts);
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
      storage.savePosts(posts);
    }
  },

  addComment: (postId: number, comment: Comment): void => {
  const posts = storage.getPosts();
  const post = posts.find(p => p.id === postId);
  if (post) {
    const normalizedComment = {
      ...comment,
      autorAvatar: comment.autorAvatar || undefined
    };
    post.comentarios.push(normalizedComment);
    storage.savePosts(posts);
  }
},

  getUserPosts: (userId: string): Post[] => {
    const posts = storage.getPosts();
    return posts.filter(post => post.autorId === userId);
  },

  // ============== PROFILE METHODS ==============
  updateUser: (userId: string, updates: Partial<User>): void => {
    const users = storage.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      storage.saveUsers(users);
      
      // Update current user if it's the same
      const currentUser = storage.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        storage.saveCurrentUser(users[index]);
      }
      
      // Update author info in posts
      const posts = storage.getPosts();
      posts.forEach(post => {
        if (post.autorId === userId) {
          post.autor = users[index].name;
          post.autorAvatar = users[index].avatar;
        }
        post.comentarios.forEach(comment => {
          if (comment.autorId === userId) {
            comment.autor = users[index].name;
            comment.autorAvatar = users[index].avatar;
          }
        });
      });
      storage.savePosts(posts);
    }
  }
};