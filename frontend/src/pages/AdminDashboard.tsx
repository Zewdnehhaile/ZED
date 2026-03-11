import React, { useState, useEffect } from 'react';
import { Users, Truck, Package, CheckCircle, XCircle, BarChart3, Map, Settings, Search, Filter, ShoppingBag, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

type TabType = 'overview' | 'orders' | 'drivers' | 'customers' | 'products' | 'reports' | 'operations';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [delRes, drvRes, usrRes] = await Promise.all([
        fetch('/api/deliveries', { headers }),
        fetch('/api/drivers', { headers }),
        fetch('/api/users', { headers }),
      ]);

      if (delRes.ok) setDeliveries(await delRes.json());
      if (drvRes.ok) setDrivers(await drvRes.json());
      if (usrRes.ok) setUsers(await usrRes.json());
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateDriverStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/drivers/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error('Failed to update driver status', error);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading admin dashboard...</div>;

  const totalRevenue = deliveries.filter(d => d.delivery_status === 'delivered').reduce((acc, curr) => acc + curr.price, 0);

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-2xl text-blue-600">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Users</p>
            <p className="text-2xl font-bold text-[#2A1B7A]">{users.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-indigo-100 p-4 rounded-2xl text-indigo-600">
            <Truck className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Drivers</p>
            <p className="text-2xl font-bold text-[#2A1B7A]">{drivers.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-orange-100 p-4 rounded-2xl text-[#F28C3A]">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Deliveries</p>
            <p className="text-2xl font-bold text-[#2A1B7A]">{deliveries.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-4 rounded-2xl text-green-600">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-[#2A1B7A]">{totalRevenue.toLocaleString()} ETB</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#2A1B7A]">Recent Deliveries</h2>
            <Button variant="outline" size="sm" onClick={() => setActiveTab('orders')}>View All</Button>
          </div>
          <div className="divide-y divide-gray-100">
            {deliveries.slice(0, 5).map(delivery => (
              <div key={delivery.id} className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-900">{delivery.parcel_description}</h4>
                  <span className="text-sm font-bold text-[#F28C3A]">{delivery.price} ETB</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {delivery.pickup_location} → {delivery.drop_location}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                      {delivery.delivery_status.replace('_', ' ')}
                    </span>
                    <Button 
                      onClick={() => navigate(`/tracking/${delivery.id}`)}
                      size="sm" 
                      className="bg-[#2A1B7A] hover:bg-[#2A1B7A]/90 text-white h-6 px-2 text-xs"
                    >
                      Track
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {deliveries.length === 0 && <div className="p-6 text-center text-gray-500">No deliveries found.</div>}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#2A1B7A]">Pending Driver Applications</h2>
            <Button variant="outline" size="sm" onClick={() => setActiveTab('drivers')}>Manage</Button>
          </div>
          <div className="divide-y divide-gray-100">
            {drivers.filter(d => d.status === 'pending').map(driver => (
              <div key={driver.id} className="p-6 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">{driver.name}</h4>
                  <p className="text-sm text-gray-500">{driver.email} • {driver.phone}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateDriverStatus(driver.id, 'approved')} className="p-2 text-green-600 hover:bg-green-50 rounded-full">
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button onClick={() => updateDriverStatus(driver.id, 'rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {drivers.filter(d => d.status === 'pending').length === 0 && <div className="p-6 text-center text-gray-500">No pending applications.</div>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-[#2A1B7A]">Order Management</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search orders..." className="pl-9 h-10" />
          </div>
          <Button variant="outline" className="h-10 px-3"><Filter className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Order ID</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Details</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {deliveries.map(delivery => (
              <tr key={delivery.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 text-sm font-medium text-gray-900">#{delivery.id.toString().padStart(5, '0')}</td>
                <td className="p-4 text-sm text-gray-600">{delivery.sender_name || 'Customer'}</td>
                <td className="p-4 text-sm text-gray-600 max-w-xs truncate">{delivery.parcel_description}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    delivery.delivery_status === 'delivered' ? 'bg-green-100 text-green-800' :
                    delivery.delivery_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {delivery.delivery_status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 text-sm font-bold text-[#F28C3A]">{delivery.price} ETB</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View</Button>
                    <Button 
                      onClick={() => navigate(`/tracking/${delivery.id}`)}
                      size="sm" 
                      className="bg-[#2A1B7A] hover:bg-[#2A1B7A]/90 text-white"
                    >
                      Track
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {deliveries.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-500">No orders found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDrivers = () => (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-[#2A1B7A]">Driver Management</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search drivers..." className="pl-9 h-10" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Driver</th>
              <th className="p-4 font-medium">Contact</th>
              <th className="p-4 font-medium">Vehicle</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {drivers.map(driver => (
              <tr key={driver.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-gray-900">{driver.name}</div>
                  <div className="text-xs text-gray-500">ID: {driver.id}</div>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  <div>{driver.phone}</div>
                  <div className="text-xs">{driver.email}</div>
                </td>
                <td className="p-4 text-sm text-gray-600 capitalize">{driver.vehicle_type}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    driver.status === 'approved' ? 'bg-green-100 text-green-800' :
                    driver.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {driver.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {driver.status === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => updateDriverStatus(driver.id, 'approved')} className="bg-green-600 hover:bg-green-700 text-white">Approve</Button>
                        <Button size="sm" variant="outline" onClick={() => updateDriverStatus(driver.id, 'rejected')} className="text-red-600 border-red-200 hover:bg-red-50">Reject</Button>
                      </>
                    )}
                    {driver.status !== 'pending' && (
                      <Button variant="outline" size="sm">Details</Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {drivers.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">No drivers found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-[#2A1B7A]">Customer Management</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search customers..." className="pl-9 h-10" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Contact</th>
              <th className="p-4 font-medium">Joined</th>
              <th className="p-4 font-medium">Orders</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.filter(u => u.role === 'customer').map(customer => (
              <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-gray-900">{customer.name}</div>
                  <div className="text-xs text-gray-500">ID: {customer.id}</div>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  <div>{customer.phone || 'N/A'}</div>
                  <div className="text-xs">{customer.email}</div>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {format(new Date(customer.created_at || new Date()), 'MMM d, yyyy')}
                </td>
                <td className="p-4 text-sm font-bold text-[#2A1B7A]">
                  {deliveries.filter(d => d.sender_id === customer.id).length}
                </td>
                <td className="p-4">
                  <Button variant="outline" size="sm">View</Button>
                </td>
              </tr>
            ))}
            {users.filter(u => u.role === 'customer').length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">No customers found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-[#2A1B7A]">ZED Store Inventory</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search products..." className="pl-9 h-10" />
          </div>
          <Button className="bg-[#F28C3A] hover:bg-[#F28C3A]/90 text-white h-10">Add Product</Button>
        </div>
      </div>
      <div className="p-12 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-500">Inventory Management</h3>
        <p className="text-gray-400 max-w-sm mx-auto mt-2">Product listing and inventory management interface is being connected to the database.</p>
      </div>
    </div>
  );

  const renderOperations = () => (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300 h-[600px] flex flex-col">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#2A1B7A] flex items-center gap-2">
          <Map className="h-5 w-5 text-[#F28C3A]" /> Live Operations Map
        </h2>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-sm text-gray-600"><span className="w-3 h-3 rounded-full bg-green-500"></span> Active Drivers (12)</span>
          <span className="flex items-center gap-1 text-sm text-gray-600"><span className="w-3 h-3 rounded-full bg-orange-500"></span> Pending Orders (5)</span>
        </div>
      </div>
      <div className="flex-1 bg-gray-100 relative flex items-center justify-center">
        {/* Placeholder for actual map integration */}
        <div className="text-center space-y-4">
          <Map className="h-16 w-16 text-gray-300 mx-auto" />
          <h3 className="text-xl font-bold text-gray-500">Map Integration Pending</h3>
          <p className="text-gray-400 max-w-sm mx-auto">The live tracking map requires a Google Maps API key or similar service to be configured.</p>
          <Button variant="outline" className="mt-4">Configure Map Provider</Button>
        </div>
        
        {/* Mock Map Elements */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-md"></div>
        <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md animate-pulse"></div>
      </div>
    </div>
  );

  const renderPlaceholder = (title: string, icon: React.ReactNode) => (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center animate-in fade-in duration-300">
      <div className="flex justify-center mb-4 text-gray-300">{icon}</div>
      <h2 className="text-2xl font-bold text-[#2A1B7A] mb-2">{title} Management</h2>
      <p className="text-gray-500 max-w-md mx-auto">This module is currently under development. Check back soon for full functionality.</p>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <Package className="w-4 h-4" /> },
    { id: 'drivers', label: 'Drivers', icon: <Truck className="w-4 h-4" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'products', label: 'ZED Store', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'operations', label: 'Live Map', icon: <Map className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2A1B7A]">Admin Control Center</h1>
          <p className="text-gray-500 mt-1">Manage operations, users, and store inventory</p>
        </div>
        <Button variant="outline" className="bg-white"><Settings className="w-4 h-4 mr-2" /> Settings</Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-[#F28C3A] text-[#F28C3A]'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'drivers' && renderDrivers()}
        {activeTab === 'customers' && renderCustomers()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'operations' && renderOperations()}
        {activeTab === 'reports' && renderPlaceholder('Analytics & Reports', <BarChart3 className="w-16 h-16" />)}
      </div>
    </div>
  );
}
