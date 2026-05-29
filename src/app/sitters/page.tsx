'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { mockSitters, mockSitterServices, getLowestPrice, serviceTypeNames, petTypeNames } from '@/lib/mock-data'

const districts = ['全部', '鼓山區', '苓雅區', '左營區', '前鎮區', '三民區', '新興區', '鳥松區', '仁武區', '大寮區']
const petTypes = ['全部', '狗', '貓', '兔', '其他']
const serviceTypes = ['全部', '到府', '散步', '日照'];

export default function SittersPage() {
  const [selectedDistrict, setSelectedDistrict] = useState('全部')
  const [selectedPetType, setSelectedPetType] = useState('全部')
  const [selectedService, setSelectedService] = useState('全部')
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [maxPrice, setMaxPrice] = useState<number>(2000)
  const [minRating, setMinRating] = useState<number>(0)
  
  // 簡單的 mock 服務過濾（實際應用需要用 Supabase）
  const filteredSitters = mockSitters.filter(sitter => {
    if (selectedDistrict !== '全部' && sitter.location_district !== selectedDistrict) return false
    
    const petTypeMap: Record<string, string> = { '狗': 'dog', '貓': 'cat', '兔': 'rabbit', '其他': 'other' }
    if (selectedPetType !== '全部' && !sitter.pet_types.includes(petTypeMap[selectedPetType])) return false
    
    if (selectedService !== '全部') {
      const serviceTypeMap: Record<string, string> = { '到府': 'home_visit', '散步': 'walking', '日照': 'daycare' }
      const services = mockSitterServices.filter(s => s.sitter_id === sitter.id && s.service_type === serviceTypeMap[selectedService])
      if (services.length === 0) return false
    }
    
    const lowestPrice = getLowestPrice(sitter.id)
    if (lowestPrice !== null && lowestPrice > maxPrice) return false
    
    if (sitter.avg_rating < minRating) return false
    
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 頂部標題 */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">尋找保母</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg ${viewMode === 'map' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* 篩選面板 */}
        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-500 mb-1">地區</div>
            <div className="flex flex-wrap gap-1">
              {districts.map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDistrict(d)}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    selectedDistrict === d
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">寵物類型</div>
              <select
                value={selectedPetType}
                onChange={(e) => setSelectedPetType(e.target.value)}
                className="w-full p-2 text-sm bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-orange-500"
              >
                {petTypes.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">服務類型</div>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full p-2 text-sm bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-orange-500"
              >
                {serviceTypes.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>價格上限</span>
              <span>NT${maxPrice}</span>
            </div>
            <input
              type="range"
              min="500"
              max="3000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>
          
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>最低評價</span>
              <span>★ {minRating}+</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>
        </div>
      </div>
      
      {/* 結果列表 */}
      <div className="p-4">
        <div className="text-sm text-gray-500 mb-3">
          找到 {filteredSitters.length} 位保母
        </div>
        
        {viewMode === 'list' ? (
          <div className="space-y-3">
            {filteredSitters.map((sitter) => {
              const lowestPrice = getLowestPrice(sitter.id)
              return (
                <Link
                  key={sitter.id}
                  href={`/sitters/${sitter.id}`}
                  className="block bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex">
                    <div className="relative w-28 h-28 flex-shrink-0 bg-gray-200">
                      {sitter.cover_images[0] ? (
                        <Image
                          src={sitter.cover_images[0]}
                          alt={sitter.display_name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                          <span className="text-3xl">🐾</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-gray-800 flex items-center gap-2">
                            {sitter.display_name}
                            {sitter.is_verified && (
                              <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">{sitter.location_district}</div>
                        </div>
                        
                        {lowestPrice !== null && (
                          <div className="text-orange-600 font-semibold">
                            NT${lowestPrice}<span className="text-xs text-gray-400">/晚</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-orange-500 font-medium">★ {sitter.avg_rating}</span>
                        <span className="text-xs text-gray-400">({sitter.review_count}則評價)</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        {sitter.pet_types.map(pt => (
                          <span key={pt} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {pt === 'dog' ? '🐕' : pt === 'cat' ? '🐈' : pt === 'rabbit' ? '🐰' : '🐾'} {petTypeNames[pt]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p>地圖模式</p>
            <p className="text-sm mt-1">需要 Google Maps API 金鑰</p>
          </div>
        )}
        
        {filteredSitters.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-gray-500">沒有找到符合條件的保母</p>
            <p className="text-sm text-gray-400 mt-1">試著調整篩選條件</p>
          </div>
        )}
      </div>
    </div>
  )
}