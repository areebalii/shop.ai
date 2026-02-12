import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../components/exportVariables';


const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      const response = await axios.post(backendUrl + "/api/user/admin", { email, password });
      console.log(response.data);

  if (response.data.success) {

  const token = response.data.data.token;

  localStorage.setItem("token", token);
  setToken(token);

} else {

  toast.error(response.data.message);

}


    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-100">

        {/* Logo / Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Store<span className="text-blue-600">.ai</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Admin Control Panel</p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              type="email"
              placeholder="admin@store.ai"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transform active:scale-[0.98] transition-all duration-200 shadow-lg"
          >
            Login to Dashboard
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
            Secure Encrypted Session
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;