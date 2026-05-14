'use client';

import { User } from '@/types';
import { storage } from './storage';

export class AuthService {
  static register(name: string, email: string, password: string): boolean {
    const users = storage.getUsers();
    
    if (users.some(user => user.email === email)) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      bio: "Olá! Estou usando a Mini Rede Social! 🚀",
      avatar: null,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    storage.saveUsers(users);
    storage.saveCurrentUser(newUser);
    return true;
  }

  static login(email: string, password: string): boolean {
    const users = storage.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      storage.saveCurrentUser(user);
      return true;
    }
    return false;
  }

  static logout(): void {
    storage.saveCurrentUser(null);
  }

  static isAuthenticated(): boolean {
    return storage.getCurrentUser() !== null;
  }

  static getCurrentUser(): User | null {
    return storage.getCurrentUser();
  }

  static updateProfile(updates: Partial<User>): void {
    const currentUser = storage.getCurrentUser();
    if (currentUser) {
      storage.updateUser(currentUser.id, updates);
    }
  }
}