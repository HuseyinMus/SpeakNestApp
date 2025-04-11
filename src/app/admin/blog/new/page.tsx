'use client';

import { useState } from 'react';
import EditorPanel from '@/components/editor/EditorPanel';
import { useRouter } from 'next/navigation';

export default function NewBlogPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    router.push('/admin/blog');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <EditorPanel onClose={handleClose} />
      </div>
    </div>
  );
} 