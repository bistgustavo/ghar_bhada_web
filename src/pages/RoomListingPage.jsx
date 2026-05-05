import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRooms } from '../hooks/useRooms';
import { useDebounce } from '../hooks/useHelpers';
import { Button, Card, Badge, Skeleton, EmptyState, RangeSlider, Select } from '../components/UI';

// ── ROOM CARD ───────────────────────────────────────────────────────────────
const RoomCard = ({ room, onClick }) => {
  const [imgErr, setImgErr] = useState(false);
  const typeLabels = { single: 'Single', double: 'Double', flat: 'Flat', house: 'House' };

  return (
    <Card clickable noPadding onClick={() => onClick(room.id)} className="overflow-hidden group">
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        {!imgErr && room.images?.[0] ? (
          <img src={room.images[0]} alt={room.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={() => setImgErr(true)} loading="lazy" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
            <span className="text-4xl mb-1">🏠</span>
            <span className="text-xs">No Image</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant="primary" size="sm">{typeLabels[room.room_type] || room.room_type}</Badge>
        </div>
        {room.is_available === false && (
          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
            <Badge variant="danger" size="lg">Occupied</Badge>
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-slate-900 line-clamp-1">{room.title}</h3>
        <p className="text-sm text-slate-500 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
          {room.city}, {room.district}
        </p>
        <div className="flex items-baseline justify-between pt-1">
          <p className="text-xl font-extrabold text-primary-600">
            Rs. {room.price_per_month?.toLocaleString()}
            <span className="text-xs font-normal text-slate-400 ml-1">/mo</span>
          </p>
          <span className="text-xs font-medium text-primary-600 group-hover:underline">View →</span>
        </div>
      </div>
    </Card>
  );
};

// ── SKELETON CARD ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <Card noPadding className="overflow-hidden">
    <Skeleton height="h-48" className="rounded-none" />
    <div className="p-4 space-y-3">
      <Skeleton height="h-5" width="w-3/4" />
      <Skeleton height="h-4" width="w-1/2" />
      <Skeleton height="h-6" width="w-2/5" />
    </div>
  </Card>
);

// ── FILTER PANEL ─────────────────────────────────────────────────────────────
const FilterPanel = ({ filters, onFilterChange, loading }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const roomTypes = [
    { value: 'single', label: 'Single Room' },
    { value: 'double', label: 'Double Room' },
    { value: 'flat', label: 'Flat / Apartment' },
    { value: 'house', label: 'House' },
  ];

  const handleClear = () => {
    onFilterChange({ city: '', district: '', room_type: '', min_price: undefined, max_price: undefined });
  };

  const content = (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Filters</h3>
        <button onClick={handleClear} className="text-xs text-primary-600 hover:underline font-medium">Clear all</button>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
        <input placeholder="e.g. Kathmandu" value={filters.city || ''} onChange={(e) => onFilterChange({ ...filters, city: e.target.value })} disabled={loading} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">District</label>
        <input placeholder="e.g. Kathmandu" value={filters.district || ''} onChange={(e) => onFilterChange({ ...filters, district: e.target.value })} disabled={loading} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all" />
      </div>
      <Select label="Room Type" value={filters.room_type || ''} onChange={(e) => onFilterChange({ ...filters, room_type: e.target.value })} options={roomTypes} disabled={loading} />
      <RangeSlider label="Price Range (Rs.)" min={0} max={100000} value={[filters.min_price || 0, filters.max_price || 100000]} onChange={(v) => onFilterChange({ ...filters, min_price: v[0] || undefined, max_price: v[1] >= 100000 ? undefined : v[1] })} step={1000} disabled={loading} />
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <Button variant="outline" fullWidth onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? '✕ Close Filters' : '⚙️ Filters'}
        </Button>
      </div>
      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 p-6 overflow-y-auto shadow-2xl animate-slide-in-right lg:hidden">
            {content}
            <div className="mt-6">
              <Button variant="primary" fullWidth onClick={() => setMobileOpen(false)}>Apply Filters</Button>
            </div>
          </div>
        </>
      )}
      {/* Desktop sticky sidebar */}
      <div className="hidden lg:block">
        <Card className="sticky top-24">{content}</Card>
      </div>
    </>
  );
};

// ── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function RoomListingPage() {
  const { rooms, loading, error, filters, setFilters, hasMore, loadMore, total } = useRooms({ skip: 0, limit: 12 });
  const navigate = useNavigate();

  const [localFilters, setLocalFilters] = useState(filters);
  const debouncedCity = useDebounce(localFilters.city, 400);
  const debouncedDistrict = useDebounce(localFilters.district, 400);

  useEffect(() => {
    setFilters({ city: debouncedCity || undefined, district: debouncedDistrict || undefined });
  }, [debouncedCity, debouncedDistrict]);

  const handleFilterChange = (newFilters) => {
    setLocalFilters(newFilters);
    const { city, district, ...immediate } = newFilters;
    // Only apply non-text filters immediately
    if (Object.keys(immediate).length > 0) {
      setFilters(immediate);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900">Find Your Perfect Home</h1>
          <p className="text-slate-500 mt-1 text-sm">
            {loading ? 'Searching...' : `${total} room${total !== 1 ? 's' : ''} available`}
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel filters={localFilters} onFilterChange={handleFilterChange} loading={loading} />
          </div>

          {/* Grid */}
          <div className="lg:col-span-3">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
            )}

            {/* Loading skeleton */}
            {loading && rooms.length === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 stagger-children">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* Empty state */}
            {!loading && rooms.length === 0 && (
              <EmptyState
                icon="🔍"
                title="No rooms found"
                description="Try adjusting your filters or search a different area."
                action={<Button variant="primary" onClick={() => handleFilterChange({ city: '', district: '', room_type: '', min_price: undefined, max_price: undefined })}>Clear Filters</Button>}
              />
            )}

            {/* Room grid */}
            {rooms.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 stagger-children">
                  {rooms.map((room) => (
                    <RoomCard key={room.id} room={room} onClick={(id) => navigate(`/rooms/${id}`)} />
                  ))}
                </div>
                {hasMore && (
                  <div className="mt-10 flex justify-center">
                    <Button variant="outline" size="lg" onClick={loadMore} loading={loading}>Load More</Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
