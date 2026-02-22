import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {

      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password });

        if (response.data.success) {
          setToken(response.data.data.token);
          localStorage.setItem('token', response.data.data.token);
          toast.success(response.data.message);

        } else {
          toast.error(response.data.message);
        }

      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password });
        if (response.data.success) {

          const token = response.data.data.token;
          setToken(token);
          localStorage.setItem('token', token);
          toast.success("Welcome back!");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || error.message;
      toast.error(errorMsg);
    }
  }

  const onGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Send the user info to your backend
      const response = await axios.post(backendUrl + '/api/user/google', {
        name: user.displayName,
        email: user.email,
      });

      if (response.data.success) {
        // Use the same path as your standard login
        const receivedToken = response.data.data.token; 
        setToken(receivedToken);
        localStorage.setItem('token', receivedToken);
        toast.success("Google Login Successful!");
        // Navigation is handled by your useEffect
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // Handle the case where the user closes the popup without signing in
      if (error.code === 'auth/popup-closed-by-user') {
        toast.info("Login cancelled");
      } else {
        console.error(error);
        toast.error("Google Sign-In Failed");
      }
    }
  };

  useEffect(() => {
   if(token){
    navigate('/');
   }
  }, [token])
  

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      {currentState === 'Login' ? '' : <input type="text" onChange={(e) => setName(e.target.value)} value={name} className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required />}
      <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
      <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className=' cursor-pointer'>Forget your password</p>
        {
          currentState === 'Login'
            ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p>
            : <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
        }
      </div>
      <button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
      <div className='flex flex-col items-center gap-2 mt-4 w-full'>
        <p className='text-gray-500 text-xs'>OR</p>
        <button 
          type="button" 
          onClick={onGoogleSignIn}
          className='flex items-center justify-center gap-2 border border-gray-800 w-full py-2 hover:bg-gray-50 transition'
        >
          <img className='w-5' src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" />
          Continue with Google
        </button>
      </div>
    </form>
  )
}

export default Login