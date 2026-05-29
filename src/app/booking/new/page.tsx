'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { mockSitters, mockSitterServices, mockPets, serviceTypeNames } from '@/lib/mock-data'

function BookingNewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sitterId = searchParams.get('sitter_id') || ''
  
  const sitter = mockSitters.find(s => s.id === sitterId)
  const services = mockSitterServices.filter(s => s.sitter_id === sitterId && s.is_active)
  
  const [selectedService, setSelectedService] = useState<string>('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedPetId, setSelectedPetId] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  
  // 計算費用
  const calculateFee = () => {
    if (!selectedService) return { subtotal: 0, serviceFee: 0, total: 0 }
    
    const service = services.find(s => s.id === selectedService)
    if (!service) return { subtotal: 0, serviceFee: 0, total: 0 }
    
    let subtotal = 0
    
    if (service.price_per_night && startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      subtotal = service.price_per_night * Math.max(nights, 1)
    } else if (service.price_per_visit) {
      subtotal = service.price_per_visit
    } else if (service.price_per_hour) {
      subtotal = service.price_per_hour * 2 // 預設2小時
    }
    
    const serviceFee = Math.round(subtotal * 0.1)
    const total = subtotal + serviceFee
    
    return { subtotal, serviceFee, total }
  }
  
  const fee = calculateFee()
  
  // 計算夜數
  const calculateNights = () => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!agreedToTerms) {
      alert('請同意服務條款')
      return
    }
    
    // 模擬提交成功（實際需要 Supabase）
    alert('預約請求已送出！等待保母確認。')
    router.push('/member/bookings')
  }
  
  if (!sitter) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-gray-500">請先選擇一位保母</p>
          <Link href="/sitters" className="text-orange-500 mt-2 inline-block">
            前往搜尋
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* 頂部 */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <Link href={`/sitters/${sitterId}`} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-800">填寫預約資料</h1>
        </div>
      </div>
      
      {/* 保母資訊摘要 */}
      <div className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
            {sitter.avatar_url ? (
              <Image src={sitter.avatar_url} alt={sitter.display_name} width={48} height={48} className="object-cover" />
            ) : (
              <div className="w-full h-full bg-orange-100 flex items-center justify-center">🐶</div>
            )}
          </div>
          <div>
            <div className="font-semibold text-gray-800">{sitter.display_name}</div>
            <div className="text-sm text-gray-500">{sitter.location_district}</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-orange-500 font-medium">★ {sitter.avg_rating}</div>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* 服務類型選擇 */}
        <div className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">選擇服務</h2>
          <div className="space-y-2">
            {services.map((service) => {
              let priceDisplay = ''
              if (service.price_per_night) priceDisplay = `NT${service.price_per_night}/晚`
              else if (service.price_per_visit) priceDisplay = `NT${service.price_per_visit}/次`
              else if (service.price_per_hour) priceDisplay = `NT${service.price_per_hour}/小時`
              
              return (
                <label
                  key={service.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedService === service.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="service"
                      value={service.id}
                      checked={selectedService === service.id}
                      onChange={() => setSelectedService(service.id)}
                      className="w-4 h-4 accent-orange-500"
                    />
                    <span className="font-medium text-gray-800">{serviceTypeNames[service.service_type]}</span>
                  </div>
                  <span className="text-orange-600 font-semibold">{priceDisplay}</span>
                </label>
              )
            })}
          </div>
        </div>
        
        {/* 日期選擇 */}
        <div className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">選擇日期</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">開始日期</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">結束日期</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>
          {selectedService && startDate && endDate && (
            <div className="mt-2 text-sm text-gray-500">
              共 {calculateNights()} 晚
            </div>
          )}
        </div>
        
        {/* 寵物選擇 */}
        <div className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">選擇寵物</h2>
          <select
            value={selectedPetId}
            onChange={(e) => setSelectedPetId(e.target.value)}
            className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          >
            <option value="">請選擇寵物</option>
            {mockPets.map(pet => (
              <option key={pet.id} value={pet.id}>
                {pet.name} ({pet.pet_type === 'dog' ? '狗' : pet.pet_type === 'cat' ? '貓' : pet.pet_type === 'rabbit' ? '兔' : '其他'})
              </option>
            ))}
          </select>
          {selectedPetId && (
            <Link href="/member/pets" className="text-sm text-orange-500 mt-2 inline-block">
              + 新增寵物
            </Link>
          )}
        </div>
        
        {/* 特殊需求 */}
        <div className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">特殊需求</h2>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="請描述任何特殊需求，例如：寵物用藥、飲食限制、行為問題等"
            rows={3}
            className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
        </div>
        
        {/* 緊急聯絡人 */}
        <div className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">緊急聯絡人</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">姓名</label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                placeholder="聯絡人姓名"
                className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">電話</label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="0912345678"
                className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>
        </div>
        
        {/* 費用明細 */}
        <div className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">費用明細</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">服務費用</span>
              <span className="text-gray-800">NT${fee.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">平台服務費 (10%)</span>
              <span className="text-gray-800">NT${fee.serviceFee}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
              <span className="text-gray-800">總計</span>
              <span className="text-orange-600">NT${fee.total}</span>
            </div>
          </div>
        </div>
        
        {/* 服務條款 */}
        <div className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-5 h-5 mt-0.5 accent-orange-500"
            />
            <div className="text-sm text-gray-600">
              我已閱讀並同意<a href="#" className="text-orange-500">服務條款</a>和<a href="#" className="text-orange-500">隱私政策</a>，
             了解並同意預約規範及取消政策。
            </div>
          </label>
        </div>
        
        {/* 送出按鈕 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-lg mx-auto">
            <button
              type="submit"
              disabled={!selectedService || !startDate || !endDate || !selectedPetId || !agreedToTerms}
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              送出預約請求
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">
              送出後需等待保母確認，確認後才會通知您進行付款
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}

export default function BookingNewPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">載入中…</div>}>
      <BookingNewContent />
    </Suspense>
  )
}