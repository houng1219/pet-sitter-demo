# 毛孩保母 - 高雄寵物照顧預約平台

一個專為高雄地區設計的寵物保母預約系統 MVP，幫助寵物主人輕鬆找到優質的寵物照顧服務。

## 📋 功能一覽

### 顧客端功能

| 頁面 | 功能說明 |
|------|----------|
| **首頁** (`/`) | 搜尋框、服務類型快速入口、精選保母橫向卡片展示、底部導航列 |
| **保母列表** (`/sitters`) | 多條件篩選（地區/寵物類型/服務/價格/評價）、卡片列表、地圖模式切換 |
| **保母檔案** (`/sitters/[id]`) | 封面圖輪播、頭像驗證章、五維雷達圖、服務說明、收費標準、本月行事曆 |
| **預約表單** (`/booking/new`) | 服務選擇、日期範圍、寵物選擇、特殊需求、緊急聯絡人、即時費用計算 |
| **會員中心** (`/member`) | 會員資訊、快速入口、即將到來的預約卡片 |
| **我的寵物** (`/member/pets`) | 寵物列表、新增/編輯/刪除表單、行為特性與健康狀況 |
| **我的預約** (`/member/bookings`) | Tab 切換（即將到來/歷史）、預約卡片、預約詳情 |

### 保母端功能（管理後台）

> ⚠️ 管理後台功能將在後續迭代中實作

- [ ] 日曆管理
- [ ] 預約清單
- [ ] 服務設定
- [ ] 評價回覆

## 🛠 技術棧

| 類別 | 技術 |
|------|------|
| **前端框架** | Next.js 14 (App Router) |
| ** UI 框架** | Tailwind CSS 4 + shadcn/ui 元件庫 |
| **後端 + 資料庫** | Supabase (PostgreSQL + Auth + Storage) |
| **部署平台** | Vercel |
| **開發語言** | TypeScript |
| **介面語言** | 繁體中文 |

## 🚀 環境安裝

### 前置需求

- Node.js 18.17 或更新版本
- npm 或 yarn
- Supabase 帳號

### 安裝步驟

```bash
# 1. 複製專案
git clone <repository-url>
cd pet-sitter-demo

# 2. 安裝依賴
npm install

# 3. 複製環境變數範例檔案
cp .env.local.example .env.local

# 4. 填入您的 Supabase 憑證
# 編輯 .env.local，填入：
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 5. 啟動開發伺服器
npm run dev
```

專案將運行在 `http://localhost:3000`

## 🔧 Supabase 設定步驟

### Step 1：建立 Supabase 專案

1. 前往 [Supabase](https://supabase.com) 並登入
2. 點擊「New Project」建立新專案
3. 選擇或建立組織，設定專案名稱（如 `pet-sitter-demo`）
4. 設定資料庫密碼（妥善保存）
5. 選擇 ближайший 區域（建議： Northeast Asia - Tokyo）
6. 等待專案建立完成（約 2 分鐘）

### Step 2：執行 Schema SQL

1. 在 Supabase Dashboard 左側選單點擊「SQL Editor」
2. 點擊「New Query」建立新查詢
3. 複製 `supabase/schema.sql` 的內容並貼上
4. 點擊「Run」執行 SQL
5. 確認所有表格建立成功（應該看到 9 個表格被建立）

### Step 3：取得 API Keys

1. 前往「Project Settings」（左側齒輪圖示）
2. 點擊「API」頁面
3. 複製以下資訊：
   - **Project URL**：這是您的 `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public**：這是您的 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4：設定環境變數

將上一步取得的 Key 填入 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### Step 5：啟用 Email 登入（可選）

1. 在 Supabase Dashboard 前往「Authentication」→「Providers」
2. 確認「Email」已啟用
3. 如需自訂郵件範本，可前往「Email Templates」設定

## 📁 專案結構

```
pet-sitter-demo/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 首頁
│   │   ├── layout.tsx            # 根佈局
│   │   ├── client-layout.tsx     # 客戶端佈局（含底部導航）
│   │   ├── globals.css           # 全域樣式
│   │   ├── sitters/
│   │   │   ├── page.tsx         # 保母列表頁
│   │   │   └── [id]/page.tsx    # 保母檔案頁
│   │   ├── booking/
│   │   │   └── new/page.tsx     # 預約表單
│   │   └── member/
│   │       ├── page.tsx         # 會員中心
│   │       ├── pets/page.tsx    # 我的寵物
│   │       └── bookings/
│   │           ├── page.tsx     # 我的預約列表
│   │           └── [id]/page.tsx # 預約詳情
│   ├── lib/
│   │   └── mock-data.ts         # Mock 資料與類型定義
│   └── types/                   # （預留）類型定義
├── supabase/
│   └── schema.sql               # 資料庫 Schema
├── public/                      # 靜態資源
├── .env.local.example           # 環境變數範例
├── package.json
└── README.md
```

## 🎨 設計說明

### 色彩系統

| 用途 | 顏色 |
|------|------|
| Primary | `#f97316` (Orange 500) |
| Primary Hover | `#ea580c` (Orange 600) |
| Background | `#f9fafb` (Gray 50) |
| Card Background | `#ffffff` (White) |
| Text Primary | `#171717` (Gray 900) |
| Text Secondary | `#6b7280` (Gray 500) |

### 元件尺寸

- 使用 Tailwind 標準尺寸：`sm`、`md`、`lg`、`xl`
- 卡片圓角：`rounded-xl`（12px）
- 按鈕高度：`py-3`、`py-4`
- 間距：`p-4`、`mx-4`、`mt-4`

## 📝 注意事項

### 關於 Mock 資料

目前系統使用 `src/lib/mock-data.ts` 中的靜態資料模擬資料內容。這是為了：

1. 在沒有 Supabase 實例的情況下也能展示功能
2. 加快開發迭代速度
3. 方便進行 UI/UX 測試

**正式上線前**，請確保：

1. 替換所有 Mock 資料為 Supabase 即時資料
2. 實作正確的表單驗證
3. 設定適當的錯誤處理
4. 啟用 Row Level Security (RLS) 策略

### 關於金流

目前系統**尚未串接真實金流**，付款頁面僅作 UI 展示用。如需上線，請自行整合：

- [x] 綠界科技 ECPay
- [x] 藍新金流 NewebPay
- [x] Stripe

### 關於地圖

目前「地圖模式」僅展示提示文字，需要 Google Maps API 金鑰才能啟用。如需地圖功能，請：

1. 取得 Google Maps API Key
2. 在 `/sitters` 頁面實作地圖元件

## 🚢 Vercel 部署

### 方式一：透過 GitHub 自動部署

1. 將專案推送到 GitHub
2. 在 Vercel 建立新專案
3. 選擇 GitHub 倉庫
4. 設定環境變數：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. 點擊 Deploy

### 方式二：手動部署

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 登入
vercel login

# 部署
vercel --prod
```

### 環境變數設定（Vercel）

在 Vercel Dashboard 的「Environment Variables」中設定：

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | 您的 Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 您的 Supabase Anon Key |

## 🔮 未來規劃

- [ ] 保母管理後台（日曆、預約、服務設定）
- [ ] 即時聊天功能
- [ ] 推播通知
- [ ] 評價系統
- [ ] 優惠券系統
- [ ] 會員等級制度
- [ ] 寵物相簿功能
- [ ] 多元支付串接
- [ ] 網站SEO優化

## 📄 License

MIT License