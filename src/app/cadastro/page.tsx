'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthForm from '@/components/AuthForm';
import { AuthService } from '@/lib/auth';

export default function CadastroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  const handleRegister = async (data: { name?: string; email: string; password: string }) => {
    if (!data.name) {
      setError('Nome é obrigatório');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = AuthService.register(data.name, data.email, data.password);
      if (success) {
        router.push('/');
      } else {
        setError('Email já está em uso');
      }
    } catch (err) {
      setError('Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-md space-y-4">
        <AuthForm type="cadastro" onSubmit={handleRegister} loading={loading} />
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}
        
        <div className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}