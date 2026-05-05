# GharBhada Frontend Pages - Quick Start Guide

## 🚀 Quick Navigation

### Import New Pages
```jsx
// App.jsx
import RoomListingPage from './pages/RoomListingPage';
import LandlordDashboard from './pages/LandlordDashboard';
import CreateRoomForm from './pages/CreateRoomForm';
import ProfilePage from './pages/Profile';
```

---

## 📄 Page 1: RoomListingPage.jsx

### Purpose
Browse and search for available rooms with advanced filtering capabilities.

### Location
`src/pages/RoomListingPage.jsx`

### Key Features
✨ **Two-Column Layout**
- Left: Collapsible filter sidebar
- Right: Responsive room grid (1-2-3 columns)

✨ **Advanced Filters**
- City search (with debounce)
- District search
- Room type dropdown
- Price range slider (dual handle)
- Clear filters button

✨ **Room Cards**
- Room image with gradient fallback
- Availability badge (Available/Occupied)
- Room type badge
- Location (city, district)
- Monthly price
- Quick "View Details" button

✨ **UX Polish**
- Shimmer loading cards while fetching
- Empty state with "Clear Filters" CTA
- Mobile-responsive sidebar (drawer on mobile)
- "Load More" pagination button

### Usage Example
```jsx
// In App.jsx
<Route path="/browse" element={<RoomListingPage />} />

// Or just include it directly
import RoomListingPage from './pages/RoomListingPage';
export default function App() {
  return <RoomListingPage />;
}
```

### Component Props & State
```jsx
// Hooks used internally
const {
  rooms,
  loading,
  error,
  filters,
  setFilters,
  hasMore,
  loadMore,
} = useRooms({ skip: 0, limit: 12 });

// Subcomponents
<RoomCard room={room} onViewDetails={handleViewDetails} />
<FilterSidebar filters={filters} onFilterChange={setFilters} loading={loading} />
```

### Styling
- Primary color: Green (#059669)
- Cards with hover shadows
- Responsive grid using Tailwind
- Sticky header
- Mobile-first design

---

## 📊 Page 2: LandlordDashboard.jsx

### Purpose
Manage room listings with overview metrics and quick actions.

### Location
`src/pages/LandlordDashboard.jsx`

### Key Features
✨ **Metrics Overview**
- Total Listings (with icon)
- Pending Approval (with icon)
- Available Rooms (with icon)
- Occupied Rooms (with icon)
- Color-coded cards (green/blue/amber/red)

✨ **Room Management**
- Desktop: Clean data table with sorting
- Mobile: Card-based list view
- Quick toggle availability switch
- Edit & Delete action buttons
- Delete confirmation modal

✨ **Navigation**
- Sticky header with "Add New Room" button (desktop)
- Mobile floating "+ Add New Room" button
- Redirects to CreateRoomForm on click

✨ **Empty States**
- "No listings yet" when room list is empty
- Helpful "Create First Listing" CTA

### Usage Example
```jsx
// In App.jsx
<Route path="/landlord-dashboard" element={
  <ProtectedRoute requiredRole="LANDLORD">
    <LandlordDashboard />
  </ProtectedRoute>
} />
```

### Component Props & State
```jsx
// Hooks used internally
const {
  rooms,
  loading,
  stats,           // {total_rooms, pending_rooms, available_rooms, occupied_rooms}
  updateRoomStatus,
  deleteRoom,
} = useLandlordRooms();

// Subcomponents
<MetricCard title="Total Listings" value={5} icon="📊" color="green" />
<RoomListTable rooms={rooms} onEdit={} onDelete={} onToggleAvailability={} />
<RoomActionModal isOpen={} room={} action="Delete" onConfirm={} onCancel={} />
```

### Available Actions
- **Edit**: Navigate to `/rooms/{id}/edit`
- **Delete**: Show confirmation → call `deleteRoom()`
- **Toggle Availability**: Call `updateRoomStatus()` with `is_available` flag
- **Add New**: Navigate to `/rooms/create`

---

## 🆕 Page 3: CreateRoomForm.jsx

### Purpose
Create a new room listing with multi-step form and validation.

### Location
`src/pages/CreateRoomForm.jsx`

### Key Features
✨ **3-Step Wizard**
```
Step 1: General Info (title, description, room_type, amenities)
         ↓ [Validate]
Step 2: Location Details (city, district, exact_location)
         ↓ [Validate]
Step 3: Photos & Pricing (image upload, monthly price)
         ↓ [Submit]
Success: Redirect to /landlord-dashboard
```

✨ **Progress Stepper**
- Visual step indicators at top
- Completed steps marked in green
- Current step highlighted with ring
- Step labels below

✨ **Step 1: General Information**
- Room Title input (required)
- Description textarea (required, 5 rows)
- Room Type dropdown (single/double/flat/house)
- Amenities checklist (10 options including WiFi, AC, Kitchen, Parking, etc.)

✨ **Step 2: Location Details**
- City input (required)
- District input (required)
- Exact Location textarea (required, describe area/landmarks)
- Info alert: "Providing clear area description helps tenants find you"

✨ **Step 3: Photos & Pricing**
- Drag-and-drop upload zone (up to 5 images)
- File preview grid with thumbnail
- Remove individual images
- Primary image indicator
- Monthly price input (required, numeric)
- Price summary alert showing formatted price

✨ **Validation**
- Each step validates before proceeding
- Shows error messages inline
- Cannot skip steps
- Final submit validates all fields

### Usage Example
```jsx
// In App.jsx
<Route path="/rooms/create" element={
  <ProtectedRoute requiredRole="LANDLORD">
    <CreateRoomForm />
  </ProtectedRoute>
} />
```

### Form Data Structure
```jsx
{
  title: string,
  description: string,
  room_type: 'single'|'double'|'flat'|'house',
  amenities: string[],      // ['WiFi', 'AC', ...]
  city: string,
  district: string,
  exact_location: string,
  price: number,
  images: File[],           // Max 5 files
}
```

### API Integration
```jsx
// On submit (Step 3):
const formDataWithFiles = new FormData();
formDataWithFiles.append('title', formData.title);
// ... other fields
formData.images.forEach(img => formDataWithFiles.append('images', img.file));

await roomService.createRoom(formDataWithFiles);
// Success: Redirect to /landlord-dashboard
```

---

## 👤 Page 4: ProfilePage.jsx

### Purpose
Manage user profile information, avatar, and account security.

### Location
`src/pages/Profile.jsx` (updated)

### Key Features
✨ **Avatar Upload (Left Sidebar)**
- Circular avatar with initials fallback
- Upload prompt on hover
- File input with image preview
- Supports drag-drop upload
- Loading spinner during upload

✨ **Personal Information Tab**
- Display mode: Read-only text
- Edit mode: Editable input fields
- Edit Profile button to toggle mode
- Fields: Full Name, Email (read-only), Contact Number
- Save/Cancel buttons in edit mode

✨ **Account Security Tab**
- Password change section
- Toggle interface for change password form
- Fields: Current Password, New Password, Confirm Password
- Validation: Minimum 8 chars, passwords must match
- Success alerts after password change

✨ **Responsive Layout**
- Desktop: 3-column (1 for avatar, 2 for tabs)
- Mobile: Stacked layout
- Sticky left column on desktop

### Usage Example
```jsx
// In App.jsx
<Route path="/profile" element={
  <ProtectedRoute requiredRole={['TENANT', 'LANDLORD', 'ADMIN']}>
    <ProfilePage />
  </ProtectedRoute>
} />
```

### Hooks Used
```jsx
const {
  profile,         // {name, email, contact_number, avatar}
  loading,
  error,
  updateProfile,   // ({name, contact_number}) => Promise
  changePassword,  // (oldPassword, newPassword) => Promise
  uploadAvatar,    // (file) => Promise
} = useProfile();
```

### Tab Structure
```jsx
Tabs:
├─ Personal Info
│  ├─ Display Mode (read-only)
│  │  ├─ Full Name
│  │  ├─ Email (verified ✓)
│  │  └─ Contact Number
│  │     └─ [Edit Profile] button
│  └─ Edit Mode
│     ├─ Name Input
│     ├─ Email Input (disabled)
│     ├─ Contact Number Input
│     └─ [Cancel] [Save Changes]

└─ Account Security
   ├─ Password info section
   ├─ [Change Password] button
   └─ When expanded:
      ├─ Current Password Input
      ├─ New Password Input
      ├─ Confirm Password Input
      └─ [Cancel] [Update Password]
```

---

## 🎨 UI Component Usage in Pages

### RoomListingPage
```jsx
<Button variant="primary|secondary|outline" fullWidth onClick={} />
<Input label="City" placeholder="..." value={} onChange={} />
<Select label="Room Type" options={[]} value={} onChange={} />
<RangeSlider label="Price" min={0} max={1000000} value={[min, max]} onChange={} />
<Card clickable onClick={}>Content</Card>
<Badge variant="success|warning">Available</Badge>
<Skeleton height="h-48" />
<EmptyState icon="🔍" title="No rooms" description="..." action={<Button>Clear</Button>} />
```

### LandlordDashboard
```jsx
<Modal isOpen={} onClose={} title="Delete?">
  <Alert type="warning">Are you sure?</Alert>
  <Button variant="danger">Confirm</Button>
</Modal>
<Spinner size="md" />
<Alert type="error|success|info">Message</Alert>
```

### CreateRoomForm
```jsx
<TextArea label="Description" value={} onChange={} rows={5} />
<Divider />
// Drag-drop zone with file input
// Image preview grid
```

### ProfilePage
```jsx
<Tabs activeTab={} onTabChange={} tabs={[{id, label, content}]} />
<Avatar image={} fallback="JD" onClick={} />
<Toggle isEnabled={} onChange={} />
<Input type="password" label="Password" />
```

---

## 🔄 Data Flow Examples

### Flow: Browse → View Details → Login (if needed)
```
1. User visits /browse
2. RoomListingPage loads with useRooms hook
3. Rooms render as RoomCard components
4. User clicks "View Details" on a card
5. Navigate to /rooms/{id}
6. If not logged in, redirect to /login
```

### Flow: Create Room
```
1. Logged-in LANDLORD navigates to /landlord-dashboard
2. Clicks "+ Add New Room"
3. Redirect to /rooms/create
4. Fill CreateRoomForm (3 steps)
5. Submit on Step 3
6. FormData sent to roomService.createRoom()
7. On success, redirect back to /landlord-dashboard
8. Dashboard shows new room in list
```

### Flow: Update Profile
```
1. User at /profile
2. ProfilePage loads with useProfile hook
3. Shows current profile in display mode
4. User clicks "Edit Profile"
5. Fields become editable
6. User modifies and clicks "Save Changes"
7. updateProfile() called
8. Success alert shown
9. Auto-refresh profile data
```

---

## 📱 Responsive Breakpoints

All pages are fully responsive:

```
Mobile (< 640px):
- Single column layouts
- Drawer sidebar for filters
- Card-based lists instead of tables
- Stacked buttons

Tablet (640px - 1024px):
- 2-column grids
- Hybrid layouts
- Expanded sidebars

Desktop (> 1024px):
- 3+ column grids
- Full-width tables
- Sticky navigation
- Hover effects
```

---

## 🧪 Testing the Pages

### Test RoomListingPage
1. Visit `/browse`
2. Type in city filter → should debounce search
3. Use price slider → update results
4. Scroll down → "Load More" button appears
5. Click room card → navigate to details

### Test LandlordDashboard
1. Login as LANDLORD
2. Visit `/landlord-dashboard`
3. See metrics cards
4. Click "Toggle Availability" → should update instantly
5. Click "Delete" → modal appears
6. Click "+ Add New Room" → go to CreateRoomForm

### Test CreateRoomForm
1. Visit `/rooms/create`
2. Fill Step 1, click "Next"
3. Fill Step 2, click "Next"
4. Upload images (drag-drop), enter price
5. Click "Publish Listing"
6. Should redirect to dashboard on success

### Test ProfilePage
1. Visit `/profile`
2. See current profile info
3. Click "Edit Profile" → fields become editable
4. Change name → click "Save"
5. Click "Security" tab
6. Click "Change Password"
7. Enter passwords → verify validation

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Images not loading in CreateRoomForm | Check FormData construction, ensure files are appended correctly |
| Filters not updating | Verify useDebounce dependencies in effect hook |
| Modal won't close | Check isOpen state is properly toggled in onCancel |
| 404 on route | Register route in App.jsx with correct path |
| Avatar not uploading | Check file type validation and useProfile uploadAvatar hook |
| Availability toggle stuck | Check updateRoomStatus promise handling |

---

## 📚 Related Documentation

- **INTEGRATION_GUIDE.md** - Complete architecture & data flow
- **README_ARCHITECTURE.md** - Setup & configuration
- **ARCHITECTURE.md** - Code patterns & examples

---

## ✅ Production Checklist

Before deploying:

- [ ] All 4 pages tested on mobile/tablet/desktop
- [ ] Images optimize sizes before upload
- [ ] Error handling for all API calls
- [ ] Loading states shown during async operations
- [ ] Empty states for all data lists
- [ ] Form validation messages user-friendly
- [ ] Success/error toasts for all actions
- [ ] Accessibility: ARIA labels, keyboard navigation
- [ ] Performance: Image lazy loading, pagination
- [ ] Security: JWT tokens in headers, HTTPS only

Ready to ship! 🚀
