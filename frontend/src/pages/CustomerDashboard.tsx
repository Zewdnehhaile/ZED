import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Package, MapPin, Phone, Weight, DollarSign, Clock, CheckCircle, Store, Star, Heart, Settings, ChevronRight, Wallet, Award, Gift, Plus, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import ParcelCalculator from '../components/ParcelCalculator';

export default function CustomerDashboard() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'addresses' | 'preferences' | 'wallet' | 'loyalty'>('home');
  const navigate = useNavigate();

  const fetchDeliveries = async () => {
    try {
      const res = await fetch('/api/deliveries', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      if (res.ok) setDeliveries(data);
    } catch (error) {
      console.error('Failed to fetch deliveries', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleCreate = async (data: any) => {
    try {
      const res = await fetch('/api/deliveries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          pickupLocation: data.pickup,
          dropLocation: data.dropoff,
          parcelDescription: `${data.size} ${data.packageType}`,
          parcelWeight: data.weight,
          receiverPhone: 'N/A', // Would normally collect this in the calculator or a second step
          serviceType: data.serviceType,
          hasInsurance: data.hasInsurance,
          price: data.pricing.finalTotal
        }),
      });

      if (res.ok) {
        setIsCreating(false);
        fetchDeliveries();
      }
    } catch (error) {
      console.error('Failed to create delivery', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'picked_up': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'in_transit': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2A1B7A]">Customer Dashboard</h1>
          <p className="text-gray-500">Manage your deliveries and preferences</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)} className="bg-[#F28C3A] hover:bg-[#F28C3A]/90 rounded-xl h-12 px-6">
          {isCreating ? 'Cancel Request' : 'New Delivery Request'}
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b border-gray-200 overflow-x-auto pb-2">
        <button onClick={() => setActiveTab('home')} className={`pb-2 font-medium whitespace-nowrap ${activeTab === 'home' ? 'text-[#2A1B7A] border-b-2 border-[#2A1B7A]' : 'text-gray-500 hover:text-gray-700'}`}>Home</button>
        <button onClick={() => setActiveTab('history')} className={`pb-2 font-medium whitespace-nowrap ${activeTab === 'history' ? 'text-[#2A1B7A] border-b-2 border-[#2A1B7A]' : 'text-gray-500 hover:text-gray-700'}`}>Order History</button>
        <button onClick={() => setActiveTab('wallet')} className={`pb-2 font-medium whitespace-nowrap ${activeTab === 'wallet' ? 'text-[#2A1B7A] border-b-2 border-[#2A1B7A]' : 'text-gray-500 hover:text-gray-700'}`}>Wallet</button>
        <button onClick={() => setActiveTab('loyalty')} className={`pb-2 font-medium whitespace-nowrap ${activeTab === 'loyalty' ? 'text-[#2A1B7A] border-b-2 border-[#2A1B7A]' : 'text-gray-500 hover:text-gray-700'}`}>Rewards</button>
        <button onClick={() => setActiveTab('addresses')} className={`pb-2 font-medium whitespace-nowrap ${activeTab === 'addresses' ? 'text-[#2A1B7A] border-b-2 border-[#2A1B7A]' : 'text-gray-500 hover:text-gray-700'}`}>Saved Addresses</button>
        <button onClick={() => setActiveTab('preferences')} className={`pb-2 font-medium whitespace-nowrap ${activeTab === 'preferences' ? 'text-[#2A1B7A] border-b-2 border-[#2A1B7A]' : 'text-gray-500 hover:text-gray-700'}`}>Preferences</button>
      </div>

      {isCreating && (
        <div className="mb-8">
          <ParcelCalculator onConfirm={handleCreate} />
        </div>
      )}

      {activeTab === 'home' && !isCreating && (
        <div className="space-y-8">
          {/* Promotional Banner */}
          <div className="bg-gradient-to-r from-[#2A1B7A] to-[#F28C3A] rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Get 20% off your next Express Delivery!</h2>
              <p className="text-white/80">Use code ZEMEN20 at checkout. Valid until the end of the month.</p>
            </div>
            <Button onClick={() => setIsCreating(true)} className="bg-white text-[#2A1B7A] hover:bg-gray-100 rounded-xl px-6 py-3 font-bold whitespace-nowrap">
              Claim Offer
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-xl font-bold text-[#2A1B7A]">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setIsCreating(true)} className="p-4 bg-[#F28C3A]/10 rounded-2xl flex flex-col items-center text-center gap-2 hover:bg-[#F28C3A]/20 transition-colors">
                  <Package className="h-8 w-8 text-[#F28C3A]" />
                  <span className="font-medium text-[#2A1B7A]">Send Parcel</span>
                </button>
                <Link to="/store" className="p-4 bg-[#2A1B7A]/10 rounded-2xl flex flex-col items-center text-center gap-2 hover:bg-[#2A1B7A]/20 transition-colors">
                  <Store className="h-8 w-8 text-[#2A1B7A]" />
                  <span className="font-medium text-[#2A1B7A]">ZED Store</span>
                </Link>
              </div>
            </div>

            {/* Available Slots */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-xl font-bold text-[#2A1B7A]">Available Delivery Slots</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Express (90 mins)</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">Available Now</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Same Day</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">Before 6:00 LT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders Preview */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#2A1B7A]">Recent Orders</h3>
              <button onClick={() => setActiveTab('history')} className="text-[#F28C3A] font-medium flex items-center hover:underline">
                View All <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : deliveries.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl text-center border border-gray-100 shadow-sm">
                <p className="text-gray-500">No recent orders.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deliveries.slice(0, 2).map((delivery) => (
                  <div key={delivery.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-[#2A1B7A]">{delivery.parcel_description}</p>
                      <p className="text-sm text-gray-500">{format(new Date(delivery.created_at), 'MMM d, yyyy')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(delivery.delivery_status)}`}>
                        {delivery.delivery_status.replace('_', ' ')}
                      </span>
                      <Button 
                        onClick={() => navigate(`/tracking/${delivery.id}`)}
                        className="bg-[#2A1B7A] hover:bg-[#2A1B7A]/90 text-white rounded-xl px-3 py-1 text-xs h-auto"
                      >
                        Track
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#2A1B7A]">Order History</h2>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading deliveries...</div>
          ) : deliveries.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No deliveries yet</h3>
              <p className="text-gray-500 mt-2">Create your first delivery request to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deliveries.map((delivery) => (
                <div key={delivery.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(delivery.delivery_status)}`}>
                      {delivery.delivery_status.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(delivery.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="font-bold text-[#2A1B7A] text-lg">{delivery.parcel_description}</h4>
                      <p className="text-sm text-gray-500">
                        {delivery.parcel_weight} kg • {delivery.service_type.replace('_', ' ')}
                        {delivery.has_insurance ? ' • Insured' : ''}
                      </p>
                    </div>
                    
                    <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                      <div className="flex items-start gap-3 relative">
                        <div className="mt-1 bg-white border-2 border-[#F28C3A] w-4 h-4 rounded-full z-10" />
                        <div>
                          <p className="text-xs text-gray-400 uppercase font-semibold">Pickup</p>
                          <p className="text-sm font-medium text-gray-800">{delivery.pickup_location}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 relative">
                        <div className="mt-1 bg-white border-2 border-[#2A1B7A] w-4 h-4 rounded-full z-10" />
                        <div>
                          <p className="text-xs text-gray-400 uppercase font-semibold">Drop-off</p>
                          <p className="text-sm font-medium text-gray-800">{delivery.drop_location}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{delivery.receiver_phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-bold text-[#F28C3A] text-lg">
                        {delivery.price} ETB
                      </div>
                      <Button 
                        onClick={() => navigate(`/tracking/${delivery.id}`)}
                        className="bg-[#2A1B7A] hover:bg-[#2A1B7A]/90 text-white rounded-xl px-4 py-1 text-sm h-auto"
                      >
                        Track
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'wallet' && (
        <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
          <h2 className="text-xl font-bold text-[#2A1B7A] flex items-center gap-2">
            <Wallet className="h-6 w-6 text-[#F28C3A]" /> Digital Wallet
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#2A1B7A] to-indigo-900 rounded-3xl p-6 text-white shadow-lg md:col-span-1 flex flex-col justify-between h-48">
              <div>
                <p className="text-white/70 font-medium">Available Balance</p>
                <h3 className="text-4xl font-bold mt-1">2,450 <span className="text-xl font-normal">ETB</span></h3>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-white text-[#2A1B7A] hover:bg-gray-100 rounded-xl font-bold">Top Up</Button>
                <Button variant="outline" className="flex-1 border-white/30 text-white hover:bg-white/10 rounded-xl">Withdraw</Button>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 md:col-span-2">
              <h3 className="font-bold text-gray-900 mb-4">Recent Transactions</h3>
              <div className="space-y-4">
                {[
                  { id: 1, type: 'Delivery Payment', date: 'Today, 10:30 AM', amount: -150, status: 'completed' },
                  { id: 2, type: 'Wallet Top Up', date: 'Yesterday, 2:15 PM', amount: 1000, status: 'completed' },
                  { id: 3, type: 'Store Purchase', date: 'Mar 5, 2026', amount: -850, status: 'completed' },
                ].map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${tx.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {tx.amount > 0 ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{tx.type}</p>
                        <p className="text-xs text-gray-500">{tx.date}</p>
                      </div>
                    </div>
                    <span className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount} ETB
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 text-[#2A1B7A] border-[#2A1B7A]/20">View All History</Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'loyalty' && (
        <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#2A1B7A] flex items-center gap-2">
              <Award className="h-6 w-6 text-[#F28C3A]" /> Zemen Rewards
            </h2>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold border border-yellow-200">Gold Tier</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center space-y-4">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto flex items-center justify-center shadow-inner">
                <Star className="w-12 h-12 text-white fill-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-[#2A1B7A]">1,250</h3>
                <p className="text-gray-500 font-medium">Total Points</p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 mt-4">
                <div className="bg-gradient-to-r from-[#F28C3A] to-yellow-400 h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-sm text-gray-500">750 points away from Platinum Tier</p>
            </div>
            
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#F28C3A]" /> Redeem Rewards
              </h3>
              <div className="space-y-3">
                <div className="border border-gray-100 rounded-xl p-4 flex justify-between items-center hover:border-[#F28C3A] transition-colors cursor-pointer">
                  <div>
                    <h4 className="font-bold text-[#2A1B7A]">Free Delivery</h4>
                    <p className="text-sm text-gray-500">Valid for any standard delivery</p>
                  </div>
                  <Button className="bg-[#F28C3A] hover:bg-[#F28C3A]/90 rounded-xl">500 pts</Button>
                </div>
                <div className="border border-gray-100 rounded-xl p-4 flex justify-between items-center hover:border-[#F28C3A] transition-colors cursor-pointer">
                  <div>
                    <h4 className="font-bold text-[#2A1B7A]">10% Store Discount</h4>
                    <p className="text-sm text-gray-500">Max discount 500 ETB</p>
                  </div>
                  <Button className="bg-[#F28C3A] hover:bg-[#F28C3A]/90 rounded-xl">800 pts</Button>
                </div>
                <div className="border border-gray-100 rounded-xl p-4 flex justify-between items-center hover:border-[#F28C3A] transition-colors cursor-pointer opacity-50">
                  <div>
                    <h4 className="font-bold text-gray-500">500 ETB Wallet Credit</h4>
                    <p className="text-sm text-gray-400">Direct deposit to your wallet</p>
                  </div>
                  <Button disabled variant="outline" className="rounded-xl">2000 pts</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#2A1B7A]">Saved Addresses</h2>
            <Button className="bg-[#2A1B7A] hover:bg-[#2A1B7A]/90 rounded-xl">Add New Address</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800">Home</h4>
                <p className="text-sm text-gray-500 mt-1">Bole, Woreda 03, House No 123, Addis Ababa</p>
              </div>
              <Button variant="outline" className="text-sm">Edit</Button>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="bg-orange-50 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-[#F28C3A]" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800">Office</h4>
                <p className="text-sm text-gray-500 mt-1">Piassa, Arada Sub-city, Zemen Bank Building, 4th Floor</p>
              </div>
              <Button variant="outline" className="text-sm">Edit</Button>
            </div>
          </div>

          <h3 className="text-lg font-bold text-[#2A1B7A] pt-4">Favorite Locations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 cursor-pointer hover:border-[#F28C3A]">
              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
              <span className="font-medium text-gray-700">Mom's House</span>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 cursor-pointer hover:border-[#F28C3A]">
              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
              <span className="font-medium text-gray-700">Central Market</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6 max-w-2xl">
          <h2 className="text-xl font-bold text-[#2A1B7A] flex items-center gap-2">
            <Settings className="h-6 w-6 text-[#F28C3A]" /> Delivery Preferences
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
              <div>
                <h4 className="font-medium text-gray-800">Contactless Delivery</h4>
                <p className="text-sm text-gray-500">Driver will leave the package at your door</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded text-[#F28C3A]" />
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
              <div>
                <h4 className="font-medium text-gray-800">SMS Notifications</h4>
                <p className="text-sm text-gray-500">Receive updates via text message</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-[#F28C3A]" />
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
              <div>
                <h4 className="font-medium text-gray-800">Default Payment Method</h4>
                <p className="text-sm text-gray-500">Select how you prefer to pay</p>
              </div>
              <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white">
                <option>Cash on Delivery</option>
                <option>Telebirr</option>
                <option>CBE Birr</option>
                <option>Credit Card</option>
              </select>
            </div>
          </div>
          
          <Button className="w-full bg-[#2A1B7A] hover:bg-[#2A1B7A]/90 rounded-xl h-12">
            Save Preferences
          </Button>
        </div>
      )}
    </div>
  );
}
