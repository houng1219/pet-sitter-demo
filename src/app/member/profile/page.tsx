'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'
import type { Profile } from '@/lib/mock-data'

export default function ProfilePage() {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    full_name: '',
    display_name: '',
    phone: '',
    avatar_url: '',
  })

  // Load profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        display_name: profile.display_name || '',
        phone: profile.phone || '',
        avatar_url: profile.avatar_url || '',
      })
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')
    setSuccess(false)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: formData.full_name,
        display_name: formData.display_name || null,
        phone: formData.phone || null,
        avatar_url: formData.avatar_url || null,
      })
      .eq('id', user.id)

    if (updateError) {
      setError('更新失敗：' + updateError.message)
      setLoading(false)
      return
    }

    await refreshProfile()
    setSuccess(true)
    setLoading(false)
    setTimeout(() => setSuccess(false), 3000)
  }

  const handleSignOut = async () => {
    if (confirm('確定要登出嗎？')) {
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) {
        setError('登出失敗：' + signOutError.message)
      }
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">載入中...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">請先登入</h2>
          <p className="text-gray-500 mb-4">登入後才能編輯個人資料</p>
          <Link
            href="/auth/login"
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors"
          >
            登入
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 頂部 */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <Link href="/member" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-800">編輯個人資料</h1>
        </div>
      </div>

      {/* 個人資訊卡片 */}
      <div className="p-4">
        {/* 頭像預覽 */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-orange-100 overflow-hidden border-2 border-orange-200 mb-4">
              {formData.avatar_url ? (
                <Image
                  src={formData.avatar_url}
                  alt="頭像"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  👤
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">大頭貼照</p>
          </div>
        </div>

        {/* 表單 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg">
              ✓ 個人資料已更新
            </div>
          )}

          {/* 姓名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="王小明"
              required
              className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </div>

          {/* 顯示名稱 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">顯示名稱</label>
            <input
              type="text"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              placeholder="暱稱（可與姓名不同）"
              className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </div>

          {/* 電話 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">電話</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="0912345678"
              className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </div>

          {/* 頭像連結 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">頭像連結</label>
            <input
              type="url"
              value={formData.avatar_url}
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </div>

          {/* Email（唯讀） */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
            <input
              type="email"
              value={user.email || ''}
              readOnly
              disabled
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Email 如需修改請聯繫客服</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? '儲存中...' : '儲存修改'}
          </button>
        </form>

        {/* 登出 */}
        <div className="mt-4">
          <button
            onClick={handleSignOut}
            className="w-full py-3 bg-white text-red-500 font-medium rounded-xl border border-red-200 hover:bg-red-50 transition"
          >
            登出帳戶
          </button>
        </div>
      </div>
    </div>
  )
}
