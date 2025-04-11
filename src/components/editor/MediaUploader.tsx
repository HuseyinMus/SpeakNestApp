'use client';

import { useState, useRef } from 'react';
import { FiUpload, FiImage, FiVideo, FiFile } from 'react-icons/fi';

interface MediaUploaderProps {
  onUploadComplete: (url: string, type: string, name: string) => void;
  folder?: string;
  acceptedTypes?: string[];
  maxSize?: number;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUploadComplete,
  folder = 'uploads',
  acceptedTypes = ['image/*', 'video/*', 'application/pdf'],
  maxSize = 5 * 1024 * 1024, // 5MB
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setError(null);
      setUploadProgress(0);

      // Dosya tipi kontrolü
      if (!acceptedTypes.some(type => {
        if (type.includes('/*')) {
          return file.type.startsWith(type.split('/*')[0]);
        }
        return file.type === type;
      })) {
        throw new Error('Desteklenmeyen dosya tipi');
      }

      // Dosya boyutu kontrolü
      if (file.size > maxSize) {
        throw new Error(`Dosya boyutu ${maxSize / (1024 * 1024)}MB'den büyük olamaz`);
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      if (!response.ok) {
        throw new Error('Yükleme başarısız');
      }

      const data = await response.json();
      onUploadComplete(data.url, file.type, file.name);
      setUploadProgress(0);
    } catch (err) {
      console.error('Dosya yükleme hatası:', err);
      setError(err instanceof Error ? err.message : 'Dosya yüklenemedi');
    }
  };

  const getFileIcon = () => {
    if (acceptedTypes.includes('image/*')) return <FiImage size={24} />;
    if (acceptedTypes.includes('video/*')) return <FiVideo size={24} />;
    return <FiFile size={24} />;
  };

  return (
    <div className="media-uploader">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
        />
        
        <div className="flex flex-col items-center space-y-2">
          {getFileIcon()}
          <p className="text-sm text-gray-600">
            Dosyayı sürükleyin veya{' '}
            <span className="text-blue-500">seçin</span>
          </p>
          <p className="text-xs text-gray-500">
            Maksimum dosya boyutu: {maxSize / (1024 * 1024)}MB
          </p>
        </div>
      </div>

      {uploadProgress > 0 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">
            %{uploadProgress}
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default MediaUploader; 