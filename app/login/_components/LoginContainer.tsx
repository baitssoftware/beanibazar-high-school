/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreate } from '@/hooks/APIHooks';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface SignInFormData {
  data: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | string[]>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const { mutateAsync: signUp } = useCreate('/auth/login', 'user');
  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const userData = {
        data: data.data,
        password: data.password,
      };

      try {
        await signUp({
          body: userData,
          callbacks: {
            onSuccess: (data) => {
              if (data?.success) {
                router.push('/dashboard');
              }
            },
            onError: (error: any) => {
              // error will now contain the complete backend error structure
              const errorMessage = error.errorMessages?.[0]?.message || error.message;
              setError(errorMessage);
            },
          },
        });
      } catch (error: any) {
        const errorMessage = error.errorMessages?.[0]?.message || error.message;
        setError(errorMessage);
      }
    } catch (err: any) {
      console.error('Full error:', err);

      if (err.message === 'Network Error') {
        setError('Unable to connect to the server. Please check your connection and try again.');
      } else if (err.message === 'Request timeout') {
        setError('Request timed out. Please try again.');
      } else if (err.errorMessages && Array.isArray(err.errorMessages)) {
        setError(err.errorMessages);
      } else {
        setError(err.message || 'An error occurred during signup');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-gray-600 hover:text-gray-900"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Log in to your account
        </h2>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            {Array.isArray(error) ? (
              <ul className="list-disc list-inside">
                {error.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            ) : (
              <p>{error}</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" action="#" method="POST">
          <div className="space-y-4">
            <div>
              <Label htmlFor="data">Email address / Phone Number</Label>
              <Input
                {...register('data', { required: 'Email address / Phone Number is required' })}
                id="data"
                name="data"
                type="data"
                autoComplete="data"
                required
                className="mt-1 w-full"
                placeholder="Email address or phone number"
              />
              {errors.data && <span className="text-red-500 text-sm">{errors.data.message}</span>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                {...register('password', { required: 'Password is required' })}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 w-full"
                placeholder="Password"
              />
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password.message}</span>
              )}
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
