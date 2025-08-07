import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    //Login API Call
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      // Handle successful login response
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      // Handle login error
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-cyan-50 overflow-hidden relative">
      {/* Background decorative elements - hidden on mobile */}
      <div className="login-ui-box right-10 -top-40 hidden lg:block" />
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2 hidden lg:block" />

      <div className="container min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-20 mx-auto">
        {/* Mobile Layout */}
        <div className="w-full max-w-md mx-auto lg:hidden">
          {/* Hero Section for Mobile */}
          <div className="bg-login-bg-img bg-cover bg-center rounded-lg p-6 mb-6 min-h-[200px] flex items-end">
            <div>
              <h4 className="text-2xl sm:text-3xl text-white font-semibold leading-tight">
                Capture Your <br /> Journeys
              </h4>
              <p className="text-sm text-white leading-5 mt-3">
                Record your travel experiences and memories in your personal travel journal.
              </p>
            </div>
          </div>
          
          {/* Form Section for Mobile */}
          <div className="bg-white rounded-lg p-6 shadow-lg shadow-cyan-200/20">
            <form onSubmit={handleLogin}>
              <h4 className="text-xl font-semibold mb-6 text-center">Login</h4>

              <input
                type="text"
                placeholder="Email"
                className="input-box"
                value={email}
                onChange={({ target }) => {
                  setEmail(target.value);
                }}
              />

              <PasswordInput
                value={password}
                onChange={({ target }) => {
                  setPassword(target.value);
                }}
              />

              {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

              <div className="text-right mb-4">
                <button
                  type="button"
                  className="text-xs text-cyan-500 hover:text-cyan-700 underline"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </button>
              </div>

              <button type="submit" className="btn-primary">
                LOGIN
              </button>

              <p className="text-xs text-slate-500 text-center my-4">Or</p>

              <button
                type="button"
                className="btn-primary btn-light"
                onClick={() => {
                  navigate("/signUp");
                }}
              >
                CREATE ACCOUNT
              </button>
            </form>
          </div>
        </div>

        {/* Tablet and Desktop Layout */}
        <div className="hidden lg:flex w-full max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="w-1/2 xl:w-2/4 h-[75vh] xl:h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-l-lg lg:rounded-lg p-6 lg:p-10 z-50">
            <div>
              <h4 className="text-3xl xl:text-5xl text-white font-semibold leading-tight xl:leading-[58px]">
                Capture Your <br /> Journeys
              </h4>
              <p className="text-sm xl:text-[15px] text-white leading-6 pr-4 xl:pr-7 mt-4">
                Record your travel experiences and memories in your personal
                travel journal.
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-1/2 xl:w-2/4 h-[75vh] bg-white rounded-r-lg relative p-8 xl:p-16 shadow-lg shadow-cyan-200/20 flex items-center">
            <form onSubmit={handleLogin} className="w-full">
              <h4 className="text-xl xl:text-2xl font-semibold mb-6 xl:mb-7">Login</h4>

              <input
                type="text"
                placeholder="Email"
                className="input-box"
                value={email}
                onChange={({ target }) => {
                  setEmail(target.value);
                }}
              />

              <PasswordInput
                value={password}
                onChange={({ target }) => {
                  setPassword(target.value);
                }}
              />

              {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

              <div className="text-right mb-4">
                <button
                  type="button"
                  className="text-xs text-cyan-500 hover:text-cyan-700 underline"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </button>
              </div>

              <button type="submit" className="btn-primary">
                LOGIN
              </button>

              <p className="text-xs text-slate-500 text-center my-4">Or</p>

              <button
                type="button"
                className="btn-primary btn-light"
                onClick={() => {
                  navigate("/signUp");
                }}
              >
                CREATE ACCOUNT
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;