"use client";

import React, { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Mail, Phone, MapPin, Calendar, Settings, ShoppingBag, Heart, CreditCard, Bell, Shield, Edit, Save, X } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  joinedDate: string;
  avatar?: string;
  addresses: Address[];
  orderCount: number;
  totalSpent: number;
  wishlistCount: number;
}

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: ''
  });

  // Mock user data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProfile: UserProfile = {
        id: "user123",
        email: "raj.patel@example.com",
        firstName: "Raj",
        lastName: "Patel",
        phone: "+91 98765 43210",
        dateOfBirth: "1990-05-15",
        gender: "male",
        joinedDate: "2023-01-15",
        orderCount: 24,
        totalSpent: 125497.50,
        wishlistCount: 8,
        addresses: [
          {
            id: "addr1",
            type: 'home',
            fullName: "Raj Patel",
            address: "123 MG Road, Bandra West",
            city: "Mumbai",
            state: "Maharashtra",
            postalCode: "400050",
            country: "India",
            isDefault: true
          },
          {
            id: "addr2",
            type: 'work',
            fullName: "Raj Patel",
            address: "Tech Park, Sector 5, Powai",
            city: "Mumbai",
            state: "Maharashtra",
            postalCode: "400076",
            country: "India",
            isDefault: false
          }
        ]
      };
      setProfile(mockProfile);
      setFormData({
        firstName: mockProfile.firstName,
        lastName: mockProfile.lastName,
        phone: mockProfile.phone || '',
        dateOfBirth: mockProfile.dateOfBirth || '',
        gender: mockProfile.gender || ''
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleSave = () => {
    if (profile) {
      setProfile({
        ...profile,
        ...formData
      });
      setEditMode(false);
      // Here you would typically make an API call to save the data
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth || '',
        gender: profile.gender || ''
      });
    }
    setEditMode(false);
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="bg-white rounded-lg p-6 mb-6">
                <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </AuthGuard>
    );
  }

  if (!profile) return null;

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'addresses', name: 'Addresses', icon: MapPin },
    { id: 'orders', name: 'Order History', icon: ShoppingBag },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'preferences', name: 'Preferences', icon: Settings }
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profile.firstName[0]}{profile.lastName[0]}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-gray-600 flex items-center mt-1">
                  <Mail size={16} className="mr-2" />
                  {profile.email}
                </p>
                <p className="text-gray-600 flex items-center mt-1">
                  <Calendar size={16} className="mr-2" />
                  Member since {new Date(profile.joinedDate).toLocaleDateString('en-IN')}
                </p>
              </div>
              <div className="text-right">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{profile.orderCount}</div>
                    <div className="text-sm text-gray-600">Orders</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      ₹{profile.totalSpent.toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-gray-600">Spent</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{profile.wishlistCount}</div>
                    <div className="text-sm text-gray-600">Wishlist</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm">
                <nav className="p-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{tab.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                      {!editMode ? (
                        <button
                          onClick={() => setEditMode(true)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Edit size={16} />
                          <span>Edit Profile</span>
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSave}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Save size={16} />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={handleCancel}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <X size={16} />
                            <span>Cancel</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{profile.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{profile.lastName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <p className="text-gray-900 py-2">{profile.email}</p>
                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        {editMode ? (
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{profile.phone || 'Not provided'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        {editMode ? (
                          <input
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">
                            {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('en-IN') : 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        {editMode ? (
                          <select
                            value={formData.gender}
                            onChange={(e) => setFormData({...formData, gender: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                          </select>
                        ) : (
                          <p className="text-gray-900 py-2 capitalize">
                            {profile.gender || 'Not provided'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Add New Address
                      </button>
                    </div>

                    <div className="space-y-4">
                      {profile.addresses.map((address) => (
                        <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  address.type === 'home' ? 'bg-green-100 text-green-800' :
                                  address.type === 'work' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {address.type.toUpperCase()}
                                </span>
                                {address.isDefault && (
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                    DEFAULT
                                  </span>
                                )}
                              </div>
                              <h3 className="font-semibold text-gray-900">{address.fullName}</h3>
                              <p className="text-gray-600">
                                {address.address}, {address.city}, {address.state} {address.postalCode}
                              </p>
                              <p className="text-gray-600">{address.country}</p>
                            </div>
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                Edit
                              </button>
                              <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
                    <div className="text-center py-12">
                      <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-600">
                        Your order history will appear here. 
                        <br />
                        <a href="/orders" className="text-blue-600 hover:text-blue-800 font-medium">
                          View all orders →
                        </a>
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Password</h3>
                        <p className="text-gray-600 mb-4">Change your account password</p>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Change Password
                        </button>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Two-Factor Authentication</h3>
                        <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          Enable 2FA
                        </button>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Login Activity</h3>
                        <p className="text-gray-600 mb-4">Monitor recent login activity</p>
                        <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                          View Activity
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Preferences</h2>
                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input type="checkbox" defaultChecked className="mr-3" />
                            <span>Email notifications for orders</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" defaultChecked className="mr-3" />
                            <span>SMS notifications for shipping updates</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-3" />
                            <span>Marketing emails and promotions</span>
                          </label>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Language & Region</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Language
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                              <option>English</option>
                              <option>Hindi</option>
                              <option>Marathi</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Currency
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                              <option>INR (₹)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
