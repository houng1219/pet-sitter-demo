// Mock 資料類型

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: 'customer' | 'sitter' | 'admin';
}

export interface Sitter {
  id: string;
  user_id: string;
  display_name: string;
  tagline?: string;
  bio?: string;
  cover_images: string[];
  avatar_url?: string;
  location_district: string;
  location_address?: string;
  is_verified: boolean;
  rating_professional: number;
  rating_love: number;
  rating_response: number;
  rating_cleanliness: number;
  rating_punctuality: number;
  review_count: number;
  avg_rating: number;
  service_areas: string[];
  pet_types: string[];
  max_pets: number;
  response_time_minutes?: number;
  is_active: boolean;
}

export interface SitterService {
  id: string;
  sitter_id: string;
  service_type: 'boarding' | 'home_visit' | 'walking' | 'daycare';
  price_per_night?: number;
  price_per_visit?: number;
  price_per_hour?: number;
  description?: string;
  is_active: boolean;
}

export interface SitterReview {
  id: string;
  sitter_id: string;
  user_id: string;
  overall_rating: number;
  comment?: string;
  created_at: string;
  reviewer?: Profile;
}

export const mockSitterReviews: SitterReview[] = [
  {
    id: 'r1',
    sitter_id: '1',
    user_id: 'u1',
    overall_rating: 5,
    comment: '美麗姐非常細心，我家臘腸有點分離焦慮，她第一天就拍了影片讓我安心。強推！',
    created_at: '2025-12-20',
    reviewer: { id: 'u1', display_name: '阿偉爸', avatar_url: '' },
  },
  {
    id: 'r2',
    sitter_id: '1',
    user_id: 'u2',
    overall_rating: 5,
    comment: '第二次預約了，環境很乾淨，小狗回來毛髮都閃亮亮的～',
    created_at: '2025-11-15',
    reviewer: { id: 'u2', display_name: '小琪媽', avatar_url: '' },
  },
  {
    id: 'r3',
    sitter_id: '1',
    user_id: 'u3',
    overall_rating: 4,
    comment: '服務很好，只可惜回覆速度可以再快一點',
    created_at: '2025-10-30',
    reviewer: { id: 'u3', display_name: 'Darren', avatar_url: '' },
  },
  {
    id: 'r4',
    sitter_id: '2',
    user_id: 'u4',
    overall_rating: 5,
    comment: '志偉帶我家柴犬去公園跑個1小時，回來累到不行但開心得很！',
    created_at: '2025-12-18',
    reviewer: { id: 'u4', display_name: 'Peggy', avatar_url: '' },
  },
  {
    id: 'r5',
    sitter_id: '3',
    user_id: 'u5',
    overall_rating: 4,
    comment: '小貓咪很害羞，但志偉很有耐心，第二天就願意出來了',
    created_at: '2025-11-25',
    reviewer: { id: 'u5', display_name: '阿德', avatar_url: '' },
  },
  {
    id: 'r6',
    sitter_id: '4',
    user_id: 'u6',
    overall_rating: 5,
    comment: '別墅級的環境！ 大明哥的院子超大，我家黃金獵犬玩得很開心',
    created_at: '2025-12-10',
    reviewer: { id: 'u6', display_name: '艾咪', avatar_url: '' },
  },
];

export interface Pet {
  id: string;
  user_id: string;
  name: string;
  pet_type: 'dog' | 'cat' | 'rabbit' | 'other';
  breed?: string;
  age_category: 'puppy' | 'adult' | 'senior';
  weight?: number;
  gender?: 'male' | 'female';
  is_aggressive: boolean;
  needs_separate_food: boolean;
  has_attack_history: boolean;
  needs_dog_free: boolean;
  has_allergies: string[];
  has_medical_condition: boolean;
  medical_notes?: string;
  dietary_notes?: string;
  photo_url?: string;
  is_active: boolean;
}

export interface Booking {
  id: string;
  booking_number: string;
  sitter_id: string;
  user_id: string;
  service_type: 'boarding' | 'home_visit' | 'walking' | 'daycare';
  start_date: string;
  end_date: string;
  pet_ids: string[];
  subtotal: number;
  service_fee: number;
  discount: number;
  total: number;
  special_requests?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  created_at: string;
  sitter?: Sitter;
  pets?: Pet[];
}

export interface Availability {
  id: string;
  sitter_id: string;
  date: string;
  time_slots: string[];
  max_bookings: number;
  current_bookings: number;
  is_available: boolean;
}

// Mock 資料
export const mockSitters: Sitter[] = [
  {
    id: '1',
    user_id: 'user1',
    display_name: '陳美麗',
    tagline: '用愛守護每一隻毛小孩',
    bio: '從事寵物照顧超過5年，持有寵物美容執照，對待每個毛小孩如同自己的家人。有耐心、愛心，擅長與害羞的寵物建立信任關係。',
    cover_images: ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800'],
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    location_district: '鼓山區',
    is_verified: true,
    rating_professional: 4.8,
    rating_love: 5.0,
    rating_response: 4.9,
    rating_cleanliness: 4.7,
    rating_punctuality: 4.8,
    review_count: 127,
    avg_rating: 4.9,
    service_areas: ['鼓山區', '美術館'],
    pet_types: ['dog', 'cat'],
    max_pets: 3,
    response_time_minutes: 15,
    is_active: true,
  },
  {
    id: '2',
    user_id: 'user2',
    display_name: '林志偉',
    tagline: '專業日間照顧，讓毛小孩白天也不無聊',
    bio: '熱愛動物的年輕保母，擅長帶狗狗散步和互動玩耍。住在透天厝，有超大庭院讓毛小孩自由奔跑。',
    cover_images: ['https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800'],
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    location_district: '苓雅區',
    is_verified: true,
    rating_professional: 4.6,
    rating_love: 4.9,
    rating_response: 4.7,
    rating_cleanliness: 4.5,
    rating_punctuality: 4.6,
    review_count: 89,
    avg_rating: 4.6,
    service_areas: ['苓雅區', '前鎮區'],
    pet_types: ['dog'],
    max_pets: 2,
    response_time_minutes: 30,
    is_active: true,
  },
  {
    id: '3',
    user_id: 'user3',
    display_name: '黃小貓',
    tagline: '專業到府照顧，不讓毛小孩離開家',
    bio: '到府照顧專家，會到您家陪伴毛小孩，讓牠們在熟悉的環境中安心度過主人不在的時光。',
    cover_images: ['https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800'],
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    location_district: '左營區',
    is_verified: false,
    rating_professional: 4.4,
    rating_love: 4.8,
    rating_response: 4.5,
    rating_cleanliness: 4.6,
    rating_punctuality: 4.3,
    review_count: 56,
    avg_rating: 4.5,
    service_areas: ['左營區', '楠梓區'],
    pet_types: ['cat', 'rabbit'],
    max_pets: 4,
    response_time_minutes: 45,
    is_active: true,
  },
  {
    id: '4',
    user_id: 'user4',
    display_name: '王大明',
    tagline: '全天候寄宿服務，出差旅行好放心',
    bio: '自家別墅改建的寵物寄宿空間，佔地200坪，有專屬遊戲區和安靜休息區。24小時監控，隨時可透過手機查看毛小孩狀況。',
    cover_images: ['https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800'],
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    location_district: '鳥松區',
    is_verified: true,
    rating_professional: 4.9,
    rating_love: 4.7,
    rating_response: 4.8,
    rating_cleanliness: 5.0,
    rating_punctuality: 4.9,
    review_count: 203,
    avg_rating: 4.8,
    service_areas: ['鳥松區', '仁武區', '大寮區'],
    pet_types: ['dog', 'cat', 'rabbit', 'other'],
    max_pets: 8,
    response_time_minutes: 10,
    is_active: true,
  },
];

export const mockSitterServices: SitterService[] = [
  { id: '1', sitter_id: '1', service_type: 'boarding', price_per_night: 800, description: '包含早晚餵食、散步、住宿環境清潔', is_active: true },
  { id: '2', sitter_id: '1', service_type: 'home_visit', price_per_visit: 500, description: '到府陪伴30分鐘，包含餵食、玩耍、清潔', is_active: true },
  { id: '3', sitter_id: '1', service_type: 'walking', price_per_hour: 200, description: '戶外散步60分鐘，適合活潑狗狗', is_active: true },
  { id: '4', sitter_id: '1', service_type: 'daycare', price_per_hour: 250, description: '日間照顧，適合上班族', is_active: true },
  { id: '5', sitter_id: '2', service_type: 'walking', price_per_hour: 150, description: '社區散步60分鐘', is_active: true },
  { id: '6', sitter_id: '2', service_type: 'daycare', price_per_hour: 200, description: '日間照顧，歡迎來我家玩', is_active: true },
  { id: '7', sitter_id: '3', service_type: 'home_visit', price_per_visit: 400, description: '到府照顧45分鐘，細心呵護', is_active: true },
  { id: '8', sitter_id: '3', service_type: 'walking', price_per_hour: 180, description: '到府接送的散步服務', is_active: true },
  { id: '9', sitter_id: '4', service_type: 'boarding', price_per_night: 1200, description: '豪華寄宿別墅，含三餐、散步、24H監控', is_active: true },
  { id: '10', sitter_id: '4', service_type: 'daycare', price_per_hour: 300, description: 'VIP日間照顧，獨立房間', is_active: true },
];

export const mockPets: Pet[] = [
  {
    id: '1',
    user_id: 'current-user',
    name: '豆皮',
    pet_type: 'dog',
    breed: '柴犬',
    age_category: 'adult',
    weight: 12.5,
    gender: 'male',
    is_aggressive: false,
    needs_separate_food: false,
    has_attack_history: false,
    needs_dog_free: false,
    has_allergies: [],
    has_medical_condition: false,
    dietary_notes: '腸胃敏感，建議食用皇家腸胃敏感配方飼料',
    is_active: true,
  },
  {
    id: '2',
    user_id: 'current-user',
    name: '咪嚕',
    pet_type: 'cat',
    breed: '英國短毛貓',
    age_category: 'senior',
    weight: 4.5,
    gender: 'female',
    is_aggressive: false,
    needs_separate_food: true,
    has_attack_history: false,
    needs_dog_free: true,
    has_allergies: [],
    has_medical_condition: true,
    medical_notes: '有慢性腎病，需定時服藥',
    dietary_notes: '處方飼料+每日三次餵藥',
    is_active: true,
  },
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    booking_number: 'BK2026050101',
    sitter_id: '1',
    user_id: 'current-user',
    service_type: 'boarding',
    start_date: '2026-06-05',
    end_date: '2026-06-08',
    pet_ids: ['1'],
    subtotal: 2400,
    service_fee: 240,
    discount: 0,
    total: 2640,
    special_requests: '豆皮需要每天刷牙，請協助留意',
    emergency_contact_name: '王小明',
    emergency_contact_phone: '0912345678',
    status: 'confirmed',
    payment_status: 'paid',
    created_at: '2026-05-20T10:30:00Z',
  },
  {
    id: '2',
    booking_number: 'BK2026041501',
    sitter_id: '2',
    user_id: 'current-user',
    service_type: 'walking',
    start_date: '2026-04-15',
    end_date: '2026-04-15',
    pet_ids: ['1'],
    subtotal: 450,
    service_fee: 45,
    discount: 0,
    total: 495,
    status: 'completed',
    payment_status: 'paid',
    created_at: '2026-04-10T15:00:00Z',
  },
];

// 取得保母報價最低價格
export function getLowestPrice(sitterId: string): number | null {
  const services = mockSitterServices.filter(s => s.sitter_id === sitterId && s.is_active);
  if (services.length === 0) return null;
  
  const prices: number[] = [];
  services.forEach(s => {
    if (s.price_per_night) prices.push(s.price_per_night);
    if (s.price_per_visit) prices.push(s.price_per_visit);
    if (s.price_per_hour) prices.push(s.price_per_hour);
  });
  
  return prices.length > 0 ? Math.min(...prices) : null;
}

// 服務類型中文
export const serviceTypeNames: Record<string, string> = {
  boarding: '寄宿',
  home_visit: '到府',
  walking: '散步',
  daycare: '日照',
};

// 寵物類型中文
export const petTypeNames: Record<string, string> = {
  dog: '狗',
  cat: '貓',
  rabbit: '兔',
  other: '其他',
};

// 狀態中文
export const statusNames: Record<string, string> = {
  pending: '待確認',
  confirmed: '已確認',
  in_progress: '服務中',
  completed: '已完成',
  cancelled: '已取消',
  refunded: '已退款',
};

// 取得六日後的日期陣列（用於行事曆）
export function getNextMonthDates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

// 檢查日期是否可預約
export function isDateAvailable(sitterId: string, date: string): boolean {
  // Mock：隨機決定哪些日期可預約
  const day = new Date(date).getDate();
  return day % 3 !== 0; // 讓 3 的倍數日期為已滿
}