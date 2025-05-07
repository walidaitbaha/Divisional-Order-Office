import React, { useState } from 'react';
import SideBar from './SlideBar';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import { Notification } from './Notification';

const Layout = () => {
  const [notification, setNotification] = useState({
    message: '',
    type: '',
    open: false,
  });

  const showNotification = (message, type) => {
    setNotification({ message, type, open: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, open: false }));
    }, 3000);
  };

  return (
    <div className="flex h-screen bg-gray-50" dir="rtl">
      {/* Sidebar on the right (in RTL it’s on the left visually) */}
      <SideBar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Notification */}
        {notification.open && (
          <Notification message={notification.message} type={notification.type} />
        )}

        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <Outlet context={{ showNotification }} />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
