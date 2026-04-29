import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createLinkSchema, type CreateLinkFormData } from '../schemas/link.schema';
import { linksService } from '../services/links.service';

interface CreateLinkFormProps {
  onSuccess: () => void;
}

const LinkIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

export const CreateLinkForm: React.FC<CreateLinkFormProps> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateLinkFormData>({
    resolver: zodResolver(createLinkSchema),
  });

  const onSubmit = async (data: CreateLinkFormData) => {
    try {
      await linksService.createLink(data.url);
      reset();
      onSuccess();
    } catch {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register('url')}
        type="url"
        label="URL"
        placeholder="https://exemplo.com"
        error={errors.url?.message}
        leftIcon={<LinkIcon />}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" variant="dark" isLoading={false}>
          Criar Link
        </Button>
      </div>
    </form>
  );
};
