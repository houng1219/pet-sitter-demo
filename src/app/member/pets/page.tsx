'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { mockPets, petTypeNames } from '@/lib/mock-data'

interface Pet {
  id: string
  name: string
  pet_type: 'dog' | 'cat' | 'rabbit' | 'other'
  breed?: string
  age_category: 'puppy' | 'adult' | 'senior'
  weight?: number
  gender?: 'male' | 'female'
  is_aggressive: boolean
  needs_separate_food: boolean
  has_attack_history: boolean
  needs_dog_free: boolean
  has_allergies: string[]
  has_medical_condition: boolean
  medical_notes?: string
  dietary_notes?: string
}

const ageCategoryNames = { puppy: '幼年', adult: '成年', senior: '老年' }
const genderNames = { male: '公', female: '母' }

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>(mockPets)
  const [showForm, setShowForm] = useState(false)
  const [editingPet, setEditingPet] = useState<Pet | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    pet_type: 'dog' as 'dog' | 'cat' | 'rabbit' | 'other',
    breed: '',
    age_category: 'adult' as 'puppy' | 'adult' | 'senior',
    weight: '',
    gender: '' as 'male' | 'female' | '',
    is_aggressive: false,
    needs_separate_food: false,
    has_attack_history: false,
    needs_dog_free: false,
    has_allergies: [] as string[],
    has_medical_condition: false,
    medical_notes: '',
    dietary_notes: '',
  })

  const resetForm = () => {
    setFormData({
      name: '',
      pet_type: 'dog',
      breed: '',
      age_category: 'adult',
      weight: '',
      gender: '',
      is_aggressive: false,
      needs_separate_food: false,
      has_attack_history: false,
      needs_dog_free: false,
      has_allergies: [],
      has_medical_condition: false,
      medical_notes: '',
      dietary_notes: '',
    })
    setEditingPet(null)
  }

  const handleNewPet = () => {
    resetForm()
    setShowForm(true)
  }

  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet)
    setFormData({
      name: pet.name,
      pet_type: pet.pet_type,
      breed: pet.breed || '',
      age_category: pet.age_category,
      weight: pet.weight?.toString() || '',
      gender: pet.gender || '',
      is_aggressive: pet.is_aggressive,
      needs_separate_food: pet.needs_separate_food,
      has_attack_history: pet.has_attack_history,
      needs_dog_free: pet.needs_dog_free,
      has_allergies: pet.has_allergies,
      has_medical_condition: pet.has_medical_condition,
      medical_notes: pet.medical_notes || '',
      dietary_notes: pet.dietary_notes || '',
    })
    setShowForm(true)
  }

  const handleDeletePet = (petId: string) => {
    if (confirm('確定要刪除這隻寵物嗎？')) {
      setPets(pets.filter(p => p.id !== petId))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newPet: Pet = {
      id: editingPet?.id || `pet-${Date.now()}`,
      name: formData.name,
      pet_type: formData.pet_type,
      breed: formData.breed || undefined,
      age_category: formData.age_category,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      gender: formData.gender || undefined,
      is_aggressive: formData.is_aggressive,
      needs_separate_food: formData.needs_separate_food,
      has_attack_history: formData.has_attack_history,
      needs_dog_free: formData.needs_dog_free,
      has_allergies: formData.has_allergies,
      has_medical_condition: formData.has_medical_condition,
      medical_notes: formData.medical_notes || undefined,
      dietary_notes: formData.dietary_notes || undefined,
    }

    if (editingPet) {
      setPets(pets.map(p => p.id === editingPet.id ? newPet : p))
    } else {
      setPets([...pets, newPet])
    }

    setShowForm(false)
    resetForm()
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/member" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-gray-800">我的寵物</h1>
          </div>
          <button
            onClick={handleNewPet}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-orange-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新增
          </button>
        </div>
      </div>

      {/* 寵物列表 */}
      <div className="p-4">
        {pets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🐾</div>
            <p className="text-gray-500">還沒有新增寵物</p>
            <button
              onClick={handleNewPet}
              className="text-orange-500 mt-2 font-medium"
            >
              + 新增第一隻寵物
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {pets.map((pet) => (
              <div key={pet.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-orange-100 flex items-center justify-center text-3xl">
                    {petTypeIcons[pet.pet_type]}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-800 text-lg">{pet.name}</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPet(pet)}
                          className="text-sm text-blue-500 hover:text-blue-600"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleDeletePet(pet.id)}
                          className="text-sm text-red-500 hover:text-red-600"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <span>{petTypeNames[pet.pet_type]}</span>
                      {pet.breed && <span>• {pet.breed}</span>}
                      <span>• {ageCategoryNames[pet.age_category]}</span>
                      {pet.weight && <span>• {pet.weight}kg</span>}
                      {pet.gender && <span>• {genderNames[pet.gender]}</span>}
                    </div>
                    
                    {/* 特殊標籤 */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {pet.is_aggressive && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">⚠️ 有攻擊性</span>
                      )}
                      {pet.needs_dog_free && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">🚫 需遠離狗</span>
                      )}
                      {pet.has_medical_condition && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">💊 需醫藥照顧</span>
                      )}
                      {pet.needs_separate_food && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">🍽️ 分開餵食</span>
                      )}
                    </div>
                    
                    {/* 特殊飲食/用藥指示 */}
                    {(pet.dietary_notes || pet.medical_notes) && (
                      <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                        {pet.dietary_notes && <div>🍽️ {pet.dietary_notes}</div>}
                        {pet.medical_notes && <div>💊 {pet.medical_notes}</div>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 表單 Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-2xl p-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                {editingPet ? '編輯寵物' : '新增寵物'}
              </h2>
              <button
                onClick={() => { setShowForm(false); resetForm() }}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 基本資訊 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">名字 *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">類型 *</label>
                  <select
                    value={formData.pet_type}
                    onChange={(e) => setFormData({ ...formData, pet_type: e.target.value as any })}
                    className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="dog">狗</option>
                    <option value="cat">貓</option>
                    <option value="rabbit">兔</option>
                    <option value="other">其他</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">品種</label>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    placeholder="例如：柴犬、英國短毛貓"
                    className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">體重 (kg)</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    step="0.1"
                    className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">年齡 *</label>
                  <select
                    value={formData.age_category}
                    onChange={(e) => setFormData({ ...formData, age_category: e.target.value as any })}
                    className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="puppy">幼年</option>
                    <option value="adult">成年</option>
                    <option value="senior">老年</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">性別</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">未設定</option>
                    <option value="male">公</option>
                    <option value="female">母</option>
                  </select>
                </div>
              </div>
              
              {/* 行為特性 */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">行為特性</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_aggressive}
                      onChange={(e) => setFormData({ ...formData, is_aggressive: e.target.checked })}
                      className="w-5 h-5 accent-orange-500"
                    />
                    <span>有攻擊性傾向</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.needs_separate_food}
                      onChange={(e) => setFormData({ ...formData, needs_separate_food: e.target.checked })}
                      className="w-5 h-5 accent-orange-500"
                    />
                    <span>需要分開餵食</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.has_attack_history}
                      onChange={(e) => setFormData({ ...formData, has_attack_history: e.target.checked })}
                      className="w-5 h-5 accent-orange-500"
                    />
                    <span>有攻擊歷史（需特別照顧）</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.needs_dog_free}
                      onChange={(e) => setFormData({ ...formData, needs_dog_free: e.target.checked })}
                      className="w-5 h-5 accent-orange-500"
                    />
                    <span>需要遠離狗</span>
                  </label>
                </div>
              </div>
              
              {/* 健康狀況 */}
              <div>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.has_medical_condition}
                    onChange={(e) => setFormData({ ...formData, has_medical_condition: e.target.checked })}
                    className="w-5 h-5 accent-orange-500"
                  />
                  <span>有醫療狀況或需藥物照顧</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-1">飲食/用藥特殊指示</label>
                <textarea
                  value={formData.dietary_notes}
                  onChange={(e) => setFormData({ ...formData, dietary_notes: e.target.value })}
                  placeholder="例如：腸胃敏感，需食用處方飼料"
                  rows={2}
                  className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-1">醫療備註</label>
                <textarea
                  value={formData.medical_notes}
                  onChange={(e) => setFormData({ ...formData, medical_notes: e.target.value })}
                  placeholder="例如：慢性腎病，需每日服藥兩次"
                  rows={2}
                  className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              >
                {editingPet ? '儲存修改' : '新增寵物'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}