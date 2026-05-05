# Frontend Architecture - Property Management System

Production-ready React frontend for the Ghar Bhada property rental platform.

## 📁 Directory Structure

```
frontend_gharbhada/src/
├── services/
│   ├── axiosClient.js          # Axios instance with JWT interceptor
│   ├── userService.js          # User API calls (auth, profile, admin)
│   └── roomService.js          # Room API calls (browse, landlord, admin)
│
├── context/
│   └── AuthContext.jsx         # Global auth state management
│
├── hooks/
│   ├── useRooms.js            # Fetch rooms with filtering & pagination
│   ├── useProfile.js          # Profile management operations
│   ├── useLandlordRooms.js    # Landlord room management
│   ├── useAdmin.js            # Admin user & room moderation
│   └── useHelpers.js          # Utility hooks (useAsync, useToggle, etc)
│
├── components/
│   └── ProtectedRoute.jsx     # Role-based route protection
│
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── ProfilePage.jsx
│   ├── RoomsListPage.jsx
│   ├── RoomDetailPage.jsx
│   ├── LandlordDashboard.jsx
│   └── AdminDashboard.jsx
│
└── App.jsx                     # Main app with routing
```

## 🔐 Authentication Flow

### Token Management

1. **Login/Register**: Returns `access_token` which is stored in `localStorage`
2. **Auto-attachment**: `axiosClient` interceptor automatically adds `Authorization: Bearer {token}` header
3. **Token Expiration**: Server returns 401 → axios interceptor triggers logout event
4. **Persistence**: Token and user data persist across page reloads via localStorage

### Axios Interceptors

**Request Interceptor:**
- Automatically attaches JWT token from localStorage
- Sets appropriate Content-Type headers

**Response Interceptor:**
- Extracts error messages from backend's `detail` field
- Handles 401 Unauthorized (auto logout)
- Returns custom error object with `message`, `status`, and `data`

## 🏗️ Services Layer

### userService.js
All user-related API operations:
- `register(name, email, password, role, avatar)`
- `loginJson(email, password)`
- `getProfile()`
- `updateProfile(updates, avatar)`
- `changePassword(currentPassword, newPassword)`
- `removeAvatar()`
- `listUsers(filters)` - Admin only
- `getUserById(userId)` - Admin only
- `activateUser(userId)` - Admin only
- `deactivateUser(userId)` - Admin only
- `verifyUser(userId)` - Admin only

### roomService.js
All room-related API operations:
- `listRooms(filters)` - Public with pagination
- `getRoomById(roomId)` - Public
- `createRoom(roomData)` - Landlord only
- `getMyListings(pagination)` - Landlord only
- `updateRoom(roomId, updateData)` - Landlord only
- `deleteRoom(roomId)` - Landlord only
- `toggleAvailability(roomId)` - Landlord only
- `getAllRooms(filters)` - Admin only
- `reviewRoom(roomId, newStatus, adminNote)` - Admin only

## 🎣 Custom Hooks

### useRooms(initialFilters, fetchFn)
Fetch and manage room listings with filtering and pagination.
```javascript
const { rooms, loading, error, hasMore, filters, setFilters, loadMore } = useRooms({
  city: 'Kathmandu',
  min_price: 5000,
  limit: 20,
});
```

### useProfile()
Manage user profile operations.
```javascript
const { updateProfile, changePassword, removeAvatar, loading, error, success } = useProfile();
```

### useLandlordRooms()
Manage landlord's room listings.
```javascript
const { rooms, createRoom, updateRoom, deleteRoom, toggleAvailability, fetchMyListings } = useLandlordRooms();
```

### useAdminUsers() & useAdminRooms()
Admin operations for users and room moderation.
```javascript
const { users, fetchUsers, activateUser, deactivateUser, verifyUser } = useAdminUsers();
const { rooms, fetchRooms, reviewRoom } = useAdminRooms();
```

### Utility Hooks (useHelpers.js)
- `useAsync(fn, immediate, deps)` - Generic async state management
- `useToggle(initial)` - Boolean toggle
- `useLocalStorage(key, initial)` - Persistent state
- `useDebounce(value, delay)` - Debounce values
- `usePagination(total, pageSize)` - Pagination logic
- `useFormInput(initial)` - Single input management
- `useFormState(initial)` - Multiple field form management

## 🔐 AuthContext

Global authentication state with role-based access:

```javascript
const { 
  user,                    // Current user object
  token,                   // JWT token
  loading,                 // Initial auth check loading
  isAuthenticated,         // Boolean
  hasRole(roles),         // Check if user has role
  isTenant,               // Shorthand
  isLandlord,             // Shorthand
  isAdmin,                // Shorthand
  login,                  // Function
  register,               // Function
  logout,                 // Function
  updateUser,             // Function to update local user state
} = useAuth();
```

## 🛡️ ProtectedRoute Component

```javascript
<Route
  path="/landlord/dashboard"
  element={
    <ProtectedRoute 
      element={<LandlordDashboard />} 
      requiredRole="LANDLORD"
      redirectTo="/login"
    />
  }
/>
```

Support for multiple roles:
```javascript
<ProtectedRoute 
  element={<ManagePage />} 
  requiredRole={['ADMIN', 'LANDLORD']}
/>
```

## 🌐 API Endpoints Mapping

### User Routes
| Method | Endpoint | Service Function | Role |
|--------|----------|------------------|------|
| POST | /users/register | `register()` | Public |
| POST | /users/login/json | `loginJson()` | Public |
| GET | /users/me | `getProfile()` | Auth |
| PATCH | /users/me | `updateProfile()` | Auth |
| PATCH | /users/me/password | `changePassword()` | Auth |
| DELETE | /users/me/avatar | `removeAvatar()` | Auth |
| GET | /users/ | `listUsers()` | Admin |
| GET | /users/{id} | `getUserById()` | Admin |
| PATCH | /users/{id}/activate | `activateUser()` | Admin |
| PATCH | /users/{id}/deactivate | `deactivateUser()` | Admin |
| PATCH | /users/{id}/verify | `verifyUser()` | Admin |

### Room Routes
| Method | Endpoint | Service Function | Role |
|--------|----------|------------------|------|
| GET | /rooms/ | `listRooms()` | Public |
| POST | /rooms/{id} | `getRoomById()` | Public |
| POST | /rooms/ | `createRoom()` | Landlord |
| GET | /rooms/my/listings | `getMyListings()` | Landlord |
| PATCH | /rooms/update/{id} | `updateRoom()` | Landlord |
| DELETE | /rooms/delete/{id} | `deleteRoom()` | Landlord |
| PATCH | /rooms/toogle-availablity/{id} | `toggleAvailability()` | Landlord |
| GET | /rooms/admin/all | `getAllRooms()` | Admin |
| PATCH | /rooms/admin/{id}/review | `reviewRoom()` | Admin |

## 📋 Error Handling

All services throw custom errors with:
- `error.message` - Human-readable error from backend
- `error.status` - HTTP status code
- `error.data` - Full response data

Hooks catch and manage errors locally, always providing an `error` state variable.

Components display errors to users from the hook's error state.

## 🚀 Usage Examples

### Basic Authentication
```javascript
function LoginPage() {
  const { login, error, loading } = useAuth();
  
  const handleSubmit = async (email, password) => {
    try {
      await login(email, password);
      navigate('/profile');
    } catch (err) {
      console.error(err);
    }
  };
}
```

### Browse Rooms with Filters
```javascript
function RoomsBrowser() {
  const { rooms, filters, setFilters, loading } = useRooms();
  
  return (
    <div>
      <input 
        onChange={(e) => setFilters({ city: e.target.value })}
        placeholder="Search by city"
      />
      {rooms.map(room => <RoomCard key={room._id} room={room} />)}
    </div>
  );
}
```

### Landlord Create Room
```javascript
function CreateRoom() {
  const { createRoom, loading, error } = useLandlordRooms();
  
  const handleSubmit = async (roomData) => {
    try {
      await createRoom(roomData);
      navigate('/landlord/dashboard');
    } catch (err) {
      console.error(err);
    }
  };
}
```

### Admin User Management
```javascript
function AdminUsers() {
  const { users, activateUser, deactivateUser, verifyUser } = useAdminUsers();
  
  // User management operations...
}
```

## 📦 Required Dependencies

```json
{
  "axios": "^1.x",
  "react": "^18.x",
  "react-router-dom": "^6.x"
}
```

## 🔍 Best Practices

1. **Always use services** - Never call axios directly
2. **Use hooks for state** - Consolidates logic and reusability
3. **Leverage AuthContext** - For global user state
4. **Handle errors properly** - Extract and display error messages
5. **Use ProtectedRoute** - For access control
6. **Debounce search** - Use `useDebounce` for search inputs
7. **TypeScript ready** - Add types for production (optional)
8. **Environment variables** - Use `REACT_APP_API_URL` for backend URL

## 🔄 Data Flow

```
Component
   ↓
Hook (useRooms, useProfile, etc.)
   ↓
Service (userService, roomService)
   ↓
Axios Client (with JWT interceptor)
   ↓
Backend API
```

Errors flow back up with helpful messages for user display.

## 📝 Component Setup Template

```javascript
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRooms } from '../hooks/useRooms';

export default function MyComponent() {
  const { user, isAuthenticated } = useAuth();
  const { rooms, loading, error, filters, setFilters } = useRooms();

  useEffect(() => {
    // Component initialization if needed
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

## 🎯 Next Steps

1. Create pages using provided hooks and services
2. Style components with Tailwind CSS
3. Add form validation (consider React Hook Form)
4. Add loading skeletons for better UX
5. Implement image upload preview
6. Add pagination UI components
7. Create filter/search components
8. Add success/error toast notifications

---

For detailed usage examples, see [ARCHITECTURE.js](./ARCHITECTURE.js)
