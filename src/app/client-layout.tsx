'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { Profile } from '@/lib/mock-data'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [showAccount, setShowAccount] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user
      setUser(u ?? null)
      if (u) {
        supabase.from('profiles').select('*').eq('id', u.id).single().then(({ data: p }) => {
          setProfile(p as Profile | null)
        })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const u = session?.user ?? null
      setUser(u ?? null)
      if (u) {
        const { data: p } = await supabase.from('profiles').select('*').eq('id', u.id).single()
        setProfile(p as Profile | null)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    window.location.href = '/'
  }

  const isActive = (path: string) =>
    pathname === path || pathname?.startsWith(path + '/')

  const isLoggedIn = !!user

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航列 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-orange-500">
            🧡 毛孩保母
          </Link>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {profile?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-sm text-red-500 font-medium hover:underline"
                  >
                    管理後台
                  </Link>
                )}
                <div className="relative">
                  <button
                    onClick={() => setShowAccount(!showAccount)}
                    className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold"
                  >
                    {profile?.full_name?.charAt(0) ?? user?.email?.charAt(0) ?? '?'}
                  </button>
                  {showAccount && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium truncate">{profile?.full_name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link
                        href="/member"
                        onClick={() => setShowAccount(false)}
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        會員中心
                      </Link>
                      <Link
                        href="/member/profile"
                        onClick={() => setShowAccount(false)}
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        個人檔案
                      </Link>
                      {profile?.role === 'sitter' && (
                        <Link
                          href="/member/sitter-setup"
                          onClick={() => setShowAccount(false)}
                          className="block px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          保母設定
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
                      >
                        登出
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="text-sm text-orange-500 font-medium"
              >
                登入
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 頁面內容 */}
      <main className="pb-20">{children}</main>

      {/* 底部導航列 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 p-2 ${
              pathname === '/' ? 'text-orange-500' : 'text-gray-500'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">首頁</span>
          </Link>

          <Link
            href="/sitters"
            className={`flex flex-col items-center gap-1 p-2 ${
              isActive('/sitters') ? 'text-orange-500' : 'text-gray-500'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xs">搜尋</span>
          </Link>

          {isLoggedIn ? (
            <Link
              href="/booking/new"
              className={`flex flex-col items-center gap-1 p-2 ${
                isActive('/booking') ? 'text-orange-500' : 'text-gray-500'
              }`}
            >
              <div className="w-12 h-12 -mt-6 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 -mt-1">預約</span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="flex flex-col items-center gap-1 p-2 text-gray-500"
            >
              <div className="w-12 h-12 -mt-6 bg-gray-300 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 -mt-1">預約</span>
            </Link>
          )}

          <Link
            href={isLoggedIn ? '/member' : '/auth/login'}
            className={`flex flex-col items-center gap-1 p-2 ${
              isActive('/member') ? 'text-orange-500' : 'text-gray-500'
            }`}
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
