'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { mockSitters, mockSitterServices, mockSitterReviews, getLowestPrice, serviceTypeNames, getNextMonthDates, isDateAvailable } from '@/lib/mock-data'

export default function SitterProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const sitter = mockSitters.find(s => s.id === id)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  
  if (!sitter) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-gray-500">找不到這位保母</p>
          <Link href="/sitters" className="text-orange-500 mt-2 inline-block">
            返回列表
          </Link>
        </div>
      </div>
    )
  }
  
  const services = mockSitterServices.filter(s => s.sitter_id === sitter.id && s.is_active)
  const reviews = mockSitterReviews.filter(r => r.sitter_id === sitter.id).slice(0, 3)
  
  // 五維雷達圖數據
  const radarData = [
    { label: '專業度', value: sitter.rating_professional },
    { label: '愛心', value: sitter.rating_love },
    { label: '回覆速度', value: sitter.rating_response },
    { label: '清潔度', value: sitter.rating_cleanliness },
    { label: '準時', value: sitter.rating_punctuality },
  ]
  
  // 行事曆日期
  const calendarDates = getNextMonthDates().slice(0, 28)
  
  // 計算五維圖路徑
  const getRadarPath = () => {
    const centerX = 80
    const centerY = 80
    const radius = 60
    const angles = radarData.map((_, i) => (i * 2 * Math.PI) / radarData.length - Math.PI / 2)
    
    const points = radarData.map((d, i) => {
      const angle = angles[i]
      const x = centerX + radius * (d.value / 5) * Math.cos(angle)
      const y = centerY + radius * (d.value / 5) * Math.sin(angle)
      return `${x},${y}`
    })
    
    return `M ${points.join(' L ')} Z`
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 封面圖 */}
      <div className="relative h-64 bg-gray-200">
        {sitter.cover_images.length > 0 ? (
          <>
            <Image
              src={sitter.cover_images[currentImageIndex]}
              alt={sitter.display_name}
              fill
              className="object-cover"
            />
            {sitter.cover_images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(i => Math.max(0, i - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow"
                  disabled={currentImageIndex === 0}
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentImageIndex(i => Math.min(sitter.cover_images.length - 1, i + 1))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow"
                  disabled={currentImageIndex === sitter.cover_images.length - 1}
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {sitter.cover_images.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${i === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
            <span className="text-6xl">🐾</span>
          </div>
        )}
        
        {/* 返回按鈕 */}
        <Link
          href="/sitters"
          className="absolute top-4 left-4 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      </div>
      
      {/* 基本資訊卡片 */}
      <div className="mx-4 -mt-8 relative">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow">
                {sitter.avatar_url ? (
                  <Image src={sitter.avatar_url} alt={sitter.display_name} width={80} height={80} className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-orange-100 flex items-center justify-center text-2xl">
                    🐶
                  </div>
                )}
              </div>
              {sitter.is_verified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800">{sitter.display_name}</h1>
              <p className="text-gray-500 text-sm mt-1">{sitter.location_district}</p>
              
              {sitter.is_verified && (
                <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full mt-2">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  已驗證保母
                </span>
              )}
              
              <div className="flex items-center gap-3 mt-2">
                <span className="text-lg font-bold text-orange-500">★ {sitter.avg_rating}</span>
                <span className="text-sm text-gray-400">({sitter.review_count}則評價)</span>
              </div>
            </div>
          </div>
          
          {sitter.tagline && (
            <p className="text-gray-600 mt-3 text-sm border-t pt-3">{sitter.tagline}</p>
          )}
        </div>
      </div>
      
      {/* 五維雷達圖 */}
      <div className="mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-3">評價分析</h2>
        <div className="flex items-center justify-center">
          <svg width="160" height="160" viewBox="0 0 160 160">
            {/* 背景五邊形 */}
            {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
              <polygon
                key={i}
                points={radarData.map((_, j) => {
                  const angle = (j * 2 * Math.PI) / radarData.length - Math.PI / 2
                  const x = 80 + 60 * scale * Math.cos(angle)
                  const y = 80 + 60 * scale * Math.sin(angle)
                  return `${x},${y}`
                }).join(' ')}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            
            {/* 五維標籤 */}
            {radarData.map((d, i) => {
              const angle = (i * 2 * Math.PI) / radarData.length - Math.PI / 2
              const x = 80 + 75 * Math.cos(angle)
              const y = 80 + 75 * Math.sin(angle)
              return (
                <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="text-xs fill-gray-500">
                  {d.label}
                </text>
              )
            })}
            
            {/* 數值區域 */}
            <path d={getRadarPath()} fill="#fb923c" fillOpacity="0.3" stroke="#f97316" strokeWidth="2" />
            
            {/* 數值點 */}
            {radarData.map((d, i) => {
              const angle = (i * 2 * Math.PI) / radarData.length - Math.PI / 2
              const x = 80 + 60 * (d.value / 5) * Math.cos(angle)
              const y = 80 + 60 * (d.value / 5) * Math.sin(angle)
              return (
                <circle key={i} cx={x} cy={y} r="4" fill="#f97316" />
              )
            })}
          </svg>
        </div>
      </div>
      
      {/* 服務說明 */}
      {sitter.bio && (
        <div className="mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-2">關於我</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{sitter.bio}</p>
        </div>
      )}
      
      {/* 收費標準 */}
      <div className="mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-3">收費標準</h2>
        <div className="space-y-2">
          {services.map((service) => (
            <div key={service.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <span className="font-medium text-gray-800">{serviceTypeNames[service.service_type]}</span>
                {service.description && (
                  <p className="text-xs text-gray-500 mt-1">{service.description}</p>
                )}
              </div>
              <div className="text-right">
                {service.price_per_night && (
                  <span className="text-orange-600 font-semibold">NT${service.price_per_night}<span className="text-xs text-gray-400">/晚</span></span>
                )}
                {service.price_per_visit && (
                  <span className="text-orange-600 font-semibold">NT${service.price_per_visit}<span className="text-xs text-gray-400">/次</span></span>
                )}
                {service.price_per_hour && (
                  <span className="text-orange-600 font-semibold">NT${service.price_per_hour}<span className="text-xs text-gray-400">/小時</span></span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 本月行事曆 */}
      <div className="mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">本月可預約日期</h2>
          <div className="text-sm text-gray-500">
            {selectedMonth.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' })}
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center">
          {['日', '一', '二', '三', '四', '五', '六'].map(d => (
            <div key={d} className="text-xs text-gray-400 py-2">{d}</div>
          ))}
          
          {/* 調整起始偏移（根據月份） */}
          {(() => {
            const firstDay = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1).getDay()
            const blanks = Array(firstDay).fill(null)
            const days = calendarDates.map(date => {
              const d = new Date(date)
              return { date, day: d.getDate(), available: isDateAvailable(sitter.id, date) }
            })
            return (
              <>
                {blanks.map((_, i) => <div key={`blank-${i}`} />)}
                {days.map(({ date, day, available }) => (
                  <div
                    key={date}
                    className={`py-2 text-sm rounded ${
                      available
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </>
            )
          })()}
        </div>
        
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-100 rounded"></div>
            <span className="text-gray-500">可預約</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <span className="text-gray-500">已滿</span>
          </div>
        </div>
      </div>
      
      {/* 評價 */}
      {reviews.length > 0 && (
        <div className="mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">最近評價</h2>
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-3 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-orange-500 font-medium">★ {review.overall_rating}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(review.created_at).toLocaleDateString('zh-TW')}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 底部預約按鈕 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            {getLowestPrice(sitter.id) !== null && (
              <>
                <span className="text-sm text-gray-500">最低價格</span>
                <div className="text-xl font-bold text-orange-600">
                  NT${getLowestPrice(sitter.id)}
                  <span className="text-sm font-normal text-gray-400">/晚</span>
                </div>
              </>
            )}
          </div>
          <Link
            href={`/booking/new?sitter_id=${sitter.id}`}
            className="bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors shadow-lg"
          >
            開始預約
          </Link>
        </div>
      </div>
    </div>
  )
}