"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <Input
          type="text"
          placeholder="상품명을 입력하세요"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !query}>
          검색
        </Button>
      </form>
      {loading && <div>검색 중...</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map(product => (
          <Link href={`/products/${product.id}`} key={product.id} className="block border rounded-lg p-4 hover:shadow">
            <div className="font-bold text-lg mb-2">{product.name}</div>
            <div className="text-sm text-muted-foreground">{product.description}</div>
          </Link>
        ))}
      </div>
      {!loading && results.length === 0 && query && (
        <div className="text-center text-muted-foreground mt-8">검색 결과가 없습니다.</div>
      )}
    </div>
  );
}
