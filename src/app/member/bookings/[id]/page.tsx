'use client'

import { use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { mockBookings, mockSitters, mockPets, statusNames, serviceTypeNames } from '@/lib/mock-data'

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const booking = mockBookings.find(b => b.id === id)
  
  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-gray-500">找不到這筆預約</p>
          <Link href="/member/bookings" className="text-orange-500 mt-2 inline-block">
            返回列表
          </Link>
        </div>
      </div>
    )
  }
  
  const sitter = mockSitters.find(s => s.id === booking.sitter_id)
  const bookingPets = mockPets.filter(p => booking.pet_ids.includes(p.id))
  
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

  const petTypeIcons: Record<string, string> = {
    dog: '🐕',
    cat: '🐈',
    rabbit: '🐰',
    other: '🐾',
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 頂部 */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <Link href="/member/bookings" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-800">預約詳情</h1>
            <p className="text-sm text-gray-500">#{booking.booking_number}</p>
          </div>
          <span className={`ml-auto text-xs px-3 py-1 rounded-full ${getStatusBadgeStyle(booking.status)}`}>
            {statusNames[booking.status]}
          </span>
        </div>
      </div>
      
      {/* 保母資訊 */}
      <div className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <Link href={`/sitters/${sitter?.id}`} className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {sitter?.avatar_url ? (
              <Image src={sitter.avatar_url} alt={sitter.display_name} width={64} height={64} className="object-cover" />
            ) : (
              <div className="w-full h-full bg-orange-100 flex items-center justify-center text-2xl">
                🐶
              </div>
            )}
          </Link>
          <div className="flex-1">
            <Link href={`/sitters/${sitter?.id}`} className="font-semibold text-gray-800 text-lg hover:text-orange-600">
              {sitter?.display_name || '保母'}
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span>★ {sitter?.avg_rating || 0}</span>
              <span>•</span>
              <span>{sitter?.location_district}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 服務資訊 */}
      <div className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-3">服務資訊</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">服務類型</span>
            <span className="text-gray-800 font-medium">{serviceTypeNames[booking.service_type]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">開始日期</span>
            <span className="text-gray-800">{booking.start_date}</span>
          </div>
          {booking.start_date !== booking.end_date && (
            <div className="flex justify-between">
              <span className="text-gray-500">結束日期</span>
              <span className="text-gray-800">{booking.end_date}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* 寵物資訊 */}
      <div className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-3">寵物資料</h2>
        <div className="space-y-3">
          {bookingPets.map((pet) => (
            <div key={pet.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-lg">
                {petTypeIcons[pet.pet_type]}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">{pet.name}</div>
                <div className="text-xs text-gray-500">
                  {pet.breed && <span>{pet.breed} • </span>}
                  <span>{pet.weight}kg</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 特殊需求 */}
      {booking.special_requests && (
        <div className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-2">特殊需求</h2>
          <p className="text-gray-600 text-sm">{booking.special_requests}</p>
        </div>
      )}
      
      {/* 緊急聯絡人 */}
      {booking.emergency_contact_name && (
        <div className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-2">緊急聯絡人</h2>
          <div className="flex justify-between">
            <span className="text-gray-500">{booking.emergency_contact_name}</span>
            <a href={`tel:${booking.emergency_contact_phone}`} className="text-orange-500 font-medium">
              {booking.emergency_contact_phone} ☎️
            </a>
          </div>
        </div>
      )}
      
      {/* 費用明細 */}
      <div className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-3">費用明細</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">服務費用</span>
            <span className="text-gray-800">NT${booking.subtotal}</span>
          </div>
          {booking.service_fee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">平台服務費</span>
              <span className="text-gray-800">NT${booking.service_fee}</span>
            </div>
          )}
          {booking.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>優惠折扣</span>
              <span>-NT${booking.discount}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
            <span className="text-gray-800">總計</span>
            <span className="text-orange-600">NT${booking.total}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">付款狀態</span>
            <span className={`font-medium ${
              booking.payment_status === 'paid' ? 'text-green-600' : 
              booking.payment_status === 'refunded' ? 'text-purple-600' : 'text-yellow-600'
            }`}>
              {booking.payment_status === 'paid' ? '已付款' : 
               booking.payment_status === 'refunded' ? '已退款' : '待付款'}
            </span>
          </div>
        </div>
      </div>
      
      {/* 操作按鈕 */}
      {booking.status === 'pending' && (
        <div className="mx-4 mt-4">
          <button
            className="w-full bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition-colors"
            onClick={() => {
              if (confirm('確定要取消這個預約嗎？')) {
                alert('預約已取消')
              }
            }}
          >
            取消預約
          </button>
        </div>
      )}
      
      {booking.status === 'confirmed' && (
        <div className="mx-4 mt-4">
          <button
            className="w-full bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition-colors"
            onClick={() => {
              if (confirm('確定要取消這個預約嗎？\n注意：可能會有取消費用。')) {
                alert('預約已取消')
              }
            }}
          >
            取消預約
          </button>
        </div>
      )}
      
      {booking.status === 'completed' && (
        <div className="mx-4 mt-4">
          <Link
            href={`/member/reviews/new?booking_id=${booking.id}`}
            className="block w-full bg-orange-500 text-white py-3 rounded-xl font-medium text-center hover:bg-orange-600 transition-colors"
          >
            留下評價
          </Link>
        </div>
      )}
      
      {/* 預約時間 */}
      <div className="mx-4 mt-4 text-center text-xs text-gray-400">
        預約建立時間：{new Date(booking.created_at).toLocaleString('zh-TW')}
      </div>
    </div>
  )
}