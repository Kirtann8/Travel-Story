import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post("/forgot-password", {
        email: email,
      });

      if (response.data && response.data.message) {
        setIsEmailSent(true);
      }
    } catch (error) {
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
      <div className="login-ui-box right-10 -top-40 hidden lg:block" />
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2 hidden lg:block" />

      <div className="container min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-20 mx-auto">
        <div className="w-full max-w-md mx-auto lg:hidden">
          <div className="bg-login-bg-img bg-cover bg-center rounded-lg p-6 mb-6 min-h-[200px] flex items-end">
            <div>
              <h4 className="text-2xl sm:text-3xl text-white font-semibold leading-tight">
                Reset Your <br /> Password
              </h4>
              <p className="text-sm text-white leading-5 mt-3">
                Enter your email to receive password reset instructions.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg shadow-cyan-200/20">
            <form onSubmit={handleForgotPassword}>
              <h4 className="text-xl font-semibold mb-6 text-center">Forgot Password</h4>

              <input
                type="text"
                placeholder="Email"
                className="input-box"
                value={email}
                onChange={({ target }) => {
                  setEmail(target.value);
                }}
              />

              {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
              {isEmailSent && (
                <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
                  <p className="text-green-600 text-sm font-medium mb-2">
                    Reset link sent!
                  </p>
                  <p className="text-green-600 text-xs">
                    Please check your email for password reset instructions.
                  </p>
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={isEmailSent}>
                {isEmailSent ? "EMAIL SENT" : "SEND RESET LINK"}
              </button>

              <p className="text-xs text-slate-500 text-center my-4">Or</p>

              <button
                type="button"
                className="btn-primary btn-light"
                onClick={() => {
                  navigate("/login");
                }}
              >
                BACK TO LOGIN
              </button>
            </form>
          </div>
        </div>

        <div className="hidden lg:flex w-full max-w-6xl mx-auto">
          <div className="w-1/2 xl:w-2/4 h-[75vh] xl:h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-l-lg lg:rounded-lg p-6 lg:p-10 z-50">
            <div>
              <h4 className="text-3xl xl:text-5xl text-white font-semibold leading-tight xl:leading-[58px]">
                Reset Your <br /> Password
              </h4>
              <p className="text-sm xl:text-[15px] text-white leading-6 pr-4 xl:pr-7 mt-4">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
            </div>
          </div>

          <div className="w-1/2 xl:w-2/4 h-[75vh] bg-white rounded-r-lg relative p-8 xl:p-16 shadow-lg shadow-cyan-200/20 flex items-center">
            <form onSubmit={handleForgotPassword} className="w-full">
              <h4 className="text-xl xl:text-2xl font-semibold mb-6 xl:mb-7">Forgot Password</h4>

              <input
                type="text"
                placeholder="Email"
                className="input-box"
                value={email}
                onChange={({ target }) => {
                  setEmail(target.value);
                }}
              />

              {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
              {isEmailSent && (
                <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
                  <p className="text-green-600 text-sm font-medium mb-2">
                    Reset link sent!
                  </p>
                  <p className="text-green-600 text-xs">
                    Please check your email for password reset instructions.
                  </p>
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={isEmailSent}>
                {isEmailSent ? "EMAIL SENT" : "SEND RESET LINK"}
              </button>

              <p className="text-xs text-slate-500 text-center my-4">Or</p>

              <button
                type="button"
                className="btn-primary btn-light"
                onClick={() => {
                  navigate("/login");
                }}
              >
                BACK TO LOGIN
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;