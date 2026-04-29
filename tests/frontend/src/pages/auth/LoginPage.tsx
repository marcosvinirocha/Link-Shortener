import { LoginForm } from '@/features/auth';

export const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-6 sm:py-8">
      <div className="w-full max-w-md mx-auto">
        <LoginForm />
      </div>
    </div>
  );
};
