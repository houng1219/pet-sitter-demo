'use client'

import { useState } from 'react'
import Link from 'next/link'
import { mockSitterServices } from '@/lib/mock-data'

interface ServiceOption {
  id: string
  name: string
  description?: string
  basePrice: number
}

const serviceOptions: ServiceOption[] = [
  { id: 'boarding', name: '寄宿', description: '過夜照顧，包含早晚餵食、散步', basePrice: 800 },
  { id: 'home_visit', name: '到府', description: '到府陪伴30分鐘', basePrice: 500 },
  { id: 'walking', name: '散步', description: '戶外散步60分鐘', basePrice: 200 },
  { id: 'daycare', name: '日照', description: '日間照顧，適合上班族', basePrice: 250 },
]

const petTypes = [
  { value: 'dog', label: '狗', icon: '🐕' },
  { value: 'cat', label: '貓', icon: '🐈' },
  { value: 'rabbit', label: '兔', icon: '🐰' },
  { value: 'other', label: '其他', icon: '🐾' },
]

const experienceLevels = [
  { value: 'none', label: '新手（無正式經驗）' },
  { value: 'some', label: '有一些經驗（親戚/朋友家的寵物）' },
  { value: 'professional', label: '有專業經驗（動物相關工作/執照）' },
]

export default function SitterSetupPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    headline: '',
    bio: '',
    experience: 'none' as 'none' | 'some' | 'professional',
    
    // Step 2: Services & Pricing
    selectedServices: [] as string[],
    customPrices: {} as Record<string, string>,
    
    // Step 3: Pet Types
    acceptedPetTypes: [] as string[],
    maxWeight: '',
    canHandleAggressive: false,
    
    // Step 4: Location & Availability
    serviceArea: '',
    hasHomeEnvironment: false,
    hasOutdoorSpace: false,
    availableDates: [] as string[],
    
    // Step 5: Verification
    hasCertification: false,
    certificationName: '',
  })

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(s => s !== serviceId)
        : [...prev.selectedServices, serviceId]
    }))
  }

  const togglePetType = (petType: string) => {
    setFormData(prev => ({
      ...prev,
      acceptedPetTypes: prev.acceptedPetTypes.includes(petType)
        ? prev.acceptedPetTypes.filter(p => p !== petType)
        : [...prev.acceptedPetTypes, petType]
    }))
  }

  const toggleDate = (date: string) => {
    setFormData(prev => ({
      ...prev,
      availableDates: prev.availableDates.includes(date)
        ? prev.availableDates.filter(d => d !== date)
        : [...prev.availableDates, date]
    }))
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.headline.length >= 5 && formData.bio.length >= 20
      case 2:
        return formData.selectedServices.length > 0
      case 3:
        return formData.acceptedPetTypes.length > 0 && formData.maxWeight
      case 4:
        return formData.serviceArea.length > 0
      default:
        return true
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">申請已提交！</h1>
          <p className="text-gray-500 mb-6">
            我們會在 24 小時內審核您的申請，結果將發送至您的註冊郵箱。
          </p>
          <Link
            href="/member"
            className="block w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
          >
            返回會員首頁
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 頂部 Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link href="/member" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-gray-800">成為保母</h1>
          </div>
          <button className="text-sm text-gray-500">儲存草稿</button>
        </div>

        {/* 步驟指示器 */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`h-2 flex-1 rounded-full transition-colors ${step >= s ? 'bg-orange-500' : 'bg-gray-200'}`} />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>基本資料</span>
          <span>服務項目</span>
          <span>寵物類型</span>
          <span>地點時間</span>
          <span>驗證</span>
        </div>
      </div>

      {/* 表單內容 */}
      <div className="p-4">
        {/* Step 1: 基本資料 */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">基本資料</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  個人標題 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => updateForm('headline', e.target.value)}
                  placeholder="例如：熱愛動物的專業狗保姆"
                  className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  maxLength={50}
                />
                <div className="text-right text-xs text-gray-400 mt-1">{formData.headline.length}/50</div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  自我介紹 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => updateForm('bio', e.target.value)}
                  placeholder="告訴潛在客戶關於你的背景、經驗和為什麼想成為保母..."
                  rows={5}
                  className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  maxLength={500}
                />
                <div className="text-right text-xs text-gray-400 mt-1">{formData.bio.length}/500</div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  照顧經驗
                </label>
                <div className="space-y-2">
                  {experienceLevels.map((exp) => (
                    <label
                      key={exp.value}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        formData.experience === exp.value ? 'bg-orange-50 border-2 border-orange-500' : 'bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="experience"
                        value={exp.value}
                        checked={formData.experience === exp.value}
                        onChange={(e) => updateForm('experience', e.target.value)}
                        className="w-5 h-5 accent-orange-500"
                      />
                      <span className="text-gray-700">{exp.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: 服務項目 */}
        {step === 2 && (
          <div className="bg-white rounded-xl p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">選擇提供的服務</h2>
            <p className="text-sm text-gray-500 mb-4">可複選。設置您的服務定價（每晚）</p>

            <div className="space-y-3">
              {serviceOptions.map((service) => (
                <div
                  key={service.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    formData.selectedServices.includes(service.id)
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                  onClick={() => toggleService(service.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        formData.selectedServices.includes(service.id)
                          ? 'border-orange-500 bg-orange-500'
                          : 'border-gray-300'
                      }`}>
                        {formData.selectedServices.includes(service.id) && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">參考價</div>
                      <div className="font-semibold text-orange-600">${service.basePrice}/晚</div>
                    </div>
                  </div>

                  {formData.selectedServices.includes(service.id) && (
                    <div className="mt-3 pl-9">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">您的定價：</span>
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-1">$</span>
                          <input
                            type="number"
                            value={formData.customPrices[service.id] || service.basePrice}
                            onChange={(e) => {
                              const newPrices = { ...formData.customPrices }
                              newPrices[service.id] = e.target.value
                              updateForm('customPrices', newPrices)
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-24 p-2 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            min={1}
                          />
                          <span className="text-gray-500 ml-1">/晚</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: 寵物類型 */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">接受的寵物類型</h2>
              <p className="text-sm text-gray-500 mb-4">可複選</p>

              <div className="grid grid-cols-2 gap-3">
                {petTypes.map((pet) => (
                  <div
                    key={pet.value}
                    className={`p-4 rounded-xl border-2 text-center cursor-pointer transition-colors ${
                      formData.acceptedPetTypes.includes(pet.value)
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                    onClick={() => togglePetType(pet.value)}
                  >
                    <div className="text-3xl mb-2">{pet.icon}</div>
                    <div className="font-semibold text-gray-800">{pet.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  可接受的最大寵物體重 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={formData.maxWeight}
                    onChange={(e) => updateForm('maxWeight', e.target.value)}
                    placeholder="例如：20"
                    className="w-32 p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min={1}
                  />
                  <span className="text-gray-500">kg</span>
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.canHandleAggressive}
                    onChange={(e) => updateForm('canHandleAggressive', e.target.checked)}
                    className="w-5 h-5 accent-orange-500"
                  />
                  <span className="text-gray-700">我可以照顧有攻擊性或需要特別管理的寵物</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: 地點與時間 */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">服務地點</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  服務區域 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.serviceArea}
                  onChange={(e) => updateForm('serviceArea', e.target.value)}
                  placeholder="例如：台北市大安區"
                  className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="mt-4 space-y-2">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasHomeEnvironment}
                    onChange={(e) => updateForm('hasHomeEnvironment', e.target.checked)}
                    className="w-5 h-5 accent-orange-500"
                  />
                  <span className="text-gray-700">我有舒適的家居環境可以接待寵物</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasOutdoorSpace}
                    onChange={(e) => updateForm('hasOutdoorSpace', e.target.checked)}
                    className="w-5 h-5 accent-orange-500"
                  />
                  <span className="text-gray-700">我有户外空間（庭院/陽台）</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">未來 30 天可服務日期</h2>
              <p className="text-sm text-gray-500 mb-3">點擊日期切換選擇/取消</p>
              
              <div className="grid grid-cols-7 gap-1">
                {generateDates().map((dateStr) => {
                  const date = new Date(dateStr)
                  const dayOfWeek = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
                  const isSelected = formData.availableDates.includes(dateStr)
                  
                  return (
                    <div
                      key={dateStr}
                      onClick={() => toggleDate(dateStr)}
                      className={`p-2 rounded-lg text-center cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-xs text-gray-500">{dayOfWeek}</div>
                      <div className="font-semibold text-sm">{date.getDate()}</div>
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-3 text-sm text-gray-500">
                已選擇 {formData.availableDates.length} 天
              </div>
            </div>
          </div>
        )}

        {/* Step 5: 驗證 */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">身份驗證</h2>
              
              <div className="bg-orange-50 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <div className="font-semibold text-gray-800">為什麼要驗證身份？</div>
                    <p className="text-sm text-gray-600 mt-1">
                      驗證身份可以增加客戶信任度，提高接單率。我們會對您的身份資訊嚴格保密。
                    </p>
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={formData.hasCertification}
                  onChange={(e) => updateForm('hasCertification', e.target.checked)}
                  className="w-5 h-5 accent-orange-500"
                />
                <span className="text-gray-700">我擁有動物相關專業證照或培訓證書</span>
              </label>

              {formData.hasCertification && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    證照名稱
                  </label>
                  <input
                    type="text"
                    value={formData.certificationName}
                    onChange={(e) => updateForm('certificationName', e.target.value)}
                    placeholder="例如：寵物美容丙級證書、寵物行為學認證"
                    className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">服務條款</h2>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 max-h-40 overflow-y-auto">
                <p className="mb-2">成為平台的保母，您需要同意以下條款：</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>提供真實、準確的個人和服務資訊</li>
                  <li>對托寵的寵物負責，確保其安全与福祉</li>
                  <li>按約定時間和地點提供服務</li>
                  <li>未經客戶同意，不將寵物交由他人照顧</li>
                  <li>如有意外或緊急情况，立即通知平台和客戶</li>
                  <li>遵守當地動物保護法規</li>
                </ul>
              </div>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer mt-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 accent-orange-500"
                />
                <span className="text-gray-700">我已閱讀並同意以上服務條款</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 底部按鈕 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              上一步
            </button>
          )}
          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                canProceed()
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              下一步
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                isSubmitting
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              {isSubmitting ? '提交中...' : '提交申請'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}