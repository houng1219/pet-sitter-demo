'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/')
  
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
      
      {/* 底部導航列 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
          <Link 
            href="/" 
            className={`flex flex-col items-center gap-1 p-2 ${isActive('/') && pathname === '/' ? 'text-orange-500' : 'text-gray-500'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">首頁</span>
          </Link>
          
          <Link 
            href="/sitters" 
            className={`flex flex-col items-center gap-1 p-2 ${isActive('/sitters') ? 'text-orange-500' : 'text-gray-500'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xs">搜尋</span>
          </Link>
          
          <Link 
            href="/booking/new" 
            className={`flex flex-col items-center gap-1 p-2 ${isActive('/booking') ? 'text-orange-500' : 'text-gray-500'}`}
          >
            <div className="w-12 h-12 -mt-6 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-xs text-gray-500 -mt-1">預約</span>
          </Link>
          
          <Link 
            href="/member" 
            className={`flex flex-col items-center gap-1 p-2 ${isActive('/member') ? 'text-orange-500' : 'text-gray-500'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">會員</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}