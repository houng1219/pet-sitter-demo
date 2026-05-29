'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { mockSitters, getLowestPrice, serviceTypeNames } from '@/lib/mock-data'

const serviceTypes = [
  { key: 'home_visit', name: '到府', icon: '🚪', desc: '到府陪伴' },
  { key: 'walking', name: '散步', icon: '🐕', desc: '戶外運動' },
  { key: 'daycare', name: '日照', icon: '☀️', desc: '白天照顧' },
]

const districts = ['鼓山區', '苓雅區', '左營區', '前鎮區', '三民區', '新興區', '鳥松區']

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  
  const featuredSitters = mockSitters.slice(0, 4)
  
  return (
    <div className="pb-20">
      {/* 頂部標題區 */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 pb-8">
        <h1 className="text-2xl font-bold mb-1">毛孩保母</h1>
        <p className="text-orange-100 text-sm">高雄寵物照顧預約平台</p>
      </div>
      
      {/* 搜尋區域 */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="尋找高雄的寵物保母"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          {/* 快捷篩選標籤 */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {districts.map(d => (
              <button key={d} className="whitespace-nowrap px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-orange-100 hover:text-orange-600 transition-colors">
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* 服務類型入口 */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">選擇服務類型</h2>
        <div className="grid grid-cols-2 gap-3">
          {serviceTypes.map((service) => (
            <Link
              key={service.key}
              href={`/sitters?service=${service.key}`}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all"
            >
              <div className="text-3xl mb-2">{service.icon}</div>
              <div className="font-semibold text-gray-800">{service.name}</div>
              <div className="text-xs text-gray-500 mt-1">{service.desc}</div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* 精選保母 */}
      <div className="px-4 mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">精選保母</h2>
          <Link href="/sitters" className="text-orange-500 text-sm font-medium">
            看更多 ›
          </Link>
        </div>
        
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex gap-3" style={{ width: 'max-content' }}>
            {featuredSitters.map((sitter) => {
              const lowestPrice = getLowestPrice(sitter.id)
              return (
                <Link
                  key={sitter.id}
                  href={`/sitters/${sitter.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex-shrink-0"
                  style={{ width: '280px' }}
                >
                  <div className="relative h-32 bg-gray-200">
                    {sitter.cover_images[0] ? (
                      <Image
                        src={sitter.cover_images[0]}
                        alt={sitter.display_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                        <span className="text-4xl">🐾</span>
                      </div>
                    )}
                    {sitter.is_verified && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        已驗證
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                          {sitter.avatar_url ? (
                            <Image src={sitter.avatar_url} alt={sitter.display_name} width={48} height={48} className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-orange-100 flex items-center justify-center text-xl">
                              🐶
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 truncate">{sitter.display_name}</div>
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-orange-500 font-medium">★ {sitter.avg_rating}</span>
                          <span className="text-gray-400">({sitter.review_count})</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-gray-500">{sitter.location_district}</div>
                      {lowestPrice !== null && (
                        <div className="text-orange-600 font-semibold">
                          <span className="text-xs">起</span> NT${lowestPrice}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* 底部間距（留給導航列） */}
      <div className="h-8" />
    </div>
  )
}