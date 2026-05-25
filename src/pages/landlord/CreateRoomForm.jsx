import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import roomService from '../../services/roomService';
import { Button, Card, Input, Select, TextArea, Alert, Tooltip } from '../../components/UI';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon issue in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const ROOM_TYPES = [
  { value: 'SINGLE', label: '🛏️ Single Room' },
  { value: 'DOUBLE', label: '🛏️ Double Room' },
  { value: 'FLAT', label: '🏢 Flat / Apartment' },
  { value: 'STUDIO', label: '🏠 Studio' },
];

const STEPS = ['General Info', 'Location', 'Pricing & Notes'];

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng.lat, e.latlng.lng);
    },
  });

  return position[0] && position[1] ? (
    <Marker position={position}></Marker>
  ) : null;
}

// ── STEP INDICATOR ──────────────────────────────────────────────────────────
const StepIndicator = ({ current, total }) => (
  <div className="mb-10">
    <div className="flex items-center justify-between mb-3">
      {[...Array(total)].map((_, i) => (
        <div key={i} className="flex items-center flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
            i < current ? 'bg-primary-600 text-white' : i === current ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-400' : 'bg-slate-200 text-slate-500'
          }`}>
            {i < current ? '✓' : i + 1}
          </div>
          {i < total - 1 && <div className={`flex-1 h-1 mx-2 rounded transition-all duration-300 ${i < current ? 'bg-primary-600' : 'bg-slate-200'}`} />}
        </div>
      ))}
    </div>
    <div className="grid grid-cols-3 text-center">
      {STEPS.map((s, i) => (
        <p key={i} className={`text-xs font-medium transition-colors ${i === current ? 'text-primary-600' : 'text-slate-400'}`}>{s}</p>
      ))}
    </div>
  </div>
);

export default function CreateRoomForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: '', description: '', room_type: 'SINGLE',
    address: '', city: '', district: '', province: 'Bagmati', lat: 27.7172, lng: 85.3240,
    price_per_month: '', available_from: '', rent_note: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const set = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: '' }));
  };

  const validate = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.title?.trim()) e.title = 'Required';
      if (!form.room_type) e.room_type = 'Required';
    } else if (s === 1) {
      if (!form.address?.trim()) e.address = 'Required';
      if (!form.city?.trim()) e.city = 'Required';
      if (!form.district?.trim()) e.district = 'Required';
    } else if (s === 2) {
      if (!form.price_per_month || Number(form.price_per_month) <= 0) e.price_per_month = 'Enter a valid price';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep((p) => Math.min(p + 1, 2)); };
  const prev = () => setStep((p) => Math.max(p - 1, 0));

  const handleSubmit = async () => {
    if (!validate(step)) return;
    setLoading(true);
    setSubmitError('');
    try {
      const payload = {
        title: form.title,
        description: form.description || undefined,
        room_type: form.room_type,
        price_per_month: Number(form.price_per_month),
        address: form.address,
        city: form.city,
        district: form.district,
        province: form.province || 'Bagmati',
        lat: Number(form.lat) || 27.7172,
        lng: Number(form.lng) || 85.3240,
        available_from: form.available_from || undefined,
        rent_note: form.rent_note || undefined,
      };
      await roomService.createRoom(payload);
      navigate('/landlord');
    } catch (err) {
      setSubmitError(err.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5">
          <h1 className="text-2xl font-extrabold text-slate-900">List Your Room</h1>
          <p className="text-slate-500 text-sm mt-0.5">Fill in the details to create a new listing</p>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <StepIndicator current={step} total={3} />

        {submitError && <Alert type="error" className="mb-6">{submitError}</Alert>}

        {/* Step 1: General Info */}
        {step === 0 && (
          <Card className="animate-fade-in">
            <h3 className="text-xl font-bold text-slate-900 mb-6">General Information</h3>
            <div className="space-y-5">
              <Input label="Room Title" placeholder="e.g., Cozy Single Room in Thamel" value={form.title} onChange={(e) => set('title', e.target.value)} error={errors.title} required />
              <TextArea label="Description" placeholder="Describe your room..." value={form.description} onChange={(e) => set('description', e.target.value)} rows={4} />
              <Select label="Room Type" value={form.room_type} onChange={(e) => set('room_type', e.target.value)} options={ROOM_TYPES} error={errors.room_type} required />
            </div>
          </Card>
        )}

        {/* Step 2: Location */}
        {step === 1 && (
          <Card className="animate-fade-in">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Location Details</h3>
            <div className="space-y-5">
              <Input label="Full Address" placeholder="e.g., Thamel Marg, Near Garden of Dreams" value={form.address} onChange={(e) => set('address', e.target.value)} error={errors.address} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" placeholder="Kathmandu" value={form.city} onChange={(e) => set('city', e.target.value)} error={errors.city} required />
                <Input label="District" placeholder="Kathmandu" value={form.district} onChange={(e) => set('district', e.target.value)} error={errors.district} required />
              </div>
              <Input label="Province" placeholder="Bagmati" value={form.province} onChange={(e) => set('province', e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Latitude" type="number" value={form.lat} onChange={(e) => set('lat', e.target.value)} hint="Default: Kathmandu" />
                <Input label="Longitude" type="number" value={form.lng} onChange={(e) => set('lng', e.target.value)} hint="Default: Kathmandu" />
              </div>
              
              <div className="mt-4 h-[300px] w-full rounded-xl overflow-hidden border border-slate-200 z-10">
                <MapContainer center={[form.lat || 27.7172, form.lng || 85.3240]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker 
                    position={[form.lat, form.lng]} 
                    setPosition={(lat, lng) => { set('lat', lat); set('lng', lng); }} 
                  />
                </MapContainer>
              </div>
              <Alert type="info">Click on the map to pinpoint the exact location of your room.</Alert>
            </div>
          </Card>
        )}

        {/* Step 3: Pricing */}
        {step === 2 && (
          <Card className="animate-fade-in">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Pricing & Notes</h3>
            <div className="space-y-5">
              <Input label="Monthly Rent (Rs.)" type="number" placeholder="e.g., 15000" value={form.price_per_month} onChange={(e) => set('price_per_month', e.target.value)} error={errors.price_per_month} hint="Price in Nepali Rupees per month" required />
              <Input label="Available From" type="date" value={form.available_from} onChange={(e) => set('available_from', e.target.value)} hint="When can a tenant move in?" />
              <TextArea label="Rent Note (Optional)" placeholder="Any additional terms, rules, or notes for tenants..." value={form.rent_note} onChange={(e) => set('rent_note', e.target.value)} rows={3} />

              {form.price_per_month > 0 && (
                <div className="bg-primary-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-primary-700">Your listing price</p>
                  <p className="text-3xl font-extrabold text-primary-600">Rs. {Number(form.price_per_month).toLocaleString()}<span className="text-sm font-normal">/month</span></p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          <Button variant="secondary" fullWidth onClick={prev} disabled={step === 0 || loading}>← Previous</Button>
          {step < 2 ? (
            <Button variant="primary" fullWidth onClick={next}>Next →</Button>
          ) : (
            <Button variant="primary" fullWidth onClick={handleSubmit} loading={loading}>🚀 Publish Listing</Button>
          )}
        </div>
      </main>
    </div>
  );
}
