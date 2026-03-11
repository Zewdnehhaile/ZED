import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Package, MapPin, Phone, Truck, CheckCircle, Clock, DollarSign, Star, Camera, QrCode, Navigation, ToggleLeft, ToggleRight, FileText, Upload, Wallet, Award, Gift, Plus, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';

export default function DriverDashboard() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'earnings' | 'application' | 'wallet' | 'loyalty'>('dashboard');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isApproved, setIsApproved] = useState(true); // Mock approval status
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

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

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/deliveries/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchDeliveries();
    } catch (error) {
      console.error('Failed to update status', error);
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

  const myDeliveries = deliveries.filter(d => d.driver_id === user?.id);
  const availableDeliveries = deliveries.filter(d => d.delivery_status === 'pending');

  if (!isApproved) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#2A1B7A]">Driver Application</h1>
          <p className="text-gray-500">Complete your profile to start earning with Zemen Express</p>
        </div>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#2A1B7A]">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" className="border border-gray-300 rounded-xl px-4 py-3" />
              <input type="text" placeholder="Phone Number" className="border border-gray-300 rounded-xl px-4 py-3" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#2A1B7A]">Vehicle Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select className="border border-gray-300 rounded-xl px-4 py-3 bg-white">
                <option>Motorcycle</option>
                <option>Car</option>
                <option>Van</option>
                <option>Truck</option>
              </select>
              <input type="text" placeholder="License Plate Number" className="border border-gray-300 rounded-xl px-4 py-3" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#2A1B7A]">Document Upload</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#F28C3A] cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Upload Driver's License</p>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#F28C3A] cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Upload ID Document</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5 rounded text-[#F28C3A]" />
              <span className="text-sm text-gray-700">I consent to a background check</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5 rounded text-[#F28C3A]" />
              <span className="text-sm text-gray-700">I agree to the Zemen Express Training Agreement</span>
            </label>
          </div>

          <Button onClick={() => setIsApproved(true)} className="w-full bg-[#F28C3A] hover:bg-[#F28C3A]/90 rounded-xl h-12 text-lg">
            Submit Application
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2A1B7A]">Driver Dashboard</h1>
          <p className="text-gray-500">Manage your deliveries and earnings</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <span className={`font-bold ${isAvailable ? 'text-green-600' : 'text-gray-400'}`}>
            {isAvailable ? 'Online' : 'Offline'}
          </span>
          <button onClick={() => setIsAvailable(!isAvailable)}>
            {isAvailable ? <ToggleRight className="h-8 w-8 text-green-600" /> : <ToggleLeft className="h-8 w-8 text-gray-400" />}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b border-gray-200 overflow-x-auto pb-2">
        <button onClick={() => setActiveTab('dashboard')} className={`pb-2 font-medium whitespace-nowrap ${activeTab === 'dashboard' ? 'text-[#2A1B7A] border-b-2 border-[#2A1B7A]' : 'text-gray-500 hover:text-gray-700'}`}>Active Deliveries</button>
        <button onClick={() => setActiveTab('earnings')} className={`pb-2 font-medium whitespace-nowrap ${activeTab === 'earnings' ? 'text-[#2A1B7A] border-b-2 border-[#2A1B7A]' : 'text-gray-500 hover:text-gray-700'}`}>Earnings & History</button>
        <button onClick={() => setActiveTab('wallet')} className={`pb-2 font-medium whitespace-nowrap ${activeTab === 'wallet' ? 'text-[#2A1B7A] border-b-2 border-[#2A1B7A]' : 'text-gray-500 hover:text-gray-700'}`}>Wallet</button>
        <button onClick={() => setActiveTab('loyalty')} className={`pb-2 font-medium whitespace-nowrap ${activeTab === 'loyalty' ? 'text-[#2A1B7A] border-b-2 border-[#2A1B7A]' : 'text-gray-500 hover:text-gray-700'}`}>Rewards</button>
      </div>

      {activeTab === 'dashboard' && (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-green-50 p-4 rounded-xl">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Today's Earnings</p>
                <p className="text-2xl font-bold text-gray-800">850 ETB</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Completed Today</p>
                <p className="text-2xl font-bold text-gray-800">5</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-yellow-50 p-4 rounded-xl">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Customer Rating</p>
                <p className="text-2xl font-bold text-gray-800">4.9 <span className="text-sm text-gray-400 font-normal">(120 reviews)</span></p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* My Assigned Deliveries */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#2A1B7A] flex items-center gap-2">
                <Truck className="h-6 w-6 text-[#F28C3A]" /> Active Delivery
              </h2>
              {loading ? (
                <div className="text-center py-12 text-gray-500">Loading...</div>
              ) : myDeliveries.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl text-center border border-gray-100 shadow-sm">
                  <p className="text-gray-500">You have no active deliveries.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myDeliveries.map((delivery) => (
                    <div key={delivery.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(delivery.delivery_status)}`}>
                          {delivery.delivery_status.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(delivery.created_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-bold text-[#2A1B7A] text-lg">{delivery.parcel_description}</h4>
                          <p className="text-sm text-gray-500">
                            {delivery.parcel_weight} kg • {delivery.service_type?.replace('_', ' ') || 'same day'}
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
                          <span className="text-sm">{delivery.receiver_phone}</span>
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

                      {delivery.delivery_status !== 'delivered' && delivery.delivery_status !== 'cancelled' && (
                        <div className="mt-6 flex flex-wrap gap-2">
                          {delivery.delivery_status === 'accepted' && (
                            <>
                              <Button className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200" variant="outline">
                                <Navigation className="w-4 h-4 mr-2" /> Navigate
                              </Button>
                              <Button onClick={() => updateStatus(delivery.id, 'picked_up')} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                                <QrCode className="w-4 h-4 mr-2" /> Scan & Pickup
                              </Button>
                            </>
                          )}
                          {delivery.delivery_status === 'picked_up' && (
                            <Button onClick={() => updateStatus(delivery.id, 'in_transit')} className="w-full bg-purple-600 hover:bg-purple-700">
                              Start Transit
                            </Button>
                          )}
                          {delivery.delivery_status === 'in_transit' && (
                            <>
                              <Button className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200" variant="outline">
                                <Navigation className="w-4 h-4 mr-2" /> Navigate
                              </Button>
                              <Button onClick={() => updateStatus(delivery.id, 'delivered')} className="flex-1 bg-green-600 hover:bg-green-700">
                                <Camera className="w-4 h-4 mr-2" /> Confirm Delivery
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Deliveries */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#2A1B7A] flex items-center gap-2">
                <Package className="h-6 w-6 text-[#F28C3A]" /> Nearby Requests
              </h2>
              {loading ? (
                <div className="text-center py-12 text-gray-500">Loading...</div>
              ) : availableDeliveries.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl text-center border border-gray-100 shadow-sm">
                  <p className="text-gray-500">No new deliveries available right now.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableDeliveries.map((delivery) => (
                    <div key={delivery.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-yellow-100 text-yellow-800 border-yellow-200">
                          New Request
                        </span>
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(delivery.created_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-bold text-[#2A1B7A] text-lg">{delivery.parcel_description}</h4>
                          <p className="text-sm text-gray-500">
                            {delivery.parcel_weight} kg • {delivery.service_type?.replace('_', ' ') || 'same day'}
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
                        <div className="font-bold text-[#F28C3A] text-lg">
                          {delivery.price} ETB
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">Reject</Button>
                          <Button onClick={() => updateStatus(delivery.id, 'accepted')} className="bg-[#2A1B7A] hover:bg-[#2A1B7A]/90">
                            Accept
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'earnings' && (
        <div className="space-y-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#2A1B7A] text-white p-6 rounded-2xl shadow-sm">
              <p className="text-white/80 font-medium">Available Balance</p>
              <h3 className="text-3xl font-bold mt-2">2,450 ETB</h3>
              <Button className="w-full mt-4 bg-white text-[#2A1B7A] hover:bg-gray-100">Request Payout</Button>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-500 font-medium">This Week</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">4,200 ETB</h3>
              <p className="text-sm text-green-500 mt-1">+12% from last week</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-500 font-medium">This Month</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">18,500 ETB</h3>
              <p className="text-sm text-gray-400 mt-1">45 deliveries completed</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#2A1B7A]">Transaction History</h3>
              <Button variant="outline" className="text-sm"><FileText className="w-4 h-4 mr-2" /> Download Tax Summary</Button>
            </div>
            <div className="divide-y divide-gray-100">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 flex justify-between items-center hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Delivery Payment</p>
                      <p className="text-sm text-gray-500">Order #100{i} • {format(new Date(), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                  <span className="font-bold text-green-600">+{150 * i} ETB</span>
                </div>
              ))}
            </div>
          </div>
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
                  { id: 1, type: 'Delivery Payment', date: 'Today, 10:30 AM', amount: 150, status: 'completed' },
                  { id: 2, type: 'Wallet Withdrawal', date: 'Yesterday, 2:15 PM', amount: -1000, status: 'completed' },
                  { id: 3, type: 'Delivery Payment', date: 'Mar 5, 2026', amount: 250, status: 'completed' },
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
    </div>
  );
}
