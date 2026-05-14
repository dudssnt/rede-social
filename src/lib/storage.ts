import { User, Post } from '@/types';

const STORAGE_KEYS = {
  USERS: 'social_users',
  POSTS: 'social_posts',
  CURRENT_USER: 'social_current_user'
};

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
    const posts = localStorage.getItem(STORAGE_KEYS.POSTS);
    return posts ? JSON.parse(posts) : [];
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

  getUserPosts: (userId: string): Post[] => {
    const posts = storage.getPosts();
    return posts.filter(post => post.autorId === userId);
  }
};