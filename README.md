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

### Search, Sorting & Pagination
- Real-time customer search
- Search by name, email, or company
- Sorting by:
  - Name
  - Email
  - Last contact date
- Pagination
- Page sizes:
  - 10
  - 25
  - 50

### Advanced Filters
- Status filter
  - Active
  - Inactive
- Company multi-select filter
- Last contact date range
- Phone number search
- Email search
- Combine multiple filters
- Clear all filters
- Apply filters
- Active filter count indicator
- Save custom filter combinations
- Pre-built filter templates such as:
  - Active Customers
  - Recent Contacts
  - Inactive Leads

### Data Fetching
- TanStack Query for data fetching and caching
- Query loading and error states
- Mutations for add/edit/delete operations
- Query invalidation/refetching after mutations
- Configurable stale time

### Forms & Validation
- shadcn/ui form components
- Required field validation
- Email validation
- Phone validation
- Inline validation errors
- Success/error toast notifications
- Submit buttons disabled while submitting

### Drag & Drop
- Proper drag-and-drop library
- Reorderable customer/filter items
- Designed for extensible drag-and-drop interactions

### Bonus Features
- Bulk actions
- Export filtered customers as CSV
- Dark/light mode
- Keyboard shortcuts
- Debounced search

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
cd advanced-crm-dashboard
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

## Available Scripts

### Development

```bash
npm run dev
```

Starts the Next.js development server.

### Production Build

```bash
npm run build
```

Creates an optimized production build.

### Start Production Server

```bash
npm run start
```

Runs the production build.

### Lint

```bash
npm run lint
```

Runs ESLint to identify code-quality issues.

---

## Project Structure

```text
advanced-crm-dashboard/
├── public/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── customers/
│   │   │       └── route.ts
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── customers/
│   │   │   ├── customer-details.tsx
│   │   │   ├── customer-empty-state.tsx
│   │   │   ├── customer-filters.tsx
│   │   │   ├── customer-form.tsx
│   │   │   ├── customer-pagination.tsx
│   │   │   ├── customer-row.tsx
│   │   │   └── customer-table.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   └── sidebar.tsx
│   │   │
│   │   └── ui/
│   │
│   ├── data/
│   │   └── customers.ts
│   │
│   ├── hooks/
│   │   ├── use-customer-mutations.ts
│   │   ├── use-customers.ts
│   │   └── use-debounce.ts
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── query-client.ts
│   │   ├── utils.ts
│   │   └── validations.ts
│   │
│   ├── providers/
│   │   └── query-provider.tsx
│   │
│   └── types/
│       ├── customer.ts
│       └── filters.ts
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
├── customers/
└── layout/
```

### Data Layer

Customer data and API operations are kept separate from UI components.

```text
data/
lib/api.ts
app/api/
```

### Query Layer

TanStack Query manages server-state fetching, caching, mutations, and invalidation.

```text
hooks/
providers/
```

### Type Layer

Shared TypeScript models are defined in:

```text
types/
```

### Validation Layer

Form schemas and validation rules are kept separately so that validation logic does not become coupled to individual UI components.

```text
lib/validations.ts
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

## Filtering Strategy

Filtering is designed to support multiple filters simultaneously.

Example filter state:

```ts
interface CustomerFilters {
  search: string;
  statuses: CustomerStatus[];
  companies: string[];
  email: string;
  phone: string;
  dateFrom: string;
  dateTo: string;
}
```

The filtering flow should support:

```text
Search
   ↓
Status
   ↓
Company
   ↓
Date Range
   ↓
Phone
   ↓
Email
   ↓
Filtered Customers
   ↓
Sorting
   ↓
Pagination
```

Search and filters should work together rather than independently.

---

## Responsive Design

The dashboard is designed for:

- Desktop
- Tablet
- Mobile

The desktop interface uses a CRM-style sidebar and content area, while smaller screens should adapt the navigation, table, filters, and dialogs for limited screen width.

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

## Development Guidelines

### Keep Components Focused

Avoid large components that contain:

- API calls
- Filtering logic
- Validation
- Modal state
- Table rendering
- Mutation logic

Instead, move reusable logic into hooks and utility functions.

### Prefer Type Safety

Avoid unnecessary:

```ts
any
```

Use shared interfaces and explicit types.

### Keep Query Keys Consistent

Use predictable query keys:

```ts
["customers"]
```

and extend them when server-side filtering/pagination is introduced:

```ts
["customers", filters, page, pageSize]
```

### Avoid Unnecessary Effects

Do not use `useEffect` simply to derive state from other state.

Prefer:

```ts
const filteredCustomers = useMemo(() => {
  // filtering
}, [customers, filters]);
```

when derived client-side data is required.

---

## Testing Checklist

Before considering the project complete, verify:

### Customers
- [ ] Customers render correctly
- [ ] Customer details open correctly
- [ ] Add customer works
- [ ] Edit customer works
- [ ] Delete customer works
- [ ] Delete confirmation works

### Search
- [ ] Name search works
- [ ] Email search works
- [ ] Company search works
- [ ] Search updates correctly
- [ ] Debouncing works if enabled

### Filters
- [ ] Active status works
- [ ] Inactive status works
- [ ] Company multi-select works
- [ ] Date range works
- [ ] Phone filter works
- [ ] Email filter works
- [ ] Multiple filters work together
- [ ] Clear all works
- [ ] Active filter count is correct
- [ ] Saved filters work
- [ ] Pre-built filters work

### Sorting
- [ ] Name sorting works
- [ ] Email sorting works
- [ ] Last-contact sorting works
- [ ] Ascending/descending states work

### Pagination
- [ ] 10 per page works
- [ ] 25 per page works
- [ ] 50 per page works
- [ ] Page navigation works
- [ ] Pagination resets appropriately after filtering/search

### Data Fetching
- [ ] TanStack Query is used for data operations
- [ ] Loading state works
- [ ] Error state works
- [ ] Cache/stale time is configured
- [ ] Queries update after mutations

### Drag & Drop
- [ ] Drag-and-drop uses a dedicated library
- [ ] Reordering works
- [ ] Order persists correctly
- [ ] Pagination/search/filter interactions do not break ordering

### Forms
- [ ] Required fields validate
- [ ] Email validation works
- [ ] Phone validation works
- [ ] Inline errors display
- [ ] Submit buttons disable during submission
- [ ] Success/error notifications display

### Responsive
- [ ] Desktop layout works
- [ ] Tablet layout works
- [ ] Mobile layout works
- [ ] Modals/drawers fit small screens
- [ ] Table remains usable on mobile

---

## Suggested Commit Convention

Use meaningful commits that describe the change.

Examples:

```text
feat: add customer table
feat: implement advanced customer filters
feat: add customer CRUD operations
feat: add drag and drop customer reordering

fix: reset pagination when filters change
fix: preserve customer order after drag and drop

refactor: extract customer filtering logic
refactor: simplify customer query hooks

chore: set up shadcn ui
chore: configure tanstack query
chore: organize project structure

docs: update project README
```

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

## Future Improvements

Potential improvements after the required functionality is complete:

- Server-side filtering and pagination
- Persistent database storage
- Authentication
- Role-based access control
- Advanced analytics
- Customer activity timeline
- Bulk import
- CSV import/export
- Optimistic updates
- Virtualized customer lists
- Automated tests
- End-to-end testing

---

## License

This project is created for development/assessment purposes.
