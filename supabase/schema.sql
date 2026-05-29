-- 寵物保母預約系統 - Supabase Schema
-- 繁體中文環境

-- 啟用 UUID 擴展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 表格：profiles（用戶基本資料）
-- =============================================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'sitter', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 表格：sitters（保母檔案）
-- =============================================================================
CREATE TABLE sitters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- 基本資訊
    display_name TEXT NOT NULL,
    tagline TEXT, -- 標語
    bio TEXT, -- 自我介紹
    cover_images TEXT[], -- 封面圖片陣列
    avatar_url TEXT,
    
    -- 位置
    location_district TEXT NOT NULL, -- 行政區（鼓山區、苓雅區等）
    location_address TEXT, -- 詳細地址
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- 驗證狀態
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    
    -- 五維評價（1-5分）
    rating_professional DECIMAL(2, 1) DEFAULT 0,
    rating_love DECIMAL(2, 1) DEFAULT 0,
    rating_response DECIMAL(2, 1) DEFAULT 0,
    rating_cleanliness DECIMAL(2, 1) DEFAULT 0,
    rating_punctuality DECIMAL(2, 1) DEFAULT 0,
    
    -- 總評價數
    review_count INTEGER DEFAULT 0,
    avg_rating DECIMAL(2, 1) DEFAULT 0,
    
    -- 服務區域
    service_areas TEXT[], -- 可服務的行政區陣列
    pet_types TEXT[], -- 支援的寵物類型（dog, cat, rabbit, other）
    
    -- 寵物容量
    max_pets INTEGER DEFAULT 1,
    
    -- 聯絡方式
    response_time_minutes INTEGER, -- 平均回覆時間（分鐘）
    
    -- 狀態
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 表格：sitter_services（保母服務項目與價格）
-- =============================================================================
CREATE TABLE sitter_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sitter_id UUID NOT NULL REFERENCES sitters(id) ON DELETE CASCADE,
    
    -- 服務類型
    service_type TEXT NOT NULL CHECK (service_type IN (
        'boarding', -- 寄宿
        'home_visit', -- 到府照顧
        'walking', -- 散步
        'daycare' -- 日間照顧
    )),
    
    -- 價格（每晚/每次/每小時）
    price_per_night DECIMAL(10, 0), -- 寄宿每晚價格
    price_per_visit DECIMAL(10, 0), -- 到府每次價格
    price_per_hour DECIMAL(10, 0), -- 散步/日照每小時價格
    
    -- 服務說明
    description TEXT,
    
    -- 寵物類型加價
    extra_fee_small_pets DECIMAL(10, 0) DEFAULT 0, -- 小型寵物加價
    extra_fee_large_pets DECIMAL(10, 0) DEFAULT 0, -- 大型寵物加價
    
    -- 啟用狀態
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 表格：sitter_reviews（保母評價）
-- =============================================================================
CREATE TABLE sitter_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sitter_id UUID NOT NULL REFERENCES sitters(id) ON DELETE CASCADE,
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id),
    
    -- 評價內容
    overall_rating DECIMAL(2, 1) NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    rating_professional DECIMAL(2, 1),
    rating_love DECIMAL(2, 1),
    rating_response DECIMAL(2, 1),
    rating_cleanliness DECIMAL(2, 1),
    rating_punctuality DECIMAL(2, 1),
    
    comment TEXT,
    photos TEXT[],
    
    -- 回覆
    sitter_reply TEXT,
    sitter_reply_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 表格：pets（會員的寵物）
-- =============================================================================
CREATE TABLE pets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- 基本資料
    name TEXT NOT NULL,
    pet_type TEXT NOT NULL CHECK (pet_type IN ('dog', 'cat', 'rabbit', 'other')),
    breed TEXT, -- 品種
    age_category TEXT NOT NULL CHECK (age_category IN ('puppy', 'adult', 'senior')), -- 幼/成/老
    weight DECIMAL(5, 1), -- 體重（kg）
    gender TEXT CHECK (gender IN ('male', 'female')),
    
    -- 行為特性
    is_aggressive BOOLEAN DEFAULT false,
    needs_separate_food BOOLEAN DEFAULT false, -- 需要分開餵食
    has_attack_history BOOLEAN DEFAULT false, -- 有攻擊歷史
    needs_dog_free BOOLEAN DEFAULT false, -- 需要遠離狗
    has_allergies TEXT[], -- 過敏源陣列
    
    -- 健康狀況
    has_medical_condition BOOLEAN DEFAULT false,
    medical_notes TEXT, -- 醫療備註
    dietary_notes TEXT, -- 飲食特殊指示
    
    -- 照片
    photo_url TEXT,
    
    -- 狀態
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 表格：bookings（預約訂單）
-- =============================================================================
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number TEXT NOT NULL UNIQUE, -- 預約編號
    
    -- 關聯
    sitter_id UUID NOT NULL REFERENCES sitters(id),
    user_id UUID NOT NULL REFERENCES profiles(id),
    
    -- 服務資訊
    service_type TEXT NOT NULL CHECK (service_type IN (
        'boarding', 'home_visit', 'walking', 'daycare'
    )),
    
    -- 時間
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    
    -- 寵物
    pet_ids UUID[] NOT NULL, -- 預約的寵物陣列
    
    -- 費用
    subtotal DECIMAL(10, 0) NOT NULL, -- 小計
    service_fee DECIMAL(10, 0) DEFAULT 0, -- 服務費
    discount DECIMAL(10, 0) DEFAULT 0, -- 折扣
    total DECIMAL(10, 0) NOT NULL, -- 總計
    
    -- 特殊需求
    special_requests TEXT,
    
    -- 緊急聯絡人
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    
    -- 狀態
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', -- 待確認
        'confirmed', -- 已確認
        'in_progress', -- 服務中
        'completed', -- 已完成
        'cancelled', -- 已取消
        'refunded' -- 已退款
    )),
    
    -- 付款狀態
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN (
        'unpaid', 'paid', 'refunded'
    )),
    paid_at TIMESTAMPTZ,
    
    -- 取消資訊
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 表格：booking_services（預約服務內容）
-- =============================================================================
CREATE TABLE booking_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    sitter_service_id UUID NOT NULL REFERENCES sitter_services(id),
    
    -- 服務詳情
    service_type TEXT NOT NULL,
    unit_price DECIMAL(10, 0) NOT NULL, -- 單價
    quantity INTEGER NOT NULL DEFAULT 1, -- 數量
    days INTEGER, -- 天數（寄宿用）
    hours INTEGER, -- 小時數（散步/日照用）
    subtotal DECIMAL(10, 0) NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 表格：messages（聊天訊息）
-- =============================================================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    
    -- 發送者與接收者
    sender_id UUID NOT NULL REFERENCES profiles(id),
    receiver_id UUID NOT NULL REFERENCES profiles(id),
    
    -- 訊息內容
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN (
        'text', 'image', 'system'
    )),
    
    -- 讀取狀態
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 表格：availability（保母可用日曆）
-- =============================================================================
CREATE TABLE availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sitter_id UUID NOT NULL REFERENCES sitters(id) ON DELETE CASCADE,
    
    -- 日期
    date DATE NOT NULL,
    
    -- 該日可用時段
    time_slots TEXT[], -- 可用時段陣列，例如 ["09:00", "10:00", "11:00"]
    
    -- 該日預約上限
    max_bookings INTEGER DEFAULT 1,
    current_bookings INTEGER DEFAULT 0,
    
    -- 狀態
    is_available BOOLEAN DEFAULT true,
    notes TEXT, -- 備註（例如：請假）
    
    -- 日期唯一性約束
    UNIQUE(sitter_id, date)
);

-- =============================================================================
-- 索引
-- =============================================================================
CREATE INDEX idx_sitters_user_id ON sitters(user_id);
CREATE INDEX idx_sitters_location ON sitters(location_district);
CREATE INDEX idx_sitters_rating ON sitters(avg_rating DESC);
CREATE INDEX idx_sitter_services_sitter_id ON sitter_services(sitter_id);
CREATE INDEX idx_sitter_reviews_sitter_id ON sitter_reviews(sitter_id);
CREATE INDEX idx_pets_user_id ON pets(user_id);
CREATE INDEX idx_bookings_sitter_id ON bookings(sitter_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_availability_sitter_date ON availability(sitter_id, date);

-- =============================================================================
-- 触发器：更新 updated_at
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER sitters_updated_at
    BEFORE UPDATE ON sitters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER sitter_services_updated_at
    BEFORE UPDATE ON sitter_services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER pets_updated_at
    BEFORE UPDATE ON pets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- Row Level Security (RLS) 策略
-- =============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sitters ENABLE ROW LEVEL SECURITY;
ALTER TABLE sitter_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE sitter_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- profiles 策略
CREATE POLICY "公開顯示 profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "用戶可更新自己的 profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- sitters 策略
CREATE POLICY "公開顯示已啟用的 sitters" ON sitters FOR SELECT USING (is_active = true);
CREATE POLICY "保母可管理自己的 sitter 檔案" ON sitters FOR ALL USING (auth.uid() = user_id);

-- sitter_services 策略
CREATE POLICY "公開顯示 sitter_services" ON sitter_services FOR SELECT USING (true);
CREATE POLICY "保母可管理自己的服務" ON sitter_services FOR ALL USING (
    EXISTS (SELECT 1 FROM sitters WHERE id = sitter_id AND user_id = auth.uid())
);

-- sitter_reviews 策略
CREATE POLICY "公開顯示評價" ON sitter_reviews FOR SELECT USING (true);
CREATE POLICY "用戶可創建評價" ON sitter_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "保母可回覆評價" ON sitter_reviews FOR UPDATE USING (
    EXISTS (SELECT 1 FROM sitters WHERE id = sitter_id AND user_id = auth.uid())
);

-- pets 策略
CREATE POLICY "用戶可管理自己的寵物" ON pets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "保母可查看關聯預約的寵物" ON pets FOR SELECT USING (
    EXISTS (SELECT 1 FROM bookings b WHERE b.user_id = auth.uid() AND pet_ids @> ARRAY[ pets.id]::uuid[])
);

-- bookings 策略
CREATE POLICY "用戶可管理自己的預約" ON bookings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "保母可管理自己的預約" ON bookings FOR ALL USING (
    EXISTS (SELECT 1 FROM sitters WHERE id = sitter_id AND user_id = auth.uid())
);

-- booking_services 策略
CREATE POLICY "預約相關人員可查看服務詳情" ON booking_services FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM bookings b 
        WHERE b.id = booking_id AND (b.user_id = auth.uid() OR 
            EXISTS (SELECT 1 FROM sitters s WHERE s.id = b.sitter_id AND s.user_id = auth.uid()))
    )
);

-- messages 策略
CREATE POLICY "用戶可管理自己的訊息" ON messages FOR ALL USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- availability 策略
CREATE POLICY "公開顯示可用日曆" ON availability FOR SELECT USING (true);
CREATE POLICY "保母可管理自己的日曆" ON availability FOR ALL USING (
    EXISTS (SELECT 1 FROM sitters WHERE id = sitter_id AND user_id = auth.uid())
);

-- =============================================================================
-- 初始資料（Mock Data）
-- =============================================================================
-- 注意：這些是範例資料，生產環境應通過正規流程插入