import React, { useState } from 'react';
import { loginUser } from '../Service/AuthService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex justify-center items-center min-h-screen bg-orange-50">
      <div className="bg-orange-400 p-8 rounded-lg shadow-lg w-96">
        {isLogin ? <Login /> : <Signup />}
        <button
          className="mt-4 text-white hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
        </button>
      </div>
    </div>
  );
}

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const {login} = useAuth();

    const navigate = useNavigate();
  
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
      
        try {
          const response = await loginUser(username, password);
          console.log(response);
        //   login(response.data);
          if (response.error) {
            // Show error message if the response contains an error
            toast(response.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setErrorMessage(response.message);
          } else {
            // Successful login
            console.log(response);
            login(JSON.stringify(response.data)); // Adjust as per your response structure
            toast("Successfully logged in", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            navigate('/');
            setErrorMessage(null);
          }
        } catch (error) {
          // Handle unexpected errors
          toast("An unexpected error occurred", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setErrorMessage("An unexpected error occurred. Please try again.");
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      
  return (
    <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
      <h2 className="text-2xl text-white mb-6 text-center">Login</h2>
      <input
        type="username"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="p-3 rounded-md border border-white bg-white text-gray-700"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-3 rounded-md border border-white bg-white text-gray-700"
        required
      />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <button
      disabled={isLoading}
        type="submit"
        className="py-3 rounded-md bg-orange-600 text-white font-semibold hover:bg-orange-700"
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

const Signup = () => {
  return (
    <form className="flex flex-col space-y-4">
      <h2 className="text-2xl text-white mb-6 text-center">Sign Up</h2>
      <input
        type="text"
        placeholder="Username"
        className="p-3 rounded-md border border-white bg-white text-gray-700"
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="p-3 rounded-md border border-white bg-white text-gray-700"
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="p-3 rounded-md border border-white bg-white text-gray-700"
        required
      />
      <button
        type="submit"
        className="py-3 rounded-md bg-orange-600 text-white font-semibold hover:bg-orange-700"
      >
        Sign Up
      </button>
    </form>
  );
};

export default Auth;
