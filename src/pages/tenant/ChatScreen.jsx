import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Button, Input, Spinner } from '../../components/UI';

export default function ChatScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  // Simulated chat state (since the backend doesn't have a chat endpoint yet or we use polling)
  const [messages, setMessages] = useState([
    { id: 1, sender: 'landlord', text: 'Hello! I saw you subscribed to my room.', time: new Date(Date.now() - 3600000).toISOString() },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch previous messages and set up polling/websockets here
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  }, [id]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setMessages([...messages, {
      id: Date.now(),
      sender: user.role.toLowerCase(),
      text: newMessage.trim(),
      time: new Date().toISOString()
    }]);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-8rem)]">
        <Card className="h-full flex flex-col p-0 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600">← Back</button>
              <div>
                <h2 className="font-bold text-slate-900">Chat for Connection {id.slice(0, 8)}...</h2>
                <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
                </p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {loading ? (
              <div className="flex justify-center py-12"><Spinner /></div>
            ) : (
              messages.map(msg => {
                const isMe = msg.sender === user?.role?.toLowerCase();
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      isMe ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none'
                    }`}>
                      <p>{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-100' : 'text-slate-400'}`}>
                        {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-2 bg-slate-100 rounded-full border-none focus:ring-2 focus:ring-primary-500/50 outline-none"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button type="submit" variant="primary" className="rounded-full px-6">Send</Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
