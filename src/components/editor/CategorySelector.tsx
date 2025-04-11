'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { FiPlus, FiX, FiTag } from 'react-icons/fi';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: any;
}

interface CategorySelectorProps {
  onSelect: (category: Category) => void;
  selectedCategories?: string[];
  canCreate?: boolean;
  allowMultiple?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  onSelect,
  selectedCategories = [],
  canCreate = true,
  allowMultiple = true,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const q = query(collection(db, 'categories'));
      const querySnapshot = await getDocs(q);
      
      const categoriesData: Category[] = [];
      querySnapshot.forEach((doc) => {
        categoriesData.push({
          id: doc.id,
          ...doc.data(),
        } as Category);
      });

      setCategories(categoriesData);
    } catch (err) {
      console.error('Kategoriler alınırken hata:', err);
      setError('Kategoriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      setIsCreating(true);
      setError(null);

      const slug = newCategoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Aynı slug'a sahip kategori var mı kontrol et
      const existingCategory = categories.find(cat => cat.slug === slug);
      if (existingCategory) {
        throw new Error('Bu isimde bir kategori zaten var.');
      }

      const docRef = await addDoc(collection(db, 'categories'), {
        name: newCategoryName.trim(),
        slug,
        createdAt: serverTimestamp(),
      });

      const newCategory: Category = {
        id: docRef.id,
        name: newCategoryName.trim(),
        slug,
        createdAt: serverTimestamp(),
      };

      setCategories([...categories, newCategory]);
      onSelect(newCategory);
      setNewCategoryName('');
    } catch (err) {
      console.error('Kategori oluşturulurken hata:', err);
      setError(err instanceof Error ? err.message : 'Kategori oluşturulamadı.');
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="category-selector space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-500 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category)}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategories.includes(category.id)
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            disabled={!allowMultiple && selectedCategories.includes(category.id)}
          >
            <FiTag size={14} />
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {canCreate && (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Yeni kategori adı"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateCategory();
              }
            }}
          />
          <button
            onClick={handleCreateCategory}
            disabled={isCreating || !newCategoryName.trim()}
            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isCreating ? 'Oluşturuluyor...' : 'Oluştur'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CategorySelector; 