import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';
import { registerSchema, type RegisterFormData } from '../schemas';
import { useAuth } from '../hooks';

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export const RegisterForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    const result = await registerUser(data.name, data.email, data.password);
    if (result.success) {
      navigate('/dashboard');
    } else if (result.error) {
      setServerError(result.error);
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl sm:text-xl">Criar uma conta</CardTitle>
        <CardDescription>Preencha seus dados para começar</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
          {serverError && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{serverError}</p>
            </div>
          )}

          <Input
            {...register('name')}
            type="text"
            label="Nome completo"
            placeholder="João Silva"
            autoComplete="name"
            leftIcon={<UserIcon />}
            error={errors.name?.message}
            disabled={isLoading}
          />

          <Input
            {...register('email')}
            type="email"
            label="E-mail"
            placeholder="seu@email.com"
            autoComplete="email"
            leftIcon={<EmailIcon />}
            error={errors.email?.message}
            disabled={isLoading}
          />

          <Input
            {...register('password')}
            type="password"
            label="Senha"
            placeholder="Crie uma senha"
            autoComplete="new-password"
            leftIcon={<LockIcon />}
            error={errors.password?.message}
            disabled={isLoading}
          />

          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p className="flex items-center gap-1.5">
              <CheckIcon />
              Mínimo de 8 caracteres
            </p>
            <p className="flex items-center gap-1.5">
              <CheckIcon />
              Uma letra maiúscula
            </p>
            <p className="flex items-center gap-1.5">
              <CheckIcon />
              Um número
            </p>
          </div>

          <Input
            {...register('confirmPassword')}
            type="password"
            label="Confirmar senha"
            placeholder="Confirme sua senha"
            autoComplete="new-password"
            leftIcon={<LockIcon />}
            error={errors.confirmPassword?.message}
            disabled={isLoading}
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Criar conta
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Já tem uma conta?{' '}
          <Link
            to="/login"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Fazer login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
