import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white text-center py-4 border-t border-gray-200 text-sm text-gray-500">
      © {new Date().getFullYear()} مكتب الضبط – جميع الحقوق محفوظة
    </footer>
  );
};

export default Footer;
