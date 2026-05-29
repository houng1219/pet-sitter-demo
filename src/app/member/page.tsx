'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { mockBookings, mockSitters, statusNames, serviceTypeNames } from '@/lib/mock-data'

export default function MemberPage() {
  // Mock 用戶資料
  const user = {
    name: '王小明',
    email: 'user@example.com',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
  }
  
  // 即將到來的預約
  const upcomingBookings = mockBookings.filter(b => 
    ['pending', 'confirmed'].includes(b.status) && 
    new Date(b.start_date) >= new Date()
  )
  
  const menuItems = [
    { href: '/member/pets', icon: '🐾', title: '我的寵物', desc: '管理寵物資料' },
    { href: '/member/bookings', icon: '📅', title: '我的預約', desc: '查看預約記錄' },
    { href: '#', icon: '❤️', title: '我的收藏', desc: '收藏的保母' },
    { href: '#', icon: '💬', title: '客服中心', desc: '聯繫客服' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 頂部會員資訊 */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 pb-20">
        <h1 className="text-xl font-bold mb-4">會員中心</h1>
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 overflow-hidden border-2 border-white/50">
            {user.avatar_url ? (
              <Image src={user.avatar_url} alt={user.name} width={64} height={64} className="object-cover" />
            ) : (
              <div className="w-full h-full bg-white/30 flex items-center justify-center text-2xl">
                👤
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold text-lg">{user.name}</div>
            <div className="text-orange-100 text-sm">{user.email}</div>
          </div>
          <Link href="#" className="ml-auto text-orange-100 text-sm">
            編輯 ›
          </Link>
        </div>
      </div>
      
      {/* 快速入口 */}
      <div className="px-4 -mt-12">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="grid grid-cols-2 gap-3">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">
                  {item.icon}
                </div>
                <div>
                  <div className="font-medium text-gray-800 text-sm">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* 即將到來的預約 */}
      {upcomingBookings.length > 0 && (
        <div className="px-4 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">即將到來的預約</h2>
          
          {upcomingBookings.map((booking) => {
            const sitter = mockSitters.find(s => s.id === booking.sitter_id)
            return (
              <Link
                key={booking.id}
                href={`/member/bookings/${booking.id}`}
                className="block bg-white rounded-xl p-4 shadow-sm mb-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gray-200 overflow-hidden">
                    {sitter?.avatar_url ? (
                      <Image src={sitter.avatar_url} alt={sitter.display_name} width={56} height={56} className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-orange-100 flex items-center justify-center text-xl">
                        🐶
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-800">{sitter?.display_name || '保母'}</div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {statusNames[booking.status]}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-500 mt-1">
                      {serviceTypeNames[booking.service_type]} • {booking.start_date}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-400">
                        訂單 #{booking.booking_number}
                      </span>
                      <span className="font-semibold text-orange-600">
                        NT${booking.total}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
      
      {/* 暂无預約 */}
      {upcomingBookings.length === 0 && (
        <div className="px-4 mt-6">
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">📅</div>
            <p className="text-gray-500">目前沒有預約</p>
            <Link 
              href="/sitters" 
              className="text-orange-500 mt-2 inline-block font-medium"
            >
              前往搜尋保母 ›
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}