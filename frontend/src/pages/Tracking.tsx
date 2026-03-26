import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Map, Package, Truck, CheckCircle, Clock, Phone, MessageSquare, Shield, AlertCircle, X, Send } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, Tooltip } from 'react-leaflet';
import { io, Socket } from 'socket.io-client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { apiFetch, formatCurrency, formatShortDate } from '../lib/api';

type ChatMessage = { sender: string; text: string; time: string };

const TRACK_STEPS = [
  { key: 'confirmed', label: 'Order Confirmed' },
  { key: 'driver_assigned', label: 'Driver Assigned' },
  { key: 'picked_up', label: 'Package Picked Up' },
  { key: 'in_transit', label: 'In Transit' },
  { key: 'delivered', label: 'Delivered' },
];

const STATUS_INDEX: Record<string, number> = {
  confirmed: 0,
  driver_assigned: 1,
  picked_up: 2,
  in_transit: 3,
  delivered: 4,
  completed: 4,
};

export default function Tracking() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number; updated_at?: string } | null>(null);
  const [driverProfile, setDriverProfile] = useState<{ name: string; phone: string; vehicle: string } | null>(null);
  const [customerLocation, setCustomerLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: 'Guest', role: 'customer' };

  useEffect(() => {
    socketRef.current = io();

    socketRef.current.on('connect', () => {
      if (id) {
        socketRef.current?.emit('join_delivery', id);
      }
    });

    socketRef.current.on('receive_message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on('order_updated', (updatedOrder: any) => {
      if (updatedOrder?.id?.toString() === order?.id?.toString() || updatedOrder?.id?.toString() === id) {
        setOrder(updatedOrder);
      }
    });

    socketRef.current.on('driver_location', (payload: any) => {
      if (!payload || typeof payload.lat !== 'number' || typeof payload.lng !== 'number') return;
      if (payload.orderId && order?.id && payload.orderId !== order.id) return;
      setDriverLocation({ lat: payload.lat, lng: payload.lng, updated_at: payload.updated_at });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [id, order?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatOpen]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiFetch(`/api/track/${id}`);
        setOrder(data.order);
        setEvents(data.events || []);
        setDriverLocation(data.driverLocation || null);
        setDriverProfile(data.driverProfile || null);
        if (data.order?.id) {
          socketRef.current?.emit('join_delivery', data.order.id);
        }
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCustomerLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => undefined,
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current || !order?.id) return;

    const msgData = {
      deliveryId: order.id,
      sender: user.name,
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    socketRef.current.emit('send_message', msgData);
    setNewMessage('');
  };

  const pickupLat = Number(order?.pickup_lat);
  const pickupLng = Number(order?.pickup_lng);
  const dropoffLat = Number(order?.dropoff_lat);
  const dropoffLng = Number(order?.dropoff_lng);
  const driverLat = driverLocation ? Number(driverLocation.lat) : NaN;
  const driverLng = driverLocation ? Number(driverLocation.lng) : NaN;
  const customerLat = customerLocation ? Number(customerLocation.lat) : NaN;
  const customerLng = customerLocation ? Number(customerLocation.lng) : NaN;

  const hasPickup = Number.isFinite(pickupLat) && Number.isFinite(pickupLng);
  const hasDropoff = Number.isFinite(dropoffLat) && Number.isFinite(dropoffLng);
  const hasDriver = Number.isFinite(driverLat) && Number.isFinite(driverLng);
  const hasCustomer = Number.isFinite(customerLat) && Number.isFinite(customerLng);

  const mapCenter = useMemo<[number, number]>(() => {
    if (hasDriver) return [driverLat, driverLng];
    if (hasCustomer) return [customerLat, customerLng];
    if (hasPickup) return [pickupLat, pickupLng];
    if (hasDropoff) return [dropoffLat, dropoffLng];
    return [9.03, 38.74];
  }, [hasCustomer, hasDriver, hasDropoff, hasPickup, customerLat, customerLng, driverLat, driverLng, dropoffLat, dropoffLng, pickupLat, pickupLng]);

  const currentStepIndex = STATUS_INDEX[order?.status] ?? 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-[#2A1B7A] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Locating your delivery...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-gray-500 font-medium">Delivery not found.</p>
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
          <Clock className="w-4 h-4" /> {order.eta_text ? `ETA: ${order.eta_text}` : `Status: ${order.status?.replace('_', ' ')}`}
        </div>
      </div>

      <div className="bg-gray-200 h-64 md:h-96 rounded-3xl overflow-hidden relative border border-gray-200 shadow-sm">
        <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {hasPickup && (
            <CircleMarker center={[pickupLat, pickupLng]} radius={8} pathOptions={{ color: '#2563EB', fillColor: '#3B82F6', fillOpacity: 0.95 }}>
              <Tooltip direction="top" offset={[0, -6]} permanent>Pickup</Tooltip>
              <Popup>Pickup location</Popup>
            </CircleMarker>
          )}

          {hasDropoff && (
            <CircleMarker center={[dropoffLat, dropoffLng]} radius={8} pathOptions={{ color: '#DC2626', fillColor: '#EF4444', fillOpacity: 0.95 }}>
              <Tooltip direction="top" offset={[0, -6]} permanent>Drop-off</Tooltip>
              <Popup>Drop-off location</Popup>
            </CircleMarker>
          )}

          {hasDriver && (
            <CircleMarker center={[driverLat, driverLng]} radius={9} pathOptions={{ color: '#2A1B7A', fillColor: '#2A1B7A', fillOpacity: 0.95 }}>
              <Tooltip direction="top" offset={[0, -6]} permanent>Driver</Tooltip>
              <Popup>Driver live location</Popup>
            </CircleMarker>
          )}

          {hasCustomer && (
            <CircleMarker center={[customerLat, customerLng]} radius={8} pathOptions={{ color: '#059669', fillColor: '#10B981', fillOpacity: 0.95 }}>
              <Tooltip direction="top" offset={[0, -6]} permanent>You</Tooltip>
              <Popup>Your current location</Popup>
            </CircleMarker>
          )}

          {hasPickup && hasDropoff && (
            <Polyline positions={[[pickupLat, pickupLng], [dropoffLat, dropoffLng]]} pathOptions={{ color: '#2A1B7A', weight: 4, opacity: 0.55, dashArray: '8 8' }} />
          )}
        </MapContainer>

        {!hasPickup && !hasDropoff && !hasDriver && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center space-y-2">
              <Map className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="text-gray-500 font-medium">Live map will appear soon</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 md:col-span-1 space-y-6">
          <h3 className="font-bold text-[#2A1B7A] border-b pb-2">Driver Details</h3>
          {driverProfile ? (
            <>
              <div className="flex items-center gap-4">
                <img
                  src={`https://i.pravatar.cc/150?u=${encodeURIComponent(driverProfile.name)}`}
                  alt={driverProfile.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                />
                <div>
                  <p className="font-bold text-gray-900">{driverProfile.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{driverProfile.vehicle}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <a href={driverProfile.phone ? `tel:${driverProfile.phone}` : undefined} className="flex-1">
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl h-12" disabled={!driverProfile.phone}>
                    <Phone className="w-5 h-5 mr-2" /> Call
                  </Button>
                </a>
                <Button
                  onClick={() => setIsChatOpen(true)}
                  variant="outline"
                  className="flex-1 rounded-xl h-12 border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  <MessageSquare className="w-5 h-5 mr-2" /> Chat
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">Driver will appear once assigned.</p>
          )}

          <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3 border border-blue-100">
            <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <span className="font-bold block mb-1">Delivery PIN: {order.proof_otp || '----'}</span>
              Share this code only when you receive your package.
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 md:col-span-2">
          <h3 className="font-bold text-[#2A1B7A] border-b pb-4 mb-6">Delivery Status</h3>
          <div className="space-y-6">
            {TRACK_STEPS.map((step, index) => {
              const completed = index <= currentStepIndex;
              const current = index === currentStepIndex;
              const matchedEvent = events.find((event) => String(event.event_type || '').includes(step.key));
              return (
                <div key={step.key} className="relative flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full border-4 border-white bg-white shadow flex items-center justify-center shrink-0">
                    {completed ? (
                      <CheckCircle className={`w-5 h-5 ${current ? 'text-[#F28C3A]' : 'text-green-500'}`} />
                    ) : (
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 p-4 rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-bold ${current ? 'text-[#F28C3A]' : completed ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </h4>
                      <span className="text-xs font-medium text-gray-500">
                        {matchedEvent?.created_at ? formatShortDate(matchedEvent.created_at) : '--'}
                      </span>
                    </div>
                    {current && step.key === 'in_transit' && (
                      <p className="text-sm text-gray-600 mt-2">Driver is currently navigating to the drop-off location.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-[#2A1B7A] flex items-center gap-2 mb-2"><Package className="w-5 h-5" /> Parcel</h3>
          <p className="text-sm text-gray-500">{order.package_type} • {order.package_size} • {order.package_weight} kg</p>
          <p className="text-sm text-gray-500">{order.pickup_address} → {order.dropoff_address}</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-[#2A1B7A] flex items-center gap-2 mb-2"><Truck className="w-5 h-5" /> Payment</h3>
          <p className="text-sm text-gray-500">Total: {formatCurrency(order.total || 0)}</p>
          <p className="text-sm text-gray-500">Created: {formatShortDate(order.created_at)}</p>
        </div>
      </div>

      {isChatOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md flex flex-col h-[600px] max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#2A1B7A] text-white rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">Chat with {driverProfile?.name || 'Driver'}</h3>
                  <p className="text-xs text-white/80">Active now</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              <div className="text-center text-xs text-gray-400 my-2">Chat started</div>
              {messages.map((msg, idx) => {
                const isMe = msg.sender === user.name;
                return (
                  <div key={`${msg.time}-${idx}`} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
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
