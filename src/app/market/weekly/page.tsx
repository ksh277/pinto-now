'use client';

import React, { useState } from 'react';
import WeeklyRankingCards from '@/components/WeeklyRankingCards';

export default function WeeklyRankingsPage() {
  const [selectedTab, setSelectedTab] = useState<'CREATOR' | 'AUTHOR' | 'INDIVIDUAL'>('CREATOR');

  const tabs = [
    { key: 'CREATOR' as const, label: '창작자', description: '독창적인 아이디어로 만든 상품들' },
    { key: 'AUTHOR' as const, label: '작가', description: '예술적 감성이 담긴 작품들' },
    { key: 'INDIVIDUAL' as const, label: '개인', description: '개인이 제작한 특별한 상품들' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">창작자 마켓 주간 랭킹</h1>
            <p className="text-gray-600">
              창작자, 작가, 개인 제작자들의 인기 상품을 만나보세요
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key)}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    selectedTab === tab.key
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Description */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            {tabs.find(tab => tab.key === selectedTab)?.description}
          </p>
        </div>

        {/* Rankings Grid */}
        <WeeklyRankingCards
          sellerType={selectedTab}
          limit={20}
          showRankNumbers={true}
          className="mb-8"
          layout="full-page"
        />

        {/* Info Section */}
        <div className="bg-white rounded-lg p-6 mt-8 border">
          <h3 className="font-semibold text-gray-900 mb-3">랭킹 정보</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• 랭킹은 매주 월요일 오전 6시에 업데이트됩니다</li>
            <li>• 판매량 기준으로 순위가 결정되며, 판매가 없는 경우 클릭 수로 정렬됩니다</li>
            <li>• 창작자, 작가, 개인 제작자로 분류된 셀러의 상품만 포함됩니다</li>
            <li>• 주간 기간은 월요일부터 일요일까지입니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}