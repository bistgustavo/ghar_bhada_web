import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spinner, Alert, Input, Badge } from '../../components/UI';
import axiosClient from '../../services/axiosClient';

export default function AmenitiesManager() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAmenity, setNewAmenity] = useState('');
  const [error, setError] = useState('');

  const fetchAmenities = async () => {
    try {
      const res = await axiosClient.get(`/rooms/${id}/amenities/`);
      setAmenities(res.data);
    } catch (err) {
      setError('Failed to load amenities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, [id]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newAmenity.trim()) return;
    setError('');
    
    try {
      await axiosClient.post(`/rooms/${id}/amenities/`, { names: [newAmenity.trim()] });
      setNewAmenity('');
      fetchAmenities();
    } catch (err) {
      setError('Failed to add amenity');
    }
  };

  const handleDelete = async (amenityId) => {
    try {
      await axiosClient.delete(`/rooms/${id}/amenities/${amenityId}`);
      setAmenities(amenities.filter(a => a.id !== amenityId));
    } catch (err) {
      setError('Failed to delete amenity');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Manage Amenities</h1>
            <p className="text-slate-500 mt-2">Add or remove amenities for your room.</p>
          </div>
          <Button variant="secondary" onClick={() => navigate(-1)}>← Back</Button>
        </div>

        {error && <Alert type="error" className="mb-6">{error}</Alert>}

        <Card className="mb-6">
          <form onSubmit={handleAdd} className="flex gap-4 items-end">
            <div className="flex-1">
              <Input 
                label="Add Amenity" 
                placeholder="e.g., Free WiFi, Hot Water, Parking" 
                value={newAmenity} 
                onChange={(e) => setNewAmenity(e.target.value)} 
              />
            </div>
            <Button type="submit" variant="primary" className="mb-1">Add</Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Current Amenities</h2>
          {amenities.length === 0 ? (
            <p className="text-slate-500 text-center py-6">No amenities added yet.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {amenities.map(amenity => (
                <div key={amenity.id} className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
                  <span className="text-slate-800 font-medium">{amenity.name}</span>
                  <button 
                    onClick={() => handleDelete(amenity.id)} 
                    className="text-slate-400 hover:text-red-500 transition-colors ml-2 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
