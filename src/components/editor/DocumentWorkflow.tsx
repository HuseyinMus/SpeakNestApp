'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { FiCheck, FiX, FiEdit2, FiClock } from 'react-icons/fi';

type DocumentStatus = 'draft' | 'review' | 'published' | 'rejected';

interface DocumentWorkflowProps {
  documentId: string;
  currentStatus: DocumentStatus;
  onStatusChange?: (newStatus: DocumentStatus, comment?: string) => void;
  canApprove?: boolean;
  canReject?: boolean;
}

const DocumentWorkflow: React.FC<DocumentWorkflowProps> = ({
  documentId,
  currentStatus,
  onStatusChange,
  canApprove = true,
  canReject = true,
}) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusConfig = {
    draft: {
      label: 'Taslak',
      color: 'bg-gray-100 text-gray-800',
      icon: FiEdit2,
      nextStatus: 'review',
      actionLabel: 'İncelemeye Gönder',
    },
    review: {
      label: 'İncelemede',
      color: 'bg-yellow-100 text-yellow-800',
      icon: FiClock,
      nextStatus: 'published',
      actionLabel: 'Yayınla',
    },
    published: {
      label: 'Yayında',
      color: 'bg-green-100 text-green-800',
      icon: FiCheck,
      nextStatus: 'draft',
      actionLabel: 'Taslağa Al',
    },
    rejected: {
      label: 'Reddedildi',
      color: 'bg-red-100 text-red-800',
      icon: FiX,
      nextStatus: 'draft',
      actionLabel: 'Düzelt ve Tekrar Gönder',
    },
  };

  const handleStatusChange = async (newStatus: DocumentStatus) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Firestore'da belgeyi güncelle
      const docRef = doc(db, 'blog-posts', documentId);
      await updateDoc(docRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
        ...(comment && { lastComment: comment }),
      });

      // Üst bileşene bildir
      if (onStatusChange) {
        onStatusChange(newStatus, comment);
      }

      // Formu temizle
      setComment('');
    } catch (err) {
      console.error('Durum güncellenirken hata:', err);
      setError('Durum güncellenirken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentConfig = statusConfig[currentStatus];

  return (
    <div className="document-workflow space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <currentConfig.icon
            size={20}
            className={`${currentConfig.color.split(' ')[1]}`}
          />
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentConfig.color}`}>
            {currentConfig.label}
          </span>
        </div>

        {(currentStatus === 'review' && (canApprove || canReject)) && (
          <div className="flex space-x-2">
            {canApprove && (
              <button
                onClick={() => handleStatusChange('published')}
                disabled={isSubmitting}
                className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                Onayla
              </button>
            )}
            {canReject && (
              <button
                onClick={() => handleStatusChange('rejected')}
                disabled={isSubmitting}
                className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                Reddet
              </button>
            )}
          </div>
        )}

        {currentStatus !== 'review' && (
          <button
            onClick={() => handleStatusChange(currentConfig.nextStatus)}
            disabled={isSubmitting}
            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {currentConfig.actionLabel}
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-500 rounded-md text-sm">
          {error}
        </div>
      )}

      {(currentStatus === 'review' || currentStatus === 'rejected') && (
        <div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Yorum ekleyin (isteğe bağlı)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
      )}
    </div>
  );
};

export default DocumentWorkflow; 