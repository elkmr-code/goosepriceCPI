# 鵝價消費者物價指數 (CPI) 視覺化系統

## 專案簡介

本專案是一個基於 Node.js 和 Express 框架開發的鵝價消費者物價指數 (Consumer Price Index, CPI) 視覺化分析系統。透過 Chart.js 圖表庫，提供直觀的數據視覺化介面，協助分析鵝價變化趨勢。

## 主要功能

### 📊 數據視覺化
- **CPI 趨勢圖**: 顯示雛鵝與鵝肉價格指數的時間序列變化
- **年度平均 CPI**: 以長條圖呈現各年度的平均價格指數
- **互動式圖表**: 支援年份範圍篩選和動態更新

### 🔗 API 端點
- `/api/goose-cpi` - 取得鵝價 CPI 詳細資料
- `/api/years` - 取得可用年份清單
- `/api/cpi-summary` - 取得年度 CPI 統計摘要

### 🎨 使用者介面
- 響應式網頁設計 (Bootstrap 5)
- 繁體中文介面
- 直觀的操作控制面板

## 技術架構

### 後端技術
- **Node.js** - JavaScript 執行環境
- **Express.js** - Web 應用程式框架
- **SQLite3** - 輕量級關聯式資料庫
- **Pug** - 模板引擎

### 前端技術
- **Chart.js** - 圖表視覺化庫
- **Bootstrap 5** - CSS 框架
- **JavaScript (ES6+)** - 前端互動邏輯

### 資料格式
- CSV 格式的鵝價歷史資料
- SQLite 資料庫儲存處理後的 CPI 數據

## 安裝與執行

### 1. 環境需求
```bash
Node.js >= 14.x
npm >= 6.x
```

### 2. 專案設置
```bash
# 複製專案
git clone [repository-url]
cd goosepriceCPI

# 安裝相依套件
npm install

# 初始化資料庫
npm run setup-db
```

### 3. 執行應用程式
```bash
# 啟動開發伺服器
npm start

# 瀏覽器開啟
http://localhost:3000
```

## 資料庫結構

### goose_cpi 資料表
| 欄位名稱 | 型別 | 說明 |
|---------|------|------|
| id | INTEGER | 主鍵 |
| date | DATE | 資料日期 |
| year | INTEGER | 年份 |
| month | INTEGER | 月份 |
| chick_cpi | REAL | 雛鵝價格指數 |
| meat_cpi | REAL | 鵝肉價格指數 |
| chick_price | REAL | 雛鵝價格 |
| meat_price | REAL | 鵝肉價格 |

## API 使用說明

### 取得 CPI 資料
```http
GET /api/goose-cpi?startYear=2020&endYear=2023&limit=100
```

**查詢參數:**
- `year` - 特定年份
- `startYear` - 起始年份
- `endYear` - 結束年份
- `limit` - 資料筆數限制 (預設: 50)

**回應範例:**
```json
[
  {
    "id": 1,
    "date": "2023-01-01",
    "year": 2023,
    "month": 1,
    "chick_cpi": 105.2,
    "meat_cpi": 102.8,
    "chick_price": 52.6,
    "meat_price": 308.4
  }
]
```

### 取得可用年份
```http
GET /api/years
```

**回應範例:**
```json
[2020, 2021, 2022, 2023]
```

### 取得年度摘要
```http
GET /api/cpi-summary
```

**回應範例:**
```json
[
  {
    "year": 2023,
    "avg_chick_cpi": 104.5,
    "avg_meat_cpi": 103.2,
    "records_count": 12
  }
]
```

## 圖表功能

### 主要趨勢圖
- 顯示雛鵝與鵝肉 CPI 的時間序列變化
- 支援年份範圍篩選
- 互動式數據點顯示

### 年度統計圖表
- 雛鵝年度平均 CPI 長條圖
- 鵝肉年度平均 CPI 長條圖
- 自動計算並顯示年度統計數據

## 檔案結構

```
goosepriceCPI/
├── app.js                 # 主應用程式檔案
├── package.json           # 專案設定檔
├── goose_cpi.db          # SQLite 資料庫
├── bin/
│   └── www               # 伺服器啟動檔
├── routes/
│   ├── index.js          # 主要路由
│   └── users.js          # 使用者路由
├── views/
│   ├── layout.pug        # 頁面樣板
│   ├── index.pug         # 主頁面
│   └── error.pug         # 錯誤頁面
├── public/
│   ├── stylesheets/
│   │   └── style.css     # 樣式檔案
│   └── javascripts/
│       ├── dashboard.js  # 儀表板邏輯
│       └── cpi-charts.js # 圖表視覺化
└── scripts/
    └── setup-database.js # 資料庫初始化
```

## 開發指南

### 新增圖表類型
1. 在 `cpi-charts.js` 中定義新的圖表初始化函式
2. 在 `index.pug` 中新增對應的 canvas 元素
3. 實作資料處理和更新邏輯

### 擴充 API 端點
1. 在 `app.js` 中新增路由處理器
2. 實作資料庫查詢邏輯
3. 更新前端 JavaScript 以呼叫新端點

### 資料庫維護
```bash
# 重新初始化資料庫
npm run setup-db

# 檢查資料庫內容
sqlite3 goose_cpi.db ".tables"
sqlite3 goose_cpi.db "SELECT COUNT(*) FROM goose_cpi;"
```

## 故障排除

### 常見問題
1. **圖表不顯示**: 檢查 Chart.js 是否正確載入
2. **API 錯誤**: 確認資料庫連接正常
3. **資料不更新**: 檢查 JavaScript 控制台錯誤訊息

### 偵錯模式
```bash
# 啟用詳細日誌
DEBUG=goosecpi:* npm start
```

## 版本資訊

- **版本**: 0.0.0
- **Node.js**: >= 14.x
- **Chart.js**: 4.4.0
- **Bootstrap**: 5.1.3

## 授權資訊

此專案僅供學術研究與教育用途使用。

## 聯絡資訊

如有任何問題或建議，請透過專案 Issues 頁面聯絡開發團隊。

---

*最後更新: 2024年12月*
