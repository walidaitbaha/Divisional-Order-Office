import { useAppContext } from "../../context/AppContext";

const Header = () => {
  const { user } = useAppContext(); 

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">لوحة التحكم</h1>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600 font-medium">
          <span className="text-blue-600">{user?.name || 'المستخدم'}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
          {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'م'}
        </div>
      </div>
    </header>
  );
};

export default Header;
