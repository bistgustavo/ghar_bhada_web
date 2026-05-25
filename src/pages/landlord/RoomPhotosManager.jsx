import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spinner, Alert } from '../../components/UI';
import axiosClient from '../../services/axiosClient';

export default function RoomPhotosManager() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fetchPhotos = async () => {
    try {
      const res = await axiosClient.get(`/rooms/${id}/photos/`);
      setPhotos(res.data);
    } catch (err) {
      setError('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [id]);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    if (photos.length + files.length > 10) {
      setError('Maximum 10 photos allowed per room.');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    setUploading(true);
    setError('');
    try {
      await axiosClient.post(`/rooms/${id}/photos/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchPhotos();
    } catch (err) {
      setError('Failed to upload photos');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId) => {
    try {
      await axiosClient.delete(`/rooms/${id}/photos/${photoId}`);
      setPhotos(photos.filter(p => p.id !== photoId));
    } catch (err) {
      setError('Failed to delete photo');
    }
  };

  const handleSetCover = async (photoId) => {
    try {
      await axiosClient.patch(`/rooms/${id}/photos/cover`, { photo_id: photoId });
      fetchPhotos();
    } catch (err) {
      setError('Failed to set cover photo');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Manage Photos</h1>
            <p className="text-slate-500 mt-2">Upload up to 10 photos for your room listing.</p>
          </div>
          <Button variant="secondary" onClick={() => navigate(-1)}>← Back</Button>
        </div>

        {error && <Alert type="error" className="mb-6">{error}</Alert>}

        <Card className="mb-8 p-6 text-center border-dashed border-2 border-slate-300">
          <label className="cursor-pointer block">
            <span className="text-4xl mb-2 block">📸</span>
            <span className="text-primary-600 font-semibold hover:underline">Click to upload photos</span>
            <span className="block text-sm text-slate-500 mt-1">JPG, PNG up to 5MB each. {10 - photos.length} slots remaining.</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading || photos.length >= 10} />
          </label>
          {uploading && <div className="mt-4"><Spinner size="sm" /> Uploading...</div>}
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map(photo => (
            <div key={photo.id} className="relative group rounded-xl overflow-hidden shadow-sm border border-slate-200">
              <img src={photo.url} alt="Room" className="w-full h-48 object-cover" />
              {photo.is_cover && (
                <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">COVER</div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2">
                {!photo.is_cover && (
                  <Button size="sm" variant="primary" onClick={() => handleSetCover(photo.id)}>Set as Cover</Button>
                )}
                <Button size="sm" variant="danger" onClick={() => handleDelete(photo.id)}>Delete</Button>
              </div>
            </div>
          ))}
          {photos.length === 0 && !uploading && (
            <div className="col-span-full text-center py-12 text-slate-500">
              No photos uploaded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
