# Advanced CRM Dashboard

A professional customer management dashboard built with modern React/Next.js tooling. The project focuses on customer data management, advanced filtering, search, pagination, form validation, data fetching/caching, and drag-and-drop interactions.

## Features

### Customer Management
- Customer table/card layout
- Customer name, email, phone, company, status, and last contact date
- View full customer details
- Add new customers
- Edit existing customers
- Delete customers with confirmation
- Update last contact date
- Customer notes/interactions

### Data Fetching
- TanStack Query for data fetching and caching
- Query loading and error states
- Mutations for add/edit/delete operations
- Query invalidation/refetching after mutations
- Configurable stale time
- Debounced search

### Forms & Validation
- shadcn/ui form components
- Required field validation
- Email validation
- Phone validation
- Inline validation errors
- Success/error toast notifications

### Drag & Drop
- Proper drag-and-drop library
- Reorderable customer/filter items
- Designed for extensible drag-and-drop interactions

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | React framework using the App Router |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling and responsive design |
| shadcn/ui | Reusable UI components |
| TanStack Query | Data fetching, caching, and mutations |
| dnd-kit | Drag-and-drop functionality |
| Lucide React | Icons |
| ESLint | Code quality and linting |

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd CRM-DASHBOARD
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Project Structure

```text
crm-dashboard/
│   ├── api/
│   │   ├── customer.ts
│   │   ├── filters.ts
│   │
│   ├── app/
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │
│   ├── components/
│   │   ├── customers/
│   │   │   ├── customer-details-dialog.tsx
│   │   │   ├── customer-form-dialog.tsx
│   │   │   ├── customer-table.tsx
│   │   │   ├── dashboard.tsx
│   │   │   ├── delete-customer-dialog.tsx
│   │   │   ├── filters-panel.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── stats-cards.tsx
│   │   
│   │   └── ui/
│   │
│   ├── hooks/
│   │   ├── use-customers.ts
│   │   └── use-debounce.ts
│   │   ├── use-deounce.ts
│   │
│   ├── lib/
│   │   ├── mock-data.ts
│   │   ├── qtypes.ts
│   │   ├── utils.ts
│   │
│   ├── providers/
│   │   └── provider.tsx
│   │
│
├── package.json
├── tsconfig.json
└── README.md
```

> The exact structure may evolve as features are implemented. The goal is to keep UI components, data fetching, validation, types, and business logic separated.

---

## Architecture

The application follows a component-based architecture with a clear separation of responsibilities.

### UI Layer

Reusable UI components are responsible for presentation and user interaction.

```text
components/
├── ui/
└── 
```

### Data Layer

Customer data and API operations are kept separate from UI components.

```text
/lib/mock-data/
/api/
```

### Query Layer

TanStack Query manages server-state fetching, caching, mutations, and invalidation.

```text
hooks/
providers/
```

---

## Customer Data Model

```ts
export type CustomerStatus = "active" | "inactive";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  lastContactDate: string;
  notes: string;
  createdAt: string;
}
```

---

## TanStack Query

TanStack Query is used for customer data operations.

Typical query:

```ts
const { data, isLoading, isError } = useQuery({
  queryKey: ["customers"],
  queryFn: getCustomers,
});
```

Mutations are used for operations such as:

- Create customer
- Update customer
- Delete customer
- Reorder customers
- Reorder saved filters

After mutations, related queries should be invalidated or updated so the UI remains synchronized.

---

## UI Design

The visual direction follows a professional CRM dashboard:

- Dark dashboard interface
- Sidebar navigation
- Compact header
- Customer management table
- Filter controls
- Modal/drawer interactions
- Status badges
- Clear primary actions
- Consistent spacing and typography

The provided assignment screenshots are used as the visual reference for the overall CRM dashboard, customer table, filter panel, add-customer form, and customer details modal.

---

## Error & Loading States

The application should provide clear feedback for:

- Initial data loading
- Refetching
- Failed API requests
- Empty search results
- Empty filtered results
- Form submission errors
- Successful mutations
- Failed mutations

Buttons that trigger mutations should be disabled while the corresponding operation is in progress.

---

## Assignment Requirements

The project is based on an Advanced CRM Dashboard task requiring:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- A proper drag-and-drop library
- Customer management
- Advanced filtering
- Search
- Sorting
- Pagination
- Form validation
- Data fetching/caching
- Loading/error states
- Mutation refetching
- Drag-and-drop functionality

The assignment emphasizes **code quality and architecture over fancy UI** and specifically calls for thorough filter testing.

---

