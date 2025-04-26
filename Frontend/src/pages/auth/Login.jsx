import React, { useState } from 'react'
import { Button } from '../../components/UI/Button';
import { login } from '../../services/authServices';
import { useNavigate } from "react-router-dom";
import { Input } from '../../components/UI/Input';
import { useAppContext } from '../../context/AppContext';
import { Label } from '../../components/UI/Label';

export const Login = () =>  {
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
        navigate("/admin/dashboard")
      } else if(response.data.user.role === 'chef_division'){
        navigate("/chef_division/home")
      }else if(response.data.user.role === 'saisie'){
        navigate("/saisie/home")
      }
    }
    } catch (err) {
      console.error("Login failed", err)
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-center items-center h-[100vh]">
        <div className="bg-dark border border-gray-300 rounded-md shadow-2xl flex flex-col justify-evenly w-[85%] h-[75%] sm:w-[500px] sm:h-[400px] p-3 sm:p-6">
          <div>
            <h1 className="text-4xl">Sign in</h1>
            <h4>Ask admin to create an account for you</h4>
          </div>
          <div>
            <Label text={"Email"} />
            <Input
              style="block"
              type={"email"}
              name={"email"}
              placholder={"ex:john00.0@exemple.com"}
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label text={"Password"} />
            <Input
              style="block"
              type={"password"}
              name={"password"}
              placholder={"********"}
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <Button type={"submit"} text={"Sign in"} loading={loading} />
        </div>
      </div>
    </form>
  );
}