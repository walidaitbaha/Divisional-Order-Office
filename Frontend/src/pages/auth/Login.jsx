import React, { useState } from 'react'
import { Button } from '../../components/UI/Button';
import { login } from '../../services/authServices';
import { useNavigate } from "react-router-dom";
import { Input } from '../../components/UI/Input';
import { useAppContext } from '../../context/AppContext';
import { Label } from '../../components/UI/Label';
import { Mail, Lock } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { setUser } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(formData);
      localStorage.setItem("token", response.data.token);
      if (response.data.user) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        if(response.data.user.role === 'admin'){
          navigate("/admin/devisions")
        } else if(response.data.user.role === 'chef_division'){
          navigate("/chef_division/home")
        } else if(response.data.user.role === 'saisie'){
          navigate("/saisie/home")
        }
      }
    } catch (err) {
      console.error("فشل تسجيل الدخول", err)
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8 text-center">
          <img 
            src="/images/logo.svg" 
            alt="Logo" 
            className="h-16 w-16 mx-auto mb-4"
          />
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">مكتب الضبط الرقمي</h1>
            <p className="text-sm text-gray-500">عمالة طاطا - وزارة الداخلية</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label text="البريد الإلكتروني" />
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label text="كلمة المرور" />
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="password"
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            text="تسجيل الدخول"
            loading={loading}
            className="w-full justify-center py-3"
          />

          <p className="text-sm text-gray-600 text-center mt-4">
            ليس لديك حساب؟{' '}
            <span className="text-blue-600 hover:text-blue-800">
              تواصل مع المسؤول
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}