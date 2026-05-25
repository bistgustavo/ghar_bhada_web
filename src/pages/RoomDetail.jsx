import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import roomService from '../services/roomService';
import { Badge, Button, Card, Spinner, Alert } from '../components/UI';
import { useDispatch, useSelector } from 'react-redux';
import { initiateSubscription } from '../store/slices/subscriptionSlice';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function RoomDetail() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImg, setActiveImg] = useState(0);

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { loading: subLoading, error: subError, currentSubscription } = useSelector(state => state.subscriptions);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    roomService.getRoomById(id)
      .then((data) => setRoom(data))
      .catch((err) => setError(err.message || 'Failed to load room'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const result = await dispatch(initiateSubscription(id));
    if (initiateSubscription.fulfilled.match(result)) {
      navigate(`/tenant/payment/${result.payload.id}`);
    }
  };

  if (loading) return <Spinner size="lg" centered />;

  if (error || !room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <p className="text-6xl mb-4">😔</p>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Room Not Found</h2>
        <p className="text-slate-500 mb-6">{error || 'This room may have been removed.'}</p>
        <Link to="/rooms"><Button variant="primary">Browse Rooms</Button></Link>
      </div>
    );
  }

  const typeLabels = { SINGLE: 'Single Room', DOUBLE: 'Double Room', FLAT: 'Flat/Apartment', STUDIO: 'Studio' };
  const images = room.images?.length ? room.images : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/rooms" className="text-primary-600 hover:underline">Rooms</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium line-clamp-1">{room.title}</span>
        </nav>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Images */}
          <div className="lg:col-span-3 space-y-4">
            {/* Main image */}
            <div className="aspect-video bg-slate-200 rounded-2xl overflow-hidden">
              {images.length > 0 ? (
                <img src={images[activeImg]} alt={room.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-6xl">🏠</div>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${i === activeImg ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                    <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            <Card>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Description</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{room.description || 'No description provided.'}</p>
              
              {room.amenities && room.amenities.length > 0 && (
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <h3 className="text-md font-bold text-slate-900 mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((a, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                        {a.name || a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Map */}
            {room.lat && room.lng && (
              <Card noPadding className="overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-900">Location Map</h2>
                </div>
                <div className="h-[300px] w-full relative z-10">
                  <MapContainer center={[room.lat, room.lng]} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      attribution='&copy; OpenStreetMap contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[room.lat, room.lng]}>
                      <Popup>{room.title}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </Card>
            )}
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="primary">{typeLabels[room.room_type] || room.room_type}</Badge>
                  <h1 className="text-2xl font-extrabold text-slate-900 mt-2">{room.title}</h1>
                </div>
              </div>

              {/* Price */}
              <div className="bg-primary-50 rounded-xl p-4 mb-5">
                <p className="text-sm text-primary-700 font-medium">Monthly Rent</p>
                <p className="text-3xl font-extrabold text-primary-600">
                  Rs. {room.price_per_month?.toLocaleString()}
                  <span className="text-sm font-normal text-primary-400 ml-1">/month</span>
                </p>
              </div>

              {/* Location */}
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-lg">📍</span>
                  <div>
                    <p className="font-medium text-slate-900">{room.address}</p>
                    <p className="text-slate-500">{room.city}, {room.district}, {room.province}</p>
                  </div>
                </div>

                {room.available_from && (
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📅</span>
                    <div>
                      <p className="text-slate-500">Available from</p>
                      <p className="font-medium text-slate-900">{new Date(room.available_from).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <span className="text-lg">{room.is_available ? '✅' : '🔴'}</span>
                  <p className={`font-medium ${room.is_available ? 'text-emerald-600' : 'text-red-600'}`}>
                    {room.is_available ? 'Available Now' : 'Currently Occupied'}
                  </p>
                </div>
              </div>

              {room.rent_note && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                  <p className="font-medium mb-0.5">Landlord Note</p>
                  <p>{room.rent_note}</p>
                </div>
              )}

              {/* Action */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                {subError && <Alert type="error" className="mb-4">{subError}</Alert>}
                {(!user || user.role === 'tenant') && (
                  <Button 
                    variant="primary" 
                    size="lg" 
                    fullWidth 
                    onClick={handleSubscribe} 
                    loading={subLoading}
                    disabled={!room.is_available}
                  >
                    Subscribe to Connect
                  </Button>
                )}
              </div>
            </Card>

            <Link to="/rooms" className="block">
              <Button variant="outline" fullWidth>← Back to Listings</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
