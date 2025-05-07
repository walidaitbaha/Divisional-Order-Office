import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaInbox,
  FaUser,
  FaSignOutAlt,
  FaChevronRight,
  FaTachometerAlt,
  FaBuilding,
  FaExchangeAlt,
  FaChevronLeft
} from 'react-icons/fa';
import { Logout } from '../../services/authServices';

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathSegments = location.pathname.split('/');
  const basePath = pathSegments[1];

  const linkClass = (path) =>
    `flex items-center gap-3 p-3 rounded-lg transition-colors
     hover:bg-blue-50 hover:text-blue-600
     ${location.pathname === path
       ? 'bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-500'
       : 'text-gray-600'}`;

  const logout = async () => {
    try {
      await Logout(); 
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-5 pb-3 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800"> مكتب الضبط الرقمي</h2>
        <p className="text-sm text-gray-500 mt-1">إدارة المراسلات</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {basePath === 'admin' && (
          <>
            <a href="/admin/devisions" className={linkClass('/admin/devisions')}>
              <FaBuilding className="w-5 h-5" />
              <span> الإدارات الداخلية</span>
              <FaChevronLeft className="w-3 h-3 ml-auto" />
            </a>
            <a href="/admin/courriers" className={linkClass('/admin/courriers')}>
              <FaInbox className="w-5 h-5" />
              <span>المراسلات</span>
              <FaChevronLeft className="w-3 h-3 ml-auto" />
            </a>
            <a href="/admin/courriersdeleted" className={linkClass('/admin/courriersdeleted')}>
              <FaExchangeAlt className="w-5 h-5" />
              <span>الرسائل المحذوفة</span>
              <FaChevronLeft className="w-3 h-3 ml-auto" />
            </a>
            <a href="/admin/utilisateurs" className={linkClass('/admin/utilisateurs')}>
              <FaUser className="w-5 h-5" />
              <span>المستخدمون</span>
              <FaChevronLeft className="w-3 h-3 ml-auto" />
            </a>
            <a href="/admin/expDes" className={linkClass('/admin/expDes')}>
              <FaBuilding className="w-5 h-5" />
              <span>الإدارات الخارجية</span>
              <FaChevronRight className="w-3 h-3 ml-auto" />
            </a>
          </>
        )}
        {basePath === 'chef_division' && (
          <a
            href="/chef_division/home"
            className={`flex items-center gap-2 p-2 rounded hover:bg-gray-100 ${
              location.pathname === '/chef_division/home' ? 'bg-gray-200' : ''
            }`}
          >
            <FaInbox /> المراسلات
          </a>
        )}
        {basePath === 'saisie' && (
          <a
            href="/saisie/home"
            className={`flex items-center gap-2 p-2 rounded hover:bg-gray-100 ${
              location.pathname === '/saisie/home' ? 'bg-gray-200' : ''
            }`}
          >
            <FaInbox /> المراسلات
          </a>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 text-red-600 hover:text-red-700 p-2 rounded-lg transition-colors"
        >
          <FaSignOutAlt className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
