import React from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';

export const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-[#1a1c20] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-burbank text-4xl mb-8">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* Profile Sidebar */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-purple-500 flex items-center justify-center text-4xl font-bold mb-4">
                JD
              </div>
              <h2 className="text-xl font-burbank mb-1">John Doe</h2>
              <p className="text-gray-400">Member since 2025</p>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-5 h-5" />
                <span>john@example.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-5 h-5" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-5 h-5" />
                <span>New York, USA</span>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="font-burbank text-2xl mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value="John"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value="Doe"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="font-burbank text-2xl mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value="john@example.com"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value="+1 (555) 123-4567"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="font-burbank text-2xl mb-4">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Email Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked />
                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Order Updates</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked />
                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};