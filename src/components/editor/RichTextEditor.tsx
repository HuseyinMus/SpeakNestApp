'use client';

import { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  height?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  readOnly = false,
  placeholder = 'İçeriğinizi buraya yazın...',
  height = 500,
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[500px] bg-gray-100 rounded-md animate-pulse" />
    );
  }

  return (
    <div className="w-full">
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        value={value}
        onEditorChange={onChange}
        init={{
          height,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; }',
          placeholder,
          readonly: readOnly,
          branding: false,
          promotion: false,
          statusbar: false,
          image_advtab: true,
          image_title: true,
          automatic_uploads: true,
          file_picker_types: 'image',
          images_upload_url: '/api/upload',
          images_upload_handler: async (blobInfo, progress) => {
            return new Promise((resolve, reject) => {
              const formData = new FormData();
              formData.append('file', blobInfo.blob(), blobInfo.filename());

              fetch('/api/upload', {
                method: 'POST',
                body: formData,
              })
                .then(response => response.json())
                .then(result => {
                  resolve(result.url);
                })
                .catch(error => {
                  reject('Resim yüklenirken bir hata oluştu: ' + error);
                });
            });
          },
        }}
      />
    </div>
  );
} 