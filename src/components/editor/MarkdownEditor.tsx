'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { marked } from 'marked';

// Markdown düzenleyiciyi client tarafında yüklemek için
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p className="py-4 px-2 bg-slate-100 animate-pulse rounded-md">Yükleniyor...</p>,
});

interface MarkdownEditorProps {
  initialValue?: string;
  placeholder?: string;
  onChange: (content: string) => void;
  height?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialValue = '',
  placeholder = 'Markdown formatında yazın...',
  onChange,
  height = '400px',
}) => {
  const [value, setValue] = useState(initialValue);
  const [mounted, setMounted] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (content: string) => {
    setValue(content);
    onChange(content);
  };

  // Markdown düzenleyici için özel modüller
  const modules = {
    toolbar: [
      ['bold', 'italic', 'strike'], // temel formatlamalar
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // başlıklar
      [{ list: 'ordered' }, { list: 'bullet' }], // listeler
      ['blockquote', 'code-block'], // blok elementleri
      ['link', 'image'], // bağlantılar ve resimler
      ['clean'], // formatlamayı temizleme
    ],
  };

  if (!mounted) {
    return <div className="h-64 w-full bg-slate-100 animate-pulse rounded-md"></div>;
  }

  return (
    <div className="markdown-editor border border-slate-200 rounded-md overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex justify-between">
        <div className="text-sm font-medium text-slate-700">Markdown Editör</div>
        <button
          onClick={() => setPreview(!preview)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {preview ? 'Düzenle' : 'Önizleme'}
        </button>
      </div>

      {preview ? (
        <div 
          className="markdown-preview p-4"
          style={{ minHeight: height }}
          dangerouslySetInnerHTML={{ 
            __html: marked(value, { breaks: true }) 
          }}
        />
      ) : (
        <ReactQuill
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={modules}
          placeholder={placeholder}
          style={{ height }}
        />
      )}
    </div>
  );
};

export default MarkdownEditor; 