import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchSavedRooms, toggleSaveRoom } from '../../store/slices/savedRoomSlice';
import { Card, Spinner } from '../../components/UI';

export default function SavedRooms() {
  const dispatch = useDispatch();
  const { savedRooms, loading } = useSelector(state => state.savedRooms);

  useEffect(() => {
    dispatch(fetchSavedRooms());
  }, [dispatch]);

  const handleUnsave = (roomId) => {
    dispatch(toggleSaveRoom({ roomId, isSaved: true }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Saved Rooms</h1>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : savedRooms.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-slate-500 mb-4">You haven't saved any rooms yet.</p>
            <Link to="/rooms" className="text-primary-600 font-semibold hover:underline">Browse Rooms</Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRooms.map(room => (
              <Card key={room.id} className="relative overflow-hidden group p-0">
                <button 
                  onClick={() => handleUnsave(room.id)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/80 rounded-full text-red-500 hover:scale-110 transition-transform"
                >
                  ❤️
                </button>
                <Link to={`/rooms/${room.id}`} className="block relative h-48 bg-slate-200">
                  {/* Photo would go here */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white font-bold truncate">{room.title}</p>
                    <p className="text-white/80 text-sm">{room.city}, {room.district}</p>
                  </div>
                </Link>
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-primary-600">NPR {room.price_per_month}</p>
                    <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-md uppercase tracking-wide">
                      {room.room_type}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
