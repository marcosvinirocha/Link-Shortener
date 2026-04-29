import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout';
import { useAuth } from '@/features/auth';
import { linksService } from '@/features/links/services/links.service';
import { LinkList } from '@/features/links/components/LinkList';
import { CreateLinkForm } from '@/features/links/components/CreateLinkForm';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Button } from '@/components/ui/Button';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import type { Link, LinksResponse } from '@/types/links';

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const LinksContent: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [linkIdToDelete, setLinkIdToDelete] = useState<string | null>(null);
  const limit = 10;

  const fetchLinks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: LinksResponse = await linksService.getLinks(currentPage, limit);
      setLinks(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch {
      setLinks([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateSuccess = () => {
    setIsModalOpen(false);
    showToast('Link encurtado com sucesso!', 'success');
    setCurrentPage(1);
    fetchLinks();
  };

  const handleDelete = async () => {
    if (!linkIdToDelete) return;

    setIsDeleting(true);
    try {
      await linksService.deleteLink(linkIdToDelete);
      setLinkIdToDelete(null);
      showToast('Link deletado com sucesso!', 'success');
      setCurrentPage(1);
      fetchLinks();
    } catch {
      showToast('Erro ao deletar link', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout
      title="Links"
      userName={user?.name || 'Usuário'}
      onLogout={logout}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meus Links</h1>
            <p className="text-gray-500 mt-1">Gerencie seus links encurtados</p>
          </div>
          <Button variant="dark" onClick={() => setIsModalOpen(true)} leftIcon={<PlusIcon />}>
            Novo Link
          </Button>
        </div>

        <LinkList 
          links={links} 
          isLoading={isLoading}
          onDelete={setLinkIdToDelete}
          isDeleting={isDeleting}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Criar Novo Link"
        >
          <CreateLinkForm onSuccess={handleCreateSuccess} />
        </Modal>

        <ConfirmModal
          isOpen={!!linkIdToDelete}
          onClose={() => setLinkIdToDelete(null)}
          onConfirm={handleDelete}
          title="Confirmar Exclusão"
          message="Tem certeza que deseja deletar este link? Esta ação não pode ser desfeita."
          confirmText="Deletar"
          cancelText="Cancelar"
          isLoading={isDeleting}
        />
      </div>
    </DashboardLayout>
  );
};

export const LinksPage: React.FC = () => {
  return (
    <ToastProvider>
      <LinksContent />
    </ToastProvider>
  );
};
