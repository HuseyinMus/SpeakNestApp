'use client';

import { useState, useEffect } from 'react';
import { db, storage } from '@/lib/firebase/config';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import RichTextEditor from './RichTextEditor';
import MediaUploader from './MediaUploader';
import CategorySelector from './CategorySelector';
import DocumentWorkflow from './DocumentWorkflow';
import { FiImage, FiTag, FiSave } from 'react-icons/fi';

interface BlogPost {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  categories: string[];
  tags: string[];
  status: 'draft' | 'review' | 'published' | 'rejected';
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: any;
  updatedAt: any;
}

interface BlogEditorProps {
  initialPost?: BlogPost;
  onSave?: (post: BlogPost) => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ initialPost, onSave }) => {
  const [post, setPost] = useState<BlogPost>({
    title: '',
    content: '',
    excerpt: '',
    categories: [],
    tags: [],
    status: 'draft',
    author: {
      id: '',
      name: '',
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPost) {
      setPost(initialPost);
    }
  }, [initialPost]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPost({ ...post, title: e.target.value });
  };

  const handleExcerptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost({ ...post, excerpt: e.target.value });
  };

  const handleContentChange = (content: string) => {
    setPost({ ...post, content });
  };

  const handleCoverImageUpload = async (url: string, type: string, name: string) => {
    setPost({ ...post, coverImage: url });
  };

  const handleCategorySelect = (category: any) => {
    setPost({
      ...post,
      categories: [...new Set([...post.categories, category.id])],
    });
  };

  const handleStatusChange = (newStatus: string, comment?: string) => {
    setPost({ ...post, status: newStatus as BlogPost['status'] });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      const postData = {
        ...post,
        updatedAt: serverTimestamp(),
      };

      if (post.id) {
        // Mevcut blog yazısını güncelle
        await updateDoc(doc(db, 'blog-posts', post.id), postData);
      } else {
        // Yeni blog yazısı oluştur
        const docRef = await addDoc(collection(db, 'blog-posts'), postData);
        setPost({ ...post, id: docRef.id });
      }

      if (onSave) {
        onSave(post);
      }
    } catch (err) {
      console.error('Blog yazısı kaydedilirken hata:', err);
      setError('Blog yazısı kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blog-editor space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <input
              type="text"
              value={post.title}
              onChange={handleTitleChange}
              placeholder="Blog başlığı"
              className="w-full text-3xl font-bold border-none focus:ring-0 p-0"
            />
          </div>

          <div>
            <textarea
              value={post.excerpt}
              onChange={handleExcerptChange}
              placeholder="Blog özeti"
              className="w-full border-none focus:ring-0 p-0 text-gray-600"
              rows={3}
            />
          </div>

          <div>
            <RichTextEditor
              initialValue={post.content}
              onChange={handleContentChange}
              placeholder="Blog içeriği"
              height="500px"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Yayın Ayarları</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kapak Görseli
                </label>
                <MediaUploader
                  onUploadComplete={handleCoverImageUpload}
                  folder="blog-covers"
                  acceptedTypes={['image/*']}
                />
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt="Kapak görseli"
                    className="mt-2 rounded-md w-full"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategoriler
                </label>
                <CategorySelector
                  onSelect={handleCategorySelect}
                  canCreate={true}
                  allowMultiple={true}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Etiketler
                </label>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <DocumentWorkflow
                  status={post.status}
                  onStatusChange={handleStatusChange}
                  canApprove={true}
                  canReject={true}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiSave className="mr-2" />
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor; 