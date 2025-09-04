'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  tags: string[];
  price: number;
  image: string;
}

interface CategoryCardProps {
  product: Product;
  showHoverEffect?: boolean;
  className?: string;
}

export default function CategoryCard({ 
  product, 
  showHoverEffect = true, 
  className = "" 
}: CategoryCardProps) {
  return (
    <Card className={`group overflow-hidden ${showHoverEffect ? 'hover:shadow-lg transition-shadow' : ''} ${className}`}>
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={`object-cover ${showHoverEffect ? 'group-hover:scale-105 transition-transform duration-300' : ''}`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
        {/* Optional overlay for hover effect */}
        {showHoverEffect && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {product.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{product.tags.length - 3}
            </Badge>
          )}
        </div>
        
        {/* Price and Link */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-blue-600">
              {product.price.toLocaleString()}원
            </span>
            <span className="text-xs text-gray-500">부터</span>
          </div>
          
          <Link 
            href={`/product/${product.id}`} 
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center transition-colors"
          >
            자세히 보기
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Grid wrapper component for consistent layout
interface CategoryGridProps {
  products: Product[];
  columns?: 1 | 2 | 3 | 4;
  showHoverEffect?: boolean;
  className?: string;
}

export function CategoryGrid({ 
  products, 
  columns = 4, 
  showHoverEffect = true, 
  className = "" 
}: CategoryGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
      {products.map((product) => (
        <CategoryCard
          key={product.id}
          product={product}
          showHoverEffect={showHoverEffect}
        />
      ))}
    </div>
  );
}