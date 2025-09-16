'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Save, X, MoveUp, MoveDown } from 'lucide-react';

type Product = {
  id: string;
  nameKo?: string;
  priceKrw?: number;
  imageUrl?: string;
};

type ProductShelfBanner = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  products: Product[];
  moreLink?: string;
};

export default function ProductShelfBannersAdmin() {
  const [banners, setBanners] = useState<ProductShelfBanner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState<ProductShelfBanner | null>(null);
  const [newBanner, setNewBanner] = useState({
    title: '',
    description: '',
    imageUrl: '',
    moreLink: '',
    productIds: [] as string[]
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchBanners();
    fetchProducts();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/product-shelf-banners');
      if (response.ok) {
        const data = await response.json();
        setBanners(data.banners || []);
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const createBanner = async () => {
    if (!newBanner.title || !newBanner.description || !newBanner.imageUrl) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/product-shelf-banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newBanner.title,
          description: newBanner.description,
          imageUrl: newBanner.imageUrl,
          moreLink: newBanner.moreLink,
          sortOrder: banners.length,
          productIds: newBanner.productIds
        })
      });

      if (response.ok) {
        setNewBanner({ title: '', description: '', imageUrl: '', moreLink: '', productIds: [] });
        setIsCreating(false);
        fetchBanners();
      } else {
        alert('Failed to create banner');
      }
    } catch (error) {
      console.error('Failed to create banner:', error);
      alert('Failed to create banner');
    }
  };

  const updateBanner = async (bannerId: string, updates: Partial<ProductShelfBanner>) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/product-shelf-banners/${bannerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        fetchBanners();
        setEditingBanner(null);
      } else {
        alert('Failed to update banner');
      }
    } catch (error) {
      console.error('Failed to update banner:', error);
      alert('Failed to update banner');
    }
  };

  const deleteBanner = async (bannerId: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/product-shelf-banners/${bannerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchBanners();
      } else {
        alert('Failed to delete banner');
      }
    } catch (error) {
      console.error('Failed to delete banner:', error);
      alert('Failed to delete banner');
    }
  };

  const moveBanner = async (bannerId: string, direction: 'up' | 'down') => {
    const currentIndex = banners.findIndex(b => b.id === bannerId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= banners.length) return;

    const updatedBanners = [...banners];
    [updatedBanners[currentIndex], updatedBanners[newIndex]] = [updatedBanners[newIndex], updatedBanners[currentIndex]];
    
    // Update sort orders
    updatedBanners.forEach((banner, index) => {
      banner.sortOrder = index;
    });

    setBanners(updatedBanners);

    // Save to API
    try {
      const token = localStorage.getItem('auth_token');
      await Promise.all(updatedBanners.map(banner =>
        fetch(`/api/product-shelf-banners/${banner.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ sortOrder: banner.sortOrder })
        })
      ));
    } catch (error) {
      console.error('Failed to update banner order:', error);
      fetchBanners(); // Reload on error
    }
  };

  const toggleProductSelection = (productId: string) => {
    if (isCreating) {
      setNewBanner(prev => ({
        ...prev,
        productIds: prev.productIds.includes(productId)
          ? prev.productIds.filter(id => id !== productId)
          : [...prev.productIds, productId]
      }));
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 rounded w-1/3" />
          <div className="h-32 bg-neutral-200 rounded" />
          <div className="h-32 bg-neutral-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Shelf Banners Management</h1>
        <Button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Banner
        </Button>
      </div>

      {/* Create New Banner */}
      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Create New Banner
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsCreating(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Input
                value={newBanner.title}
                onChange={(e) => setNewBanner(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter banner title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <Textarea
                value={newBanner.description}
                onChange={(e) => setNewBanner(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter banner description"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Image URL *</label>
              <Input
                value={newBanner.imageUrl}
                onChange={(e) => setNewBanner(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="Enter image URL"
              />
            </div>

            {/* MORE 링크는 현재 데이터베이스 스키마에 없으므로 주석 처리 */}
            {/* <div>
              <label className="block text-sm font-medium mb-1">MORE 버튼 링크</label>
              <Input
                value={newBanner.moreLink}
                onChange={(e) => setNewBanner(prev => ({ ...prev, moreLink: e.target.value }))}
                placeholder="/akril-goods (비어있으면 자동 링크 사용)"
              />
              <p className="text-xs text-gray-500 mt-1">
                예: /akril-goods, /sticker-goods 등. 비어있으면 제목에 따라 자동으로 링크가 결정됩니다.
              </p>
            </div> */}

            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Associated Products</label>
              <div className="max-h-64 overflow-y-auto border rounded-md p-2">
                {products.map(product => (
                  <div key={product.id} className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      id={`product-${product.id}`}
                      checked={newBanner.productIds.includes(product.id)}
                      onChange={() => toggleProductSelection(product.id)}
                      className="rounded"
                    />
                    <label 
                      htmlFor={`product-${product.id}`}
                      className="flex-1 cursor-pointer flex items-center gap-2"
                    >
                      {product.imageUrl && (
                        <img 
                          src={product.imageUrl} 
                          alt={product.nameKo}
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                      <span className="text-sm">{product.nameKo} - {product.priceKrw?.toLocaleString()}원</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={createBanner}>
                Create Banner
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Banners List */}
      <div className="space-y-4">
        {banners.map((banner, index) => (
          <Card key={banner.id}>
            <CardContent className="p-4">
              {editingBanner?.id === banner.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input
                      value={editingBanner.title}
                      onChange={(e) => setEditingBanner(prev => 
                        prev ? { ...prev, title: e.target.value } : null
                      )}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea
                      value={editingBanner.description}
                      onChange={(e) => setEditingBanner(prev => 
                        prev ? { ...prev, description: e.target.value } : null
                      )}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Image URL</label>
                    <Input
                      value={editingBanner.imageUrl}
                      onChange={(e) => setEditingBanner(prev =>
                        prev ? { ...prev, imageUrl: e.target.value } : null
                      )}
                    />
                  </div>

                  {/* MORE 링크는 현재 데이터베이스 스키마에 없으므로 주석 처리 */}
                  {/* <div>
                    <label className="block text-sm font-medium mb-1">MORE 버튼 링크</label>
                    <Input
                      value={editingBanner.moreLink || ''}
                      onChange={(e) => setEditingBanner(prev =>
                        prev ? { ...prev, moreLink: e.target.value } : null
                      )}
                      placeholder="/akril-goods (비어있으면 자동 링크 사용)"
                    />
                  </div> */}

                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingBanner(null)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => updateBanner(banner.id, editingBanner)}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{banner.title}</h3>
                      <Badge variant="secondary">Order: {banner.sortOrder}</Badge>
                    </div>
                    <p className="text-sm text-neutral-600 mb-2">{banner.description}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <img 
                        src={banner.imageUrl} 
                        alt={banner.title}
                        className="w-12 h-8 rounded object-cover"
                      />
                      <span className="text-xs text-neutral-500">{banner.imageUrl}</span>
                    </div>
                    {/* MORE 링크는 현재 데이터베이스 스키마에 없으므로 주석 처리 */}
                    {/* {banner.moreLink && (
                      <div className="mb-2">
                        <span className="text-sm font-medium">MORE 링크: </span>
                        <span className="text-sm text-blue-600">{banner.moreLink}</span>
                      </div>
                    )} */}
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-sm font-medium">Products ({banner.products.length}):</span>
                      {banner.products.slice(0, 3).map(product => (
                        <Badge key={product.id} variant="outline" className="text-xs">
                          {product.nameKo}
                        </Badge>
                      ))}
                      {banner.products.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{banner.products.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveBanner(banner.id, 'up')}
                      disabled={index === 0}
                    >
                      <MoveUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveBanner(banner.id, 'down')}
                      disabled={index === banners.length - 1}
                    >
                      <MoveDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingBanner(banner)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteBanner(banner.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {banners.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-neutral-500">No banners created yet. Click "Add New Banner" to create your first banner.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}