"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProductContext } from '@/contexts/product-context';
import { useLanguage } from '@/contexts/language-context';
import type { Product } from '@/lib/types';
import Link from "next/link";
import Image from "next/image";

function SearchContent() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams?.get('q') || '';
  const [query, setQuery] = useState(urlQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { products } = useProductContext();
  const { t } = useLanguage();

  // Perform search when component mounts or URL query changes
  useEffect(() => {
    if (urlQuery) {
      performSearch(urlQuery);
    }
  }, [urlQuery, products]);

  const performSearch = (searchQuery: string) => {
    setLoading(true);
    // Simple client-side search through products
    const filtered = products.filter(product => 
      product.nameKo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.categoryKo && product.categoryKo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      product.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.descriptionKo && product.descriptionKo.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setResults(filtered);
    setLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query.trim());
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <Input
          type="text"
          placeholder={t('search.placeholder')}
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !query}>
          {t('search.button')}
        </Button>
      </form>
      {loading && <div>{t('search.loading')}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map(product => (
          <Link href={`/products/${product.id}`} key={product.id} className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            {product.imageUrl && (
              <div className="aspect-square relative">
                <Image 
                  src={product.imageUrl} 
                  alt={product.nameKo}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <div className="font-bold text-lg mb-2">{product.nameKo}</div>
              <div className="text-sm text-muted-foreground mb-2">{product.categoryKo || product.subcategory}</div>
              {product.descriptionKo && (
                <div className="text-sm text-muted-foreground mb-2">{product.descriptionKo}</div>
              )}
              <div className="font-semibold text-primary">{product.priceKrw?.toLocaleString()}{t('common.won')}</div>
            </div>
          </Link>
        ))}
      </div>
      {!loading && results.length === 0 && query && (
        <div className="text-center text-muted-foreground mt-8">{t('search.no_results')}</div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto py-12 px-4">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
