
'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function EditorPage() {
  const sp = useSearchParams();
  const template = sp?.get('template') ?? '';
  const type = sp?.get('type') ?? '';

  const [picked, setPicked] = useState<string | null>(template || type || null);

  if (!picked) {
    return <ProductPicker onPick={setPicked} />;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Product Editor - {picked}</h1>
      <p className="text-gray-600">Editor functionality will be implemented here.</p>
    </main>
  );
}

function ProductPicker({ onPick }: { onPick: (id: string) => void }) {
  const items = [
    { id: 'keyring', label: 'Keyring' },
    { id: 'stand', label: 'Acrylic Stand' },
    { id: 'coaster', label: 'Coaster' },
    { id: 'pouch', label: 'Pouch' },
    { id: 'smarttok', label: 'Smart Tok' },
    { id: 'badge', label: 'Badge' },
    { id: 'stationery', label: 'Stationery' },
    { id: 'carabiner', label: 'Carabiner', disabled: true },
  ];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      <div className="w-full max-w-5xl rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center text-xl font-semibold">Choose a product to customize</div>
        <div className="grid grid-cols-4 gap-4">
          {items.map((it) => (
            <button
              key={it.id}
              disabled={it.disabled}
              onClick={() => !it.disabled && onPick(it.id)}
              className={`aspect-[4/3] rounded-2xl border p-4 text-center transition ${
                it.disabled ? 'bg-gray-200 text-gray-400' : 'hover:border-teal-500 hover:shadow'
              }`}
            >
              <div className="h-full w-full rounded-xl bg-gray-50" />
              <div className="mt-2 font-medium">
                {it.label}
                {it.disabled && ' (coming soon)'}
              </div>
            </button>
          ))}
        </div>
        <div className="mt-6 text-right">
          <button onClick={() => window.history.back()} className="rounded-xl border px-4 py-2 text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
