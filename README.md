# Generic Data Grid 📊

یک ماژول Grid حرفه‌ای، قابل‌استفاده‌مجدد و قابل‌توسعه برای پروژه‌های React/Next.js با پشتیبانی کامل برای صفحه‌بندی، مرتب‌سازی، و فیلتر کردن سمت سرور.

---

## 🎯 معرفی

پروژه **Generic Data Grid** یک کامپوننت Grid عمومی و مستقل است که می‌تواند در هر پروژه React یا Next.js استفاده شود. این ماژول تمام ویژگی‌های حرفه‌ای مورد نیاز برای نمایش داده‌های بزرگ را پشتیبانی می‌کند:

- 📄 **صفحه‌بندی** سمت سرور با تغییر تعداد آیتم
- 🔤 **مرتب‌سازی** صعودی و نزولی
- 🔍 **فیلتر کردن** به روش‌های مختلف (متنی، عددی، تاریخ، انتخابی، بولی)
- 📊 **ستون‌های داینامیک** با نوع‌های مختلف
- 🔄 **URL-Syncing** برای ذخیره‌سازی state در URL
- ⚡ **بارگذاری** و **Empty States**

---

## 🚀 نحوه اجرا

### نیازمندی‌ها
- Node.js 18+
- npm یا yarn

### نصب و اجرا

```bash
# 1. Clone مخزن
git clone https://github.com/muhammadalitamanaee/Generic-Data-Grid.git
cd Generic-Data-Grid

# 2. نصب dependencies
npm install

# 3. اجرای development server
npm run dev

# 4. باز کردن مرورگر
# http://localhost:3000
```

### ساخت برای Production
```bash
npm run build
npm run start
```

---

## 🏗️ ساختار پروژه

```
Generic-Data-Grid/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # صفحه اصلی (Server Component)
│   └── globals.css              # استایل‌های جهانی
│
├── src/
│   ├── components/
│   │   ├── grid/
│   │   │   ├── DataGrid.tsx          # کامپوننت Grid اصلی
│   │   │   ├── GridFilters.tsx       # کامپوننت فیلترها
│   │   │   ├── CellRenderer.tsx      # رندر کننده سلول‌ها
│   │   │   └── Clientgridwrapper.tsx # Wrapper برای client-side state
│   │   │
│   │   └── ui/
│   │       └── Input.tsx             # کامپوننت Input تگ شده
│   │
│   ├── hooks/
│   │   ├── useGridState.ts      # مدیریت state و URL syncing
│   │   └── useDebounce.ts       # Debounce hook برای فیلترها
│   │
│   ├── lib/
│   │   ├── mockApi.ts           # Mock API برای داده‌های تستی
│   │   └── utils.ts             # توابع کمکی
│   │
│   └── types/
│       └── grid.ts              # Type definitions
│
├── public/                       # فایل‌های Static
├── package.json
├── tsconfig.json
└── tailwind.config.js           # تنظیمات Tailwind
```

---

## 🏛️ توضیح معماری

### جریان داده‌ها:

```
┌─────────────────────────────────────────────────────────────┐
│                    صفحه اصلی (page.tsx)                     │
│               [Server Component - SSR]                      │
│  - پردازش URL parameters                                   │
│  - Fetch اولیه از Mock API                                  │
│  - ارسال data به ClientGridWrapper                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│            ClientGridWrapper (Client Component)             │
│  - مدیریت state با useGridState                            │
│  - همگام‌سازی state با URL                                 │
│  - نمایش DataGrid و GridFilters                            │
└──┬──────────────────────────────────┬──────────────────────┘
   │                                  │
   ▼                                  ▼
┌──────────────────────┐    ┌───────────────────────────┐
│     GridFilters      │    │       DataGrid            │
│ - فیلتر متنی        │    │ - رندر جدول              │
│ - فیلتر عددی        │    │ - مرتب‌سازی              │
│ - فیلتر تاریخ       │    │ - صفحه‌بندی             │
│ - فیلتر انتخابی     │    │ - loading state          │
│ - فیلتر بولی        │    └───────────────────────────┘
└──────────────────────┘
```

### State Management:

```
URL ◄─────────────────────► useGridState Hook
  │                              │
  ├─ page=1                      ├─ currentState
  ├─ pageSize=10                 ├─ updateState()
  ├─ sort=name:asc               │
  ├─ filter_name=Ali             ▼
  └─ filterop_name=contains  GridState
                                  ├─ page
                                  ├─ pageSize
                                  ├─ sort[]
                                  └─ filters[]
```

---

## 💡 تصمیمات فنی

### 1️⃣ **استفاده از TypeScript**
- **دلیل**: Safety و autocompletion بهتر
- **مزیت**: کاهش bugs، توثیق بهتر، IDE support
- **پیاده‌سازی**: Generic types برای flexibility

```typescript
interface DataGridProps<T> {
  columns: ColumnConfig<T>[];
  data: T[];
}
```

### 2️⃣ **Next.js 16 + App Router**
- **دلیل**: Server-side rendering و API optimization
- **مزیت**: بارگذاری سریع‌تر، بهتر برای SEO
- **پیاده‌سازی**: Server Component برای صفحه، Client Components برای Grid

### 3️⃣ **URL-Based State Management**
- **دلیل**: Bookmarkable/Shareable URLs
- **مزیت**: کاربر می‌تواند URL را save کند و وضعیت Grid بازیابی شود
- **پیاده‌سازی**: useSearchParams + router.push

```
URL مثال:
/?page=2&pageSize=20&sort=name:asc&filter_role=admin&filterop_role=equals
```

### 4️⃣ **Mock API سمت سرور**
- **دلیل**: تست واقعی‌تر بدون backend حقیقی
- **مزیت**: شبیه‌سازی latency شبکه، filtering/sorting سمت سرور
- **پیاده‌سازی**: mockApi.ts با 120 رکورد

### 5️⃣ **Tailwind CSS**
- **دلیل**: Utility-first CSS، bundle size کم
- **مزیت**: تعریف سریع‌تر styles، RTL support خوب
- **پیاده‌سازی**: Tailwind 4 + RTL layout

### 6️⃣ **Generic Component Design**
- **دلیل**: Reusability در پروژه‌های مختلف
- **مزیت**: کامپوننت‌ها از data type مستقل هستند
- **پیاده‌سازی**: Generic `<T>` parameters

### 7️⃣ **Debounced Filtering**
- **دلیل**: جلوگیری از درخواست‌های زیاد API
- **مزیت**: کاهش بار سرور، UX بهتر
- **پیاده‌سازی**: useDebounce hook

---

## ✨ ویژگی‌های پیاده‌شده

### الزامی ✅

| ویژگی | وضعیت | جزئیات |
|------|-------|-------|
| صفحه‌بندی کامل | ✅ | پشتیبانی page، pageSize، total |
| تغییر تعداد آیتم | ✅ | Select: 5, 10, 20, 50 |
| نمایش شماره صفحات | ✅ | "صفحه 2 از 12" |
| رفتن به صفحه مشخص | ✅ | دکمه‌های Next/Previous |
| Server-side Pagination | ✅ | در mockApi.ts |
| مرتب‌سازی صعودی/نزولی | ✅ | Click on header |
| Server-side Sorting | ✅ | در mockApi.ts |
| فیلتر متنی | ✅ | Text input "contains" |
| فیلتر عددی | ✅ | Number input "gt/lt" |
| فیلتر تاریخ | ✅ | Date input "equals" |
| فیلتر انتخابی | ✅ | Dropdown با options |
| فیلتر بولی | ✅ | Toggle/Checkbox |
| ترکیب چند فیلتر | ✅ | تمام فیلترها با هم |
| Server-side Filtering | ✅ | در mockApi.ts |
| ستون‌های داینامیک | ✅ | از طریق columns config |
| نوع متنی | ✅ | "text" type |
| نوع عددی | ✅ | "number" type |
| نوع تاریخ | ✅ | "date" type (Jalali) |
| نوع بولی | ✅ | "boolean" type |
| Custom Renderer | ✅ | render prop |
| Loading State | ✅ | Loader2 icon |
| Empty State | ✅ | "داده‌ای برای نمایش ندارد" |
| Error State | ✅ | Error handling |

### امتیازات مثبت 💎

| ویژگی | وضعیت | جزئیات |
|------|-------|-------|
| TypeScript | ✅ | Full type safety |
| معماری حرفه‌ای | ✅ | Clean code، Separation of concerns |
| Generic Components | ✅ | Reusable design |
| URL Sync | ✅ | page، sort، filters |
| Persist Settings | ✅ | URL-based persistence |

---

## 📖 نحوه استفاده

### نمونه ۱: استفاده ساده

```tsx
import { DataGrid } from '@/src/components/grid/DataGrid';
import { ColumnConfig } from '@/types/grid';

type User = {
  id: number;
  name: string;
  age: number;
};

const columns: ColumnConfig<User>[] = [
  { key: 'name', title: 'نام', type: 'text', sortable: true, filterable: true },
  { key: 'age', title: 'سن', type: 'number', sortable: true, filterable: true },
];
```

### نمونه ۲: با Custom Renderer

```tsx
const columns: ColumnConfig<User>[] = [
  {
    key: 'name',
    title: 'نام',
    type: 'custom',
    render: (value, record) => (
      <span className="font-bold text-blue-600">{value}</span>
    ),
  },
];
```

### نمونه ۳: با فیلتر Select

```tsx
const columns: ColumnConfig<User>[] = [
  {
    key: 'role',
    title: 'نقش',
    type: 'text',
    filterType: 'select',
    filterOptions: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
    ],
  },
];
```

---

## 🔧 نقاط قابل توسعه

### 1. Export به CSV/Excel

```typescript
// src/lib/exporters.ts
export function exportToCSV<T>(data: T[], columns: ColumnConfig<T>[]) {
  // پیاده‌سازی export
}
```

### 2. Column Visibility Toggle

```typescript
// اضافه کردن UI برای مخفی/نمایش ستون‌ها
<button onClick={() => toggleColumnVisibility('name')}>
  ✓ نام
</button>
```

### 3. Action Column

```typescript
{
  key: 'actions',
  title: 'عملیات',
  type: 'custom',
  render: (_, record) => (
    <div>
      <button>ویرایش</button>
      <button>حذف</button>
    </div>
  ),
}
```

### 4. Drag & Drop Columns

```typescript
// استفاده از react-beautiful-dnd یا react-dnd
import { DndContext } from '@dnd-kit/core';
```

### 5. Advanced Filtering (Multi-column)

```typescript
// فعلا: یک sort column
// آینده: چند sort column
if (state.sort.length > 1) {
  // Multi-column sort
}
```

### 6. Persisting User Settings

```typescript
// localStorage یا database
const savedSettings = localStorage.getItem('gridSettings');
```

---

## 📊 داده‌های نمونه

### Mock Data Structure

```typescript
type MockRecord = {
  id: number;
  name: string;
  age: number;
  createdAt: string;  // YYYY-MM-DD
  isActive: boolean;
  role: string;
};
```

**تعداد رکورد**: 120 تا

---

## 🛠️ Stack فنی

| تکنولوژی | نسخه | دلیل |
|---------|------|------|
| React | 19.2.4 | UI library |
| Next.js | 16.2.4 | Framework، SSR |
| TypeScript | 5 | Type safety |
| Tailwind | 4 | CSS utility |
| lucide-react | 1.14 | Icons |

---

**آخرین به‌روزرسانی**: 2026-05-07
