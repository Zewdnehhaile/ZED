import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Map, Package, Truck, CheckCircle, Clock, Phone, MessageSquare, Shield, AlertCircle, X, Send } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { io, Socket } from 'socket.io-client';

export default function Tracking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{sender: string, text: string, time: string}[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: 'Guest', role: 'customer' };

  useEffect(() => {
    // Initialize Socket.io
    socketRef.current = io();

    socketRef.current.on('connect', () => {
      if (id) {
        socketRef.current?.emit('join_delivery', id);
      }
    });

    socketRef.current.on('receive_message', (message: {sender: string, text: string, time: string}) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [id]);

  useEffect(() => {
    // Scroll to bottom of chat
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatOpen]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;

    const msgData = {
      deliveryId: id,
      sender: user.name,
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    socketRef.current.emit('send_message', msgData);
    setNewMessage('');
  };

  // Mock tracking data
  const mockOrder = {
    id: id || '12345',
    status: 'in_transit', // pending, assigned, picked_up, in_transit, near_destination, delivered
    eta: '14 mins',
    driver: {
      name: 'Abebe Kebede',
      phone: '+251 911 234567',
      rating: 4.8,
      vehicle: 'Toyota Yaris - AA 12345',
      photo: 'https://i.pravatar.cc/150?u=abebe'
    },
    pickup: 'Bole Medhanialem',
    dropoff: 'Piassa, Arada',
    parcel: 'Electronics (Small)',
    updates: [
      { time: '10:30 AM', status: 'Order Confirmed', completed: true },
      { time: '10:35 AM', status: 'Driver Assigned', completed: true },
      { time: '10:45 AM', status: 'Package Picked Up', completed: true },
      { time: '10:50 AM', status: 'In Transit', completed: true, current: true },
      { time: '--:--', status: 'Delivered', completed: false }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrder(mockOrder);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-[#2A1B7A] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Locating your delivery...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2A1B7A]">Track Delivery</h1>
          <p className="text-gray-500">Order #{order.id}</p>
        </div>
        <div className="bg-orange-100 text-[#F28C3A] px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
          <Clock className="w-4 h-4" /> ETA: {order.eta}
        </div>
      </div>

      {/* Map Area */}
      <div className="bg-gray-200 h-64 md:h-96 rounded-3xl overflow-hidden relative border border-gray-200 shadow-sm">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center space-y-2">
            <Map className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="text-gray-500 font-medium">Live Map Integration Pending</p>
          </div>
        </div>
        
        {/* Mock Map Elements */}
        <div className="absolute top-1/4 left-1/4 flex flex-col items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>
          <span className="text-xs font-bold mt-1 bg-white/80 px-1 rounded">Pickup</span>
        </div>
        <div className="absolute bottom-1/4 right-1/4 flex flex-col items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-md"></div>
          <span className="text-xs font-bold mt-1 bg-white/80 px-1 rounded">Dropoff</span>
        </div>
        <div className="absolute top-1/2 left-1/2 flex flex-col items-center animate-bounce">
          <div className="bg-[#2A1B7A] p-2 rounded-full shadow-lg border-2 border-white">
            <Truck className="w-5 h-5 text-white" />
          </div>
        </div>
        
        {/* Mock Route Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <path d="M 25% 25% Q 50% 25% 50% 50% T 75% 75%" fill="none" stroke="#2A1B7A" strokeWidth="3" strokeDasharray="5,5" className="opacity-50" />
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Driver Info */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 md:col-span-1 space-y-6">
          <h3 className="font-bold text-[#2A1B7A] border-b pb-2">Driver Details</h3>
          <div className="flex items-center gap-4">
            <img src={order.driver.photo} alt={order.driver.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-100" />
            <div>
              <p className="font-bold text-gray-900">{order.driver.name}</p>
              <div className="flex items-center gap-1 text-sm text-yellow-500 font-medium">
                ★ {order.driver.rating}
              </div>
              <p className="text-xs text-gray-500 mt-1">{order.driver.vehicle}</p>
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl h-12">
              <Phone className="w-5 h-5 mr-2" /> Call
            </Button>
            <Button 
              onClick={() => setIsChatOpen(true)}
              variant="outline" 
              className="flex-1 rounded-xl h-12 border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <MessageSquare className="w-5 h-5 mr-2" /> Chat
            </Button>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3 border border-blue-100">
            <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <span className="font-bold block mb-1">Safe Delivery Pin: 4829</span>
              Share this pin with the driver only when you receive your package.
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 md:col-span-2">
          <h3 className="font-bold text-[#2A1B7A] border-b pb-4 mb-6">Delivery Status</h3>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
            {order.updates.map((update: any, index: number) => (
              <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  {update.completed ? (
                    <CheckCircle className={`w-5 h-5 ${update.current ? 'text-[#F28C3A]' : 'text-green-500'}`} />
                  ) : (
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  )}
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-bold ${update.current ? 'text-[#F28C3A]' : update.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                      {update.status}
                    </h4>
                    <span className="text-xs font-medium text-gray-500">{update.time}</span>
                  </div>
                  {update.current && (
                    <p className="text-sm text-gray-600 mt-2">Driver is currently navigating to the dropoff location. Traffic is light.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md flex flex-col h-[600px] max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#2A1B7A] text-white rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">Chat with {order.driver.name}</h3>
                  <p className="text-xs text-white/80">Active now</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              <div className="text-center text-xs text-gray-400 my-2">Chat started</div>
              {messages.map((msg, idx) => {
                const isMe = msg.sender === user.name;
                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${isMe ? 'bg-[#F28C3A] text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'}`}>
                      {!isMe && <div className="text-xs font-bold text-[#2A1B7A] mb-1">{msg.sender}</div>}
                      <p className="text-sm">{msg.text}</p>
                      <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-white/80' : 'text-gray-400'}`}>{msg.time}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 rounded-b-3xl flex gap-2">
              <Input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..." 
                className="flex-1 rounded-full bg-gray-50 border-gray-200"
              />
              <Button type="submit" className="rounded-full w-12 h-12 p-0 bg-[#2A1B7A] hover:bg-[#2A1B7A]/90 text-white flex items-center justify-center shrink-0">
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
