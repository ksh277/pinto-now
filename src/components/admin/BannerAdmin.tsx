'use client';

import React, { useEffect, useState } from 'react';
import { addBanner, fetchBanners, removeBanner, BannerType, BANNER_LIMITS, checkBannerLimit } from '@/lib/banner';
import type { Banner, DeviceType } from '@/lib/banner-types';

export function BannerAdmin() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [mainTitle, setMainTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [moreButtonLink, setMoreButtonLink] = useState('');
  const [href, setHref] = useState('');
  const [bannerType, setBannerType] = useState<BannerType>(BannerType.IMAGE_BANNER);
  const [deviceType, setDeviceType] = useState<DeviceType>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBanners({ includeInactive: true }).then(setBanners).catch(() => setBanners([]));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setError('');
    }
  };

  const handleAddBanner = async () => {
    if (!image || !title.trim()) {
      setError('이미지와 제목은 필수입니다.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 배너 개수 제한 확인
      const limitCheck = await checkBannerLimit(bannerType);
      if (!limitCheck.canAdd) {
        setError(`${bannerType} 타입의 배너는 최대 ${limitCheck.limit}개까지만 등록 가능합니다. (현재: ${limitCheck.current}개)`);
        setLoading(false);
        return;
      }

      // 직접 FormData로 API 호출
      const formData = new FormData();
      formData.append('image', image);
      formData.append('title', title.trim());
      if (href.trim()) formData.append('href', href.trim());
      if (mainTitle.trim()) formData.append('main_title', mainTitle.trim());
      if (subTitle.trim()) formData.append('sub_title', subTitle.trim());
      if (moreButtonLink.trim()) formData.append('more_button_link', moreButtonLink.trim());
      formData.append('banner_type', bannerType);
      formData.append('device_type', deviceType);
      formData.append('is_active', 'true');
      formData.append('sort_order', '0');
      if (startDate) {
        // Convert datetime-local format to MySQL format
        const mysqlStartDate = startDate.replace('T', ' ') + ':00';
        formData.append('start_at', mysqlStartDate);
      }
      if (endDate) {
        // Convert datetime-local format to MySQL format  
        const mysqlEndDate = endDate.replace('T', ' ') + ':00';
        formData.append('end_at', mysqlEndDate);
      }

      const response = await fetch('/api/banners', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        const errorMessage = error.error || 'Failed to create banner';
        console.error('Banner creation failed:', errorMessage);
        throw new Error(errorMessage);
      }
        
      const items = await fetchBanners({ includeInactive: true });
      setBanners(items);
      
      // 폼 초기화
      setImage(null);
      setTitle('');
      setMainTitle('');
      setSubTitle('');
      setMoreButtonLink('');
      setHref('');
      setBannerType(BannerType.IMAGE_BANNER);
      setDeviceType('all');
      setStartDate('');
      setEndDate('');
      
    } catch (error: any) {
      console.error('Banner creation error:', error);
      setError('배너 등록 실패: ' + (error.message || '알 수 없는 오류'));
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeBanner(id);
      setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch (error: any) {
      setError(error.message || '배너 삭제에 실패했습니다.');
    }
  };

  const getBannerTypeLabel = (type: BannerType): string => {
    const labels = {
      [BannerType.TOP_BANNER]: 'Top 배너',
      [BannerType.STRIP_BANNER]: 'Strip 배너',
      [BannerType.HOME_SLIDER_PC]: 'PC 슬라이더',
      [BannerType.HOME_SLIDER_MOBILE]: '모바일 슬라이더',
      [BannerType.IMAGE_BANNER]: '이미지 배너',
    };
    return labels[type];
  };

  const getBannerTypeColor = (type: BannerType): string => {
    const colors = {
      [BannerType.TOP_BANNER]: '#ff6b6b',
      [BannerType.STRIP_BANNER]: '#4ecdc4',
      [BannerType.HOME_SLIDER_PC]: '#45b7d1',
      [BannerType.HOME_SLIDER_MOBILE]: '#96ceb4',
      [BannerType.IMAGE_BANNER]: '#feca57',
    };
    return colors[type] || '#95a5a6';
  };

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', padding: 20 }}>
      <h2 style={{ marginBottom: 30, color: '#2c3e50' }}>🎯 배너 관리 시스템</h2>
      
      {/* 배너 등록 폼 */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: 24, 
        borderRadius: 12, 
        marginBottom: 30,
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ marginBottom: 20, color: '#495057' }}>새 배너 등록</h3>
        
        {error && (
          <div style={{ 
            background: '#ffe6e6', 
            color: '#d63384', 
            padding: 12, 
            borderRadius: 6, 
            marginBottom: 16,
            fontSize: 14
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gap: 16 }}>
          {/* 이미지 업로드 */}
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>이미지 *</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              style={{ width: '100%', padding: 8 }}
            />
            {image && (
              <div style={{ marginTop: 10 }}>
                <img 
                  src={URL.createObjectURL(image)} 
                  alt="미리보기" 
                  style={{ maxWidth: 200, maxHeight: 100, objectFit: 'cover', borderRadius: 4 }}
                />
              </div>
            )}
          </div>

          {/* 기본 정보 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>제목 *</label>
              <input
                type="text"
                placeholder="배너 제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #dee2e6' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>링크 URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={href}
                onChange={(e) => setHref(e.target.value)}
                style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #dee2e6' }}
              />
            </div>
          </div>

          {/* TOP_BANNER 전용 필드 */}
          {bannerType === BannerType.TOP_BANNER && (
            <div style={{ 
              background: '#f0f8ff', 
              padding: 16, 
              borderRadius: 8, 
              border: '1px solid #b3d9ff' 
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#0066cc', fontSize: 14 }}>TOP 배너 전용 설정</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>대제목</label>
                  <input
                    type="text"
                    placeholder="메인 타이틀을 입력하세요"
                    value={mainTitle}
                    onChange={(e) => setMainTitle(e.target.value)}
                    style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #dee2e6' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>소제목</label>
                  <input
                    type="text"
                    placeholder="서브 타이틀을 입력하세요"
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                    style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #dee2e6' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>MORE 버튼 링크</label>
                <input
                  type="text"
                  placeholder="MORE 버튼 클릭 시 이동할 URL"
                  value={moreButtonLink}
                  onChange={(e) => setMoreButtonLink(e.target.value)}
                  style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #dee2e6' }}
                />
              </div>
            </div>
          )}

          {/* 배너 타입 및 디바이스 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>배너 타입</label>
              <select
                value={bannerType}
                onChange={(e) => setBannerType(e.target.value as BannerType)}
                style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #dee2e6' }}
              >
                {Object.values(BannerType).map(type => (
                  <option key={type} value={type}>
                    {getBannerTypeLabel(type)} (최대 {BANNER_LIMITS[type]}개)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>디바이스 타입</label>
              <select
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value as DeviceType)}
                style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #dee2e6' }}
              >
                <option value="all">전체</option>
                <option value="pc">PC만</option>
                <option value="mobile">모바일만</option>
              </select>
            </div>
          </div>

          {/* 스케줄링 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>시작일시</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #dee2e6' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>종료일시</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #dee2e6' }}
              />
            </div>
          </div>

          <button
            onClick={handleAddBanner}
            disabled={loading || !image || !title.trim()}
            style={{
              padding: '14px 28px',
              background: loading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {loading ? '등록 중...' : '배너 등록'}
          </button>
        </div>
      </div>

      {/* 배너 목록 */}
      <div>
        <h3 style={{ marginBottom: 20, color: '#495057' }}>등록된 배너 ({banners.length}개)</h3>
        
        {banners.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: 40, 
            color: '#6c757d', 
            background: '#f8f9fa', 
            borderRadius: 8 
          }}>
            등록된 배너가 없습니다.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {banners.map((banner) => (
              <div key={banner.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: 16,
                background: 'white',
                borderRadius: 8,
                border: '1px solid #dee2e6',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {/* 배너 이미지 */}
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  overflow: 'hidden',
                  background: '#f8f9fa',
                  flexShrink: 0
                }}>
                  <img
                    src={banner.imgSrc}
                    alt={banner.alt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* 배너 정보 */}
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8, 
                    marginBottom: 4 
                  }}>
                    <h4 style={{ margin: 0, fontSize: 16, color: '#212529' }}>
                      {banner.alt}
                    </h4>
                    {banner.bannerType && (
                      <span style={{
                        background: getBannerTypeColor(banner.bannerType),
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 500
                      }}>
                        {getBannerTypeLabel(banner.bannerType)}
                      </span>
                    )}
                    {!banner.isActive && (
                      <span style={{
                        background: '#6c757d',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: 12,
                        fontSize: 12
                      }}>
                        비활성
                      </span>
                    )}
                  </div>
                  <div style={{ color: '#6c757d', fontSize: 14 }}>
                    {banner.href && <div>링크: {banner.href}</div>}
                    {banner.deviceType && banner.deviceType !== 'all' && (
                      <div>디바이스: {banner.deviceType === 'pc' ? 'PC' : '모바일'}</div>
                    )}
                    {banner.startAt && (
                      <div>기간: {new Date(banner.startAt).toLocaleString()} ~ {banner.endAt ? new Date(banner.endAt).toLocaleString() : '무제한'}</div>
                    )}
                  </div>
                </div>

                {/* 액션 버튼 */}
                <button
                  onClick={() => handleRemove(banner.id)}
                  style={{
                    padding: '8px 16px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 14,
                    cursor: 'pointer'
                  }}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
