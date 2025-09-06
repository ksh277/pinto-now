'use client'
import Link from 'next/link'

export default function EditorOnlyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 flex flex-col bg-white">
      <header className="flex h-10 items-center border-b bg-white px-3 text-sm z-10 flex-shrink-0">
        <Link href="/" className="text-gray-600 hover:text-black">&lt; 홈으로</Link>
      </header>
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  )
}
