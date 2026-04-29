import React from 'react';
import type { Link } from '@/types/links';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';

interface LinkListProps {
  links: Link[];
  isLoading?: boolean;
  onDelete: (linkId: string) => void;
  isDeleting?: boolean;
}

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const truncateUrl = (url: string, maxLength: number = 50): string => {
  if (url.length <= maxLength) return url;
  return `${url.substring(0, maxLength)}...`;
};

const LinkCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse md:hidden">
    <div className="space-y-3">
      <div>
        <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="flex justify-between">
        <div>
          <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
        <div>
          <div className="h-3 bg-gray-200 rounded w-12 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-9 bg-gray-200 rounded flex-1"></div>
        <div className="h-9 bg-gray-200 rounded flex-1"></div>
      </div>
    </div>
  </div>
);

interface LinkCardProps {
  link: Link;
  onCopy: (url: string) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onCopy, onDelete, isDeleting }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
    <div className="space-y-3">
      <div>
        <p className="text-xs text-gray-500 mb-1">URL Original</p>
        <p className="text-sm text-gray-900 truncate" title={link.originalUrl}>
          {link.originalUrl}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">Link Curto</p>
          <p className="text-sm text-blue-600 font-medium">
            {link.shortCode}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">Cliques</p>
          <p className="text-lg font-bold text-gray-900">
            {link.clickCount}
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500">
          Criado em {formatDate(link.createdAt)}
        </p>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onCopy(link.shortUrl)}
          leftIcon={<CopyIcon />}
        >
          Copiar
        </Button>
        <Button
          variant="danger"
          size="sm"
          className="flex-1"
          onClick={() => onDelete(link.id)}
          isLoading={isDeleting}
          leftIcon={<TrashIcon />}
        >
          Deletar
        </Button>
      </div>
    </div>
  </div>
);

export const LinkList: React.FC<LinkListProps> = ({ links, isLoading, onDelete, isDeleting = false }) => {
  const { showToast } = useToast();

  const handleCopy = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      showToast('Link copiado com sucesso!', 'success');
    } catch {
      showToast('Erro ao copiar link', 'error');
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="space-y-4 md:hidden">
          {[...Array(5)].map((_, i) => (
            <LinkCardSkeleton key={i} />
          ))}
        </div>
        <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL Original</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link Curto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Criação</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliques</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-48"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                  <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-20"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  if (links.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gray-100 rounded-full">
            <LinkIcon />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Nenhum link encontrado</h3>
        <p className="text-gray-500 mt-1">Comece encurtando sua primeira URL!</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 md:hidden">
        {links.map((link) => (
          <LinkCard
            key={link.id}
            link={link}
            onCopy={handleCopy}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        ))}
      </div>

      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL Original
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Link Curto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Criação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliques
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {links.map((link) => (
                <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={link.originalUrl}>
                      {truncateUrl(link.originalUrl)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-blue-600 font-medium">
                      {link.shortCode}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(link.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-semibold">
                      {link.clickCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(link.shortUrl)}
                        leftIcon={<CopyIcon />}
                      >
                        Copiar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(link.id)}
                        disabled={isDeleting}
                        leftIcon={<TrashIcon />}
                      >
                        Deletar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
