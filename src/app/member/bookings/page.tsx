'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { mockBookings, mockSitters, statusNames, serviceTypeNames } from '@/lib/mock-data'

type TabType = 'upcoming' | 'history'

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming')
  
  const now = new Date()
  
  const upcomingBookings = mockBookings.filter(b => 
    ['pending', 'confirmed'].includes(b.status) && 
    new Date(b.start_date) >= now
  )
  
  const historyBookings = mockBookings.filter(b => 
    ['completed', 'cancelled', 'refunded'].includes(b.status) ||
    (new Date(b.end_date) < now && ['pending', 'confirmed'].includes(b.status))
  )
  
  const displayBookings = activeTab === 'upcoming' ? upcomingBookings : historyBookings

  const getStatusBadgeStyle = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-green-100 text-green-700',
      in_progress: 'bg-blue-100 text-blue-700',
      completed: 'bg-gray-100 text-gray-600',
      cancelled: 'bg-red-100 text-red-700',
      refunded: 'bg-purple-100 text-purple-700',
    }
    return styles[status] || 'bg-gray-100 text-gray-600'
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
          <h1 className="text-xl font-bold text-gray-800">我的預約</h1>
        </div>
      </div>
      
      {/* Tab 切換 */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'upcoming'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            即將到來 ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            歷史記錄 ({historyBookings.length})
          </button>
        </div>
      </div>
      
      {/* 預約列表 */}
      <div className="p-4">
        {displayBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📅</div>
            <p className="text-gray-500">
              {activeTab === 'upcoming' ? '目前沒有即將到來的預約' : '沒有歷史預約記錄'}
            </p>
            {activeTab === 'upcoming' && (
              <Link href="/sitters" className="text-orange-500 mt-2 inline-block font-medium">
                前往搜尋保母 ›
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayBookings.map((booking) => {
              const sitter = mockSitters.find(s => s.id === booking.sitter_id)
              return (
                <Link
                  key={booking.id}
                  href={`/member/bookings/${booking.id}`}
                  className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0">
                      {sitter?.avatar_url ? (
                        <Image src={sitter.avatar_url} alt={sitter.display_name} width={56} height={56} className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-orange-100 flex items-center justify-center text-xl">
                          🐶
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-gray-800">{sitter?.display_name || '保母'}</div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeStyle(booking.status)}`}>
                          {statusNames[booking.status]}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <span>{serviceTypeNames[booking.service_type]}</span>
                        <span>•</span>
                        <span>{booking.start_date}</span>
                        {booking.start_date !== booking.end_date && (
                          <>
                            <span>~</span>
                            <span>{booking.end_date}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
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
      </div>
    </div>
  )
}