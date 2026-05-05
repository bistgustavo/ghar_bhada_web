# GharBhada Frontend - Complete Integration Guide

This guide shows how all components, pages, services, and hooks work together in the production-grade React frontend.

## 📁 Project Structure

```
frontend_gharbhada/src/
├── pages/
│   ├── Login.jsx                    # Authentication page
│   ├── Register.jsx                 # User registration
│   ├── RoomListingPage.jsx          # (✨ NEW) Browse & filter rooms
│   ├── LandlordDashboard.jsx        # (✨ NEW) Landlord management dashboard
│   ├── CreateRoomForm.jsx           # (✨ NEW) Multi-step room creation wizard
│   ├── Profile.jsx                  # (✨ NEW) User profile with avatar & settings
│   ├── Admin.jsx                    # Admin moderation dashboard
│   └── RoomDetail.jsx               # Single room details (future)
│
├── components/
│   ├── UI/
│   │   └── index.jsx                # (✨ NEW) 16 reusable UI primitives
│   ├── ProtectedRoute.jsx           # Role-based route access control
│   └── Navigation.jsx               # (future) Header/navbar component
│
├── context/
│   └── AuthContext.jsx              # Global authentication state + role checking
│
├── hooks/
│   ├── useRooms.js                  # Browse rooms with filters/pagination
│   ├── useProfile.js                # Profile operations (CRUD settings)
│   ├── useLandlordRooms.js          # Landlord's room management
│   ├── useAdmin.js                  # Admin user/room operations
│   └── useHelpers.js                # 7 utility hooks
│
├── services/
│   ├── axiosClient.js               # HTTP client with JWT interceptor
│   ├── userService.js               # User API functions (auth, profile, admin)
│   └── roomService.js               # Room API functions (browse, CRUD, admin)
│
├── main.jsx
├── App.jsx                          # Main router setup
└── api.js                           # (deprecated) Old API structure → Use services instead
```

---

## 🔄 Data Flow Architecture

### Authentication Flow
```
Login Page
    ↓
userService.login() → JWT token received
    ↓
AuthContext stores token + user data
    ↓
axiosClient intercepts all requests, adds Bearer token
    ↓
On 401: CustomEvent triggers logout, redirect to /login
```

### Room Listing Flow
```
RoomListingPage
    ↓
useRooms hook (filters, pagination)
    ↓
roomService.getAllRooms(filters)
    ↓
axiosClient.get() with JWT interceptor
    ↓
Renders RoomCard components from UI library
    ↓
On click: Navigate to /rooms/{id}
```

### Landlord Dashboard Flow
```
LandlordDashboard
    ↓
useLandlordRooms hook (fetches landlord's rooms)
    ↓
roomService.myListings()
    ↓
Displays MetricCard (stats) + RoomListTable
    ↓
Actions: Edit → /rooms/{id}/edit | Delete → Modal confirmation
    ↓
Toggle Availability → roomService.updateRoom()
```

### Create Room Flow
```
CreateRoomForm (3-step wizard)
    ↓
Step 1: General Info (title, description, room_type, amenities)
    ↓
Step 2: Location (city, district, exact_location)
    ↓
Step 3: Photos & Pricing (images upload, price)
    ↓
All steps have validation on submit
    ↓
Final submit: FormData → roomService.createRoom()
    ↓
On success: Redirect to /landlord-dashboard
```

### Profile Page Flow
```
ProfilePage
    ↓
useProfile hook (fetches profile data)
    ↓
Left panel: Avatar upload → uploadAvatar()
    ↓
Right panel: Tabbed interface
    ├─ Personal Info Tab: Edit mode toggle
    │   └─ updateProfile() on save
    └─ Account Security Tab: Change password
        └─ changePassword() on submit
```

---

## 🎨 UI Component Library Usage

### Available Components (All in `components/UI/index.jsx`)

#### Buttons
```jsx
import { Button } from '../UI';

// Variants: primary, secondary, danger, ghost, outline
<Button variant="primary" size="lg" fullWidth loading={false} disabled={false}>
  Click Me
</Button>
```

#### Form Inputs
```jsx
<Input label="Name" placeholder="John" value={name} onChange={handleChange} error="Required" />
<Select label="Type" options={[...]} value={type} onChange={handleChange} />
<TextArea label="Description" value={desc} onChange={handleChange} rows={5} />
<RangeSlider label="Price Range" min={0} max={1000000} value={[min, max]} onChange={handleChange} />
```

#### Feedback Components
```jsx
<Alert type="success|warning|error|info">Message text</Alert>
<Spinner size="sm|md|lg" />
<Badge variant="default|success|warning|danger|info">Label</Badge>
```

#### Layout Components
```jsx
<Card className="custom" clickable onClick={handler}>Content</Card>
<Modal isOpen={true} onClose={handler} title="Title" size="md">Content</Modal>
<Tabs activeTab="tab1" onTabChange={setTab} tabs={[{id: 'tab1', label: 'Tab 1', content: <div />}]} />
```

#### Data Display
```jsx
<EmptyState icon="🏠" title="No items" description="Try adding one" action={<Button>Add</Button>} />
<Skeleton height="h-10" width="w-20" />
<Divider />
<Breadcrumbs items={['Home', 'Rooms', 'Details']} />
```

---

## 🪝 Hooks Deep Dive

### useRooms: Browse Rooms with Filters
```jsx
const {
  rooms,           // Array of room objects
  loading,         // Boolean loading state
  error,           // Error message or null
  filters,         // Current filter object {city, district, room_type, min_price, max_price}
  setFilters,      // Update filters → triggers new fetch
  hasMore,         // Boolean: more results available
  loadMore,        // Function: fetch next page
} = useRooms({ skip: 0, limit: 12 });

// Usage in component
setFilters({ ...filters, city: 'Kathmandu' });
```

### useLandlordRooms: Landlord Dashboard
```jsx
const {
  rooms,           // Landlord's rooms
  loading,         // Loading state
  stats,           // {total_rooms, pending_rooms, available_rooms, occupied_rooms}
  updateRoomStatus,// (roomId, {is_available, ...}) → updates room
  deleteRoom,      // (roomId) → deletes room
} = useLandlordRooms();
```

### useProfile: User Settings
```jsx
const {
  profile,         // {name, email, contact_number, avatar}
  loading,         // Loading state
  error,           // Error message
  updateProfile,   // ({name, contact_number, ...}) → updates profile
  changePassword,  // (oldPassword, newPassword) → changes password
  uploadAvatar,    // (file) → uploads avatar
} = useProfile();
```

### useAdmin: Admin Operations
```jsx
const {
  users,           // All users
  rooms,           // All rooms
  loading,         // Loading state
  getUserStats,    // () → returns statistics
  updateUserRole,  // (userId, role) → admin/tenant/landlord
  blockUser,       // (userId) → blocks user
  approveRoom,     // (roomId) → approves room
  rejectRoom,      // (roomId, reason) → rejects room
} = useAdmin();
```

### useHelpers: Utility Functions
```jsx
// useAsync: Handle async operations
const { loading, data, error } = useAsync(() => fetch('/api/data'), dependencies);

// useToggle: Boolean state toggle
const [isOpen, toggleOpen, setIsOpen] = useToggle(false);

// useLocalStorage: Persistent state
const [theme, setTheme] = useLocalStorage('theme', 'light');

// useDebounce: Debounce values
const debouncedSearch = useDebounce(searchQuery, 300);

// usePagination: Handle pagination
const { page, totalPages, goToPage, next, prev } = usePagination(totalItems, itemsPerPage);

// useFormInput: Form input state
const [input, setInput, resetInput] = useFormInput('');

// useFormState: Multiple form fields
const [form, setFormField, resetForm] = useFormState({name: '', email: ''});
```

---

## 🔐 Authentication & Authorization

### Global Auth Context (AuthContext.jsx)
```jsx
import { useAuth } from '../context/AuthContext';

const { user, token, role, login, logout, isLoggedIn, hasRole } = useAuth();

// Check if user has specific role
if (hasRole('LANDLORD')) {
  // Show landlord features
}

// Login flow
const handleLogin = async (email, password) => {
  const success = await login(email, password);
  if (success) navigate('/dashboard');
};
```

### Protected Routes
```jsx
import ProtectedRoute from '../components/ProtectedRoute';

<Routes>
  <Route path="/profile" element={<ProtectedRoute requiredRole="TENANT"><Profile /></ProtectedRoute>} />
  <Route path="/landlord-dashboard" element={<ProtectedRoute requiredRole="LANDLORD"><LandlordDashboard /></ProtectedRoute>} />
  <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><Admin /></ProtectedRoute>} />
</Routes>
```

---

## 🛠️ Service Layer (API Integration)

### All API endpoints are implemented in services:

#### userService.js
- `register(email, password, name)` - Create account
- `login(email, password)` - Get JWT token
- `getProfile()` - Fetch current user profile
- `updateProfile(data)` - Update name/contact
- `changePassword(oldPassword, newPassword)` - Change password
- `uploadAvatar(file)` - Upload profile picture
- `getAllUsers(filters)` - Admin: List all users
- `blockUser(userId)` - Admin: Block user
- `unblockUser(userId)` - Admin: Unblock user
- `promoteUser(userId, role)` - Admin: Change user role

#### roomService.js
- `getAllRooms(filters)` - Browse public rooms (supports filters & pagination)
- `getRoomById(roomId)` - Get room details
- `createRoom(formData)` - Create new room (multipart: images + data)
- `updateRoom(roomId, data)` - Update room info
- `deleteRoom(roomId)` - Delete room
- `myListings()` - Get landlord's rooms
- `toggleAvailability(roomId, isAvailable)` - Toggle availability
- `approveRoom(roomId)` - Admin: Approve pending room
- `rejectRoom(roomId, reason)` - Admin: Reject room

---

## 📱 Responsive Design

All components are mobile-first using Tailwind CSS breakpoints:
- **Mobile**: Default styles (≤ 640px)
- **Tablet**: `md:` prefix (≥ 768px)
- **Desktop**: `lg:` prefix (≥ 1024px)

Example:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 1 col mobile, 2 cols tablet, 3 cols desktop */}
</div>
```

---

## 🎯 New Pages Quick Reference

### 1. RoomListingPage
- **Path**: `/rooms` or `/browse`
- **Role**: TENANT (public)
- **Features**: 
  - Two-column layout (filter sidebar + room grid)
  - Advanced filters (city, district, room type, price range)
  - Shimmer loading + empty states
  - Responsive grid (1-2-3 columns)
  - Load more pagination

### 2. LandlordDashboard
- **Path**: `/landlord-dashboard`
- **Role**: LANDLORD
- **Features**:
  - Overview metrics (total, pending, available, occupied)
  - Responsive table/card list of rooms
  - Toggle availability with instant feedback
  - Edit/Delete actions
  - "+ Add New Room" CTA (redirects to CreateRoomForm)

### 3. CreateRoomForm
- **Path**: `/rooms/create`
- **Role**: LANDLORD
- **Features**:
  - 3-step wizard with progress stepper
  - Step 1: General info (title, description, type, amenities)
  - Step 2: Location (city, district, details)
  - Step 3: Photos (drag-drop upload) & pricing
  - Instant validation on each step
  - File preview + thumbnail display
  - FormData multipart upload

### 4. ProfilePage
- **Path**: `/profile`
- **Role**: TENANT/LANDLORD
- **Features**:
  - Left sidebar: Avatar with upload
  - Right panel: Tabbed interface
    - Tab 1: Personal Info (edit mode toggle)
    - Tab 2: Account Security (change password)
  - Loading spinners for async operations
  - Success/error alerts

---

## 🚀 Routing Setup (App.jsx)

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import RoomListingPage from './pages/RoomListingPage';
import LandlordDashboard from './pages/LandlordDashboard';
import CreateRoomForm from './pages/CreateRoomForm';
import ProfilePage from './pages/Profile';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/browse" element={<RoomListingPage />} />

          {/* Protected Routes */}
          <Route path="/profile" element={
            <ProtectedRoute requiredRole={['TENANT', 'LANDLORD', 'ADMIN']}>
              <ProfilePage />
            </ProtectedRoute>
          } />

          <Route path="/landlord-dashboard" element={
            <ProtectedRoute requiredRole="LANDLORD">
              <LandlordDashboard />
            </ProtectedRoute>
          } />

          <Route path="/rooms/create" element={
            <ProtectedRoute requiredRole="LANDLORD">
              <CreateRoomForm />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute requiredRole="ADMIN">
              <Admin />
            </ProtectedRoute>
          } />

          {/* Redirect */}
          <Route path="/" element={<Navigate to="/browse" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

---

## 🧪 Example Component Integration

### Complete Example: Filtering Rooms
```jsx
import { useState, useEffect } from 'react';
import { useRooms } from '../hooks/useRooms';
import { useDebounce } from '../hooks/useHelpers';
import { Input, Select, Button } from '../UI';

export function RoomFilter() {
  const { filters, setFilters, rooms, loading } = useRooms();
  const [searchCity, setSearchCity] = useState('');
  const debouncedCity = useDebounce(searchCity, 300);

  useEffect(() => {
    setFilters({ ...filters, city: debouncedCity });
  }, [debouncedCity]);

  return (
    <>
      <Input
        placeholder="Search city..."
        value={searchCity}
        onChange={(e) => setSearchCity(e.target.value)}
      />
      <p>{rooms.length} rooms found</p>
    </>
  );
}
```

---

## 📊 Common Patterns

### Loading States
```jsx
if (loading) return <Spinner size="lg" />;
if (error) return <Alert type="error">{error}</Alert>;
if (data.length === 0) return <EmptyState icon="📦" title="No data" />;
```

### Form Submission with Validation
```jsx
const [errors, setErrors] = useState({});

const validate = () => {
  const newErrors = {};
  if (!form.name) newErrors.name = 'Required';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async () => {
  if (!validate()) return;
  // Submit...
};
```

### Async Data Fetching
```jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  (async () => {
    setLoading(true);
    try {
      const result = await fetchData();
      setData(result);
    } finally {
      setLoading(false);
    }
  })();
}, []);
```

---

## 🔗 Connecting Pages Together

### Navigation Flow
```
/ → /browse (RoomListingPage)
    ↓ (tenant logs in)
    → /profile (ProfilePage)
    ↓ (if LANDLORD role)
    → /landlord-dashboard (LandlordDashboard)
       ↓
       → /rooms/create (CreateRoomForm)
```

### Button Navigation
```jsx
// In RoomListingPage
<Button onClick={() => navigate('/rooms/create')}>Create Listing</Button>

// In LandlordDashboard
<Button onClick={() => navigate('/profile')}>My Profile</Button>

// In CreateRoomForm
<Button onClick={() => navigate('/landlord-dashboard')}>Back to Dashboard</Button>
```

---

## ✅ Implementation Checklist

- [x] **UI Component Library** - 16 reusable primitives with Tailwind CSS
- [x] **RoomListingPage** - Browse with advanced filters, responsive grid
- [x] **LandlordDashboard** - Manage listings with metrics overview
- [x] **CreateRoomForm** - 3-step wizard with validation
- [x] **ProfilePage** - Avatar upload, tabbed interface for settings
- [x] **Service Layer** - All API endpoints mapped
- [x] **Hooks** - All data fetching & state management
- [x] **Auth Context** - Global authentication & role checking
- [x] **Protected Routes** - Role-based access control
- [ ] **Navigation Header** - Sticky navbar with menu
- [ ] **Mobile Navigation** - Hamburger menu for mobile
- [ ] **Room Detail Page** - Single room view with booking
- [ ] **Landing Page** - Hero section with CTA

---

## 📞 Support & Debugging

### Common Issues

1. **404 on '/browse'**: Make sure route is registered in `App.jsx`
2. **Images not uploading**: Check `CreateRoomForm` FormData construction
3. **Filters not working**: Verify `useDebounce` dependencies in `RoomListingPage`
4. **Modal not closing**: Check `Modal.isOpen` state properly toggled
5. **Auth failing**: Verify `axiosClient` interceptor is active

### Debug Mode
```jsx
// In any component
const { user } = useAuth();
console.log('Current user:', user);
console.log('Is LANDLORD:', hasRole('LANDLORD'));
```

---

## 🎉 You're All Set!

Your frontend now has:
- ✨ Production-grade UI components
- 🎨 Beautiful, responsive design with Tailwind CSS
- 🔐 Secure authentication & authorization
- 🪝 Comprehensive hooks for all data needs
- 📱 Mobile-first responsive layouts
- 🚀 Ready for deployment

Start the dev server and navigate to http://localhost:5173 to see it in action!
