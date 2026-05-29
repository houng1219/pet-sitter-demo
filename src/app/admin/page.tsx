'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: string | null
  created_at: string
}

interface Sitter {
  id: string
  user_id: string
  display_name: string | null
  is_verified: boolean
  created_at: string
}

interface Booking {
  id: string
  booking_number: string
  sitter_id: string
  user_id: string
  service_type: string | null
  total_amount: number | null
  status: string | null
  created_at: string
  sitters?: { display_name: string | null }
  profiles?: { full_name: string | null }
}

export default function AdminPage() {
  const supabase = createClient()

  // Stats
  const [memberCount, setMemberCount] = useState<number | null>(null)
  const [sitterCount, setSitterCount] = useState<number | null>(null)
  const [bookingCount, setBookingCount] = useState<number | null>(null)
  const [monthlyRevenue, setMonthlyRevenue] = useState<number | null>(null)

  // Data lists
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [unverifiedSitters, setUnverifiedSitters] = useState<Sitter[]>([])

  // Loading states
  const [loadingProfiles, setLoadingProfiles] = useState(true)
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [loadingSitters, setLoadingSitters] = useState(true)

  // Load stats
  useEffect(() => {
    async function loadStats() {
      // Count members (profiles)
      const { count: members, error: membersErr } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
      if (!membersErr) setMemberCount(members ?? 0)

      // Count sitters
      const { count: sitters, error: sittersErr } = await supabase
        .from('sitters')
        .select('*', { count: 'exact', head: true })
      if (!sittersErr) setSitterCount(sitters ?? 0)

      // Count bookings
      const { count: bookingsRes, error: bookingsErr } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
      if (!bookingsErr) setBookingCount(bookingsRes ?? 0)

      // Monthly revenue
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const { data: revenueData } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('status', 'completed')
        .gte('created_at', startOfMonth)
      if (revenueData) {
        const total = revenueData.reduce((sum, b) => sum + (b.total_amount || 0), 0)
        setMonthlyRevenue(total)
      }
    }
    loadStats()
  }, [supabase])

  // Load recent profiles
  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data, error }) => {
        if (!error) setProfiles(data || [])
        setLoadingProfiles(false)
      })
  }, [supabase])

  // Load recent bookings
  useEffect(() => {
    supabase
      .from('bookings')
      .select('*, sitters(display_name), profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data, error }) => {
        if (!error) setBookings(data || [])
        setLoadingBookings(false)
      })
  }, [supabase])

  // Load unverified sitters
  useEffect(() => {
    supabase
      .from('sitters')
      .select('*')
      .eq('is_verified', false)
      .limit(10)
      .then(({ data, error }) => {
        if (!error) setUnverifiedSitters(data || [])
        setLoadingSitters(false)
      })
  }, [supabase])

  // Approve sitter
  const handleApproveSitter = async (sitterId: string) => {
    const { error } = await supabase
      .from('sitters')
      .update({ is_verified: true })
      .eq('id', sitterId)

    if (!error) {
      setUnverifiedSitters(prev => prev.filter(s => s.id !== sitterId))
    }
  }

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  // Status badge
  const StatusBadge = ({ status }: { status: string | null }) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    const cls = colors[status || 'pending'] || 'bg-gray-100 text-gray-800'
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>
        {status === 'pending' && '待確認'}
        {status === 'confirmed' && '已確認'}
        {status === 'completed' && '已完成'}
        {status === 'cancelled' && '已取消'}
        {!['pending', 'confirmed', 'completed', 'cancelled'].includes(status || '') && status}
      </span>
    )
  }

  // Role badge
  const RoleBadge = ({ role }: { role: string | null }) => {
    const cls = role === 'sitter' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>
        {role === 'sitter' ? '保母' : '會員'}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-orange-500 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">管理後台</h1>
          <p className="text-orange-100 text-sm mt-1">Admin Dashboard</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-500 text-sm">總會員數</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {memberCount === null ? (
                <span className="bg-gray-200 animate-pulse rounded h-8 w-16 inline-block" />
              ) : memberCount}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-500 text-sm">總保母數</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {sitterCount === null ? (
                <span className="bg-gray-200 animate-pulse rounded h-8 w-16 inline-block" />
              ) : sitterCount}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-500 text-sm">總預約數</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {bookingCount === null ? (
                <span className="bg-gray-200 animate-pulse rounded h-8 w-16 inline-block" />
              ) : bookingCount}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-500 text-sm">本月收入</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {monthlyRevenue === null ? (
                <span className="bg-gray-200 animate-pulse rounded h-8 w-16 inline-block" />
              ) : (
                <span>${monthlyRevenue.toLocaleString()}</span>
              )}
            </p>
          </div>
        </div>

        {/* Recent Profiles Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">註冊會員列表</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm text-gray-500">
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">姓名</th>
                  <th className="px-6 py-3 font-medium">角色</th>
                  <th className="px-6 py-3 font-medium">註冊時間</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loadingProfiles ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-3"><span className="bg-gray-200 animate-pulse rounded h-4 w-32 inline-block" /></td>
                      <td className="px-6 py-3"><span className="bg-gray-200 animate-pulse rounded h-4 w-20 inline-block" /></td>
                      <td className="px-6 py-3"><span className="bg-gray-200 animate-pulse rounded h-4 w-12 inline-block" /></td>
                      <td className="px-6 py-3"><span className="bg-gray-200 animate-pulse rounded h-4 w-24 inline-block" /></td>
                    </tr>
                  ))
                ) : profiles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">尚無資料</td>
                  </tr>
                ) : (
                  profiles.map(profile => (
                    <tr key={profile.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-700">{profile.email}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{profile.full_name || '-'}</td>
                      <td className="px-6 py-3"><RoleBadge role={profile.role} /></td>
                      <td className="px-6 py-3 text-sm text-gray-500">{formatDate(profile.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">最新預約</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm text-gray-500">
                  <th className="px-6 py-3 font-medium">編號</th>
                  <th className="px-6 py-3 font-medium">保母</th>
                  <th className="px-6 py-3 font-medium">會員</th>
                  <th className="px-6 py-3 font-medium">服務類型</th>
                  <th className="px-6 py-3 font-medium">金額</th>
                  <th className="px-6 py-3 font-medium">狀態</th>
                  <th className="px-6 py-3 font-medium">時間</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loadingBookings ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-3"><span className="bg-gray-200 animate-pulse rounded h-4 w-16 inline-block" /></td>
                      <td className="px-6 py-3"><span className="bg-gray-200 animate-pulse rounded h-4 w-16 inline-block" /></td>
                      <td className="px-6 py-3"><span className="bg-gray-200 animate-pulse rounded h-4 w-16 inline-block" /></td>
                      <td className="px-6 py-3"><span className="bg-gray-200 animate-pulse rounded h-4 w-16 inline-block" /></td>
                      <td className="px-6 py-3"><span className="bg-gray-200 animate-pulse rounded h-4 w-12 inline-block" /></td>
                      <td className="px-6 py-3"><span className="bg-gray-200 animate-pulse rounded h-4 w-12 inline-block" /></td>
                      <td className="px-6 py-3"><span className="bg-gray-200 animate-pulse rounded h-4 w-20 inline-block" /></td>
                    </tr>
                  ))
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-400">尚無資料</td>
                  </tr>
                ) : (
                  bookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-700 font-mono">{booking.booking_number}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{booking.sitters?.display_name || '-'}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{booking.profiles?.full_name || '-'}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{booking.service_type || '-'}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {booking.total_amount ? `$${booking.total_amount}` : '-'}
                      </td>
                      <td className="px-6 py-3"><StatusBadge status={booking.status} /></td>
                      <td className="px-6 py-3 text-sm text-gray-500">{formatDate(booking.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Sitters */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">等待審核的保母</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm text-gray-500">
                  <th className="px-6 py-3 font-medium">顯示名稱</th>
                  <th className="px-6 py-3 font-medium">申請時間</th>
                  <th className="px-6 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loadingSitters ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-3"><span className="bg-gray-200 animate-pulse rounded h-4 w-24 inline-block" /></td>
                      <td className="px-6 py-3"><span className="bg-gray-200 animate-pulse rounded h-4 w-20 inline-block" /></td>
                      <td className="px-6 py-3"><span className="bg-gray-200 animate-pulse rounded h-4 w-12 inline-block" /></td>
                    </tr>
                  ))
                ) : unverifiedSitters.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-400">目前沒有待審核的保母</td>
                  </tr>
                ) : (
                  unverifiedSitters.map(sitter => (
                    <tr key={sitter.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-700">{sitter.display_name || '-'}</td>
                      <td className="px-6 py-3 text-sm text-gray-500">{formatDate(sitter.created_at)}</td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleApproveSitter(sitter.id)}
                          className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          審核
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}