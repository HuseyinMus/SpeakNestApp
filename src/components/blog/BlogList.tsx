'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { FiClock, FiTag, FiUser } from 'react-icons/fi';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  categories: string[];
  tags: string[];
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: any;
}

interface BlogListProps {
  category?: string;
  tag?: string;
  limit?: number;
}

const BlogList: React.FC<BlogListProps> = ({ category, tag, limit = 10 }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [category, tag]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      let q = query(
        collection(db, 'blog-posts'),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      );

      if (category) {
        q = query(q, where('categories', 'array-contains', category));
      }

      if (tag) {
        q = query(q, where('tags', 'array-contains', tag));
      }

      const querySnapshot = await getDocs(q);
      const postsData: BlogPost[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        postsData.push({
          id: doc.id,
          title: data.title,
          excerpt: data.excerpt,
          coverImage: data.coverImage,
          categories: data.categories,
          tags: data.tags,
          author: data.author,
          createdAt: data.createdAt,
        });
      });

      setPosts(postsData.slice(0, limit));
    } catch (err) {
      console.error('Blog yazıları alınırken hata:', err);
      setError('Blog yazıları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-md text-center">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Henüz blog yazısı bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/blog/${post.id}`}
          className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          {post.coverImage && (
            <div className="relative h-48">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div className="p-4 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
              {post.title}
            </h2>
            
            <p className="text-gray-600 line-clamp-3">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <FiUser size={14} />
                <span>{post.author.name}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <FiClock size={14} />
                <span>
                  {new Date(post.createdAt?.toDate()).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {post.categories.slice(0, 2).map((category, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  <FiTag size={12} className="mr-1" />
                  {category}
                </span>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BlogList; 