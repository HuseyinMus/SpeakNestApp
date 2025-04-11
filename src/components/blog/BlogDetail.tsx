'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import { FiClock, FiTag, FiUser, FiShare2 } from 'react-icons/fi';
import { RichTextEditor } from '../editor/RichTextEditor';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  categories: string[];
  tags: string[];
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: any;
  updatedAt: any;
}

interface BlogDetailProps {
  postId: string;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ postId }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);

      const docRef = doc(db, 'blog-posts', postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setPost({
          id: docSnap.id,
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          coverImage: data.coverImage,
          categories: data.categories,
          tags: data.tags,
          author: data.author,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      } else {
        setError('Blog yazısı bulunamadı.');
      }
    } catch (err) {
      console.error('Blog yazısı alınırken hata:', err);
      setError('Blog yazısı yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-500 p-4 rounded-md text-center">
          {error}
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FiUser size={16} />
              <span>{post.author.name}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <FiClock size={16} />
              <span>
                {new Date(post.createdAt?.toDate()).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
          
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
          >
            <FiShare2 size={16} />
            <span>Paylaş</span>
          </button>
        </div>
        
        {post.coverImage && (
          <div className="relative h-96 rounded-lg overflow-hidden mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </header>
      
      <div className="prose prose-lg max-w-none">
        <RichTextEditor
          value={post.content}
          readOnly
          onChange={() => {}}
        />
      </div>
      
      <footer className="mt-12 pt-8 border-t">
        <div className="flex flex-wrap gap-2 mb-6">
          {post.categories.map((category, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              <FiTag size={14} className="mr-1" />
              {category}
            </span>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              #{tag}
            </span>
          ))}
        </div>
      </footer>
    </article>
  );
};

export default BlogDetail; 