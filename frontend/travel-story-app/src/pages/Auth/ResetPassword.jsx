import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();
  const { token } = useParams();

  console.log("ResetPassword component loaded with token:", token);
  console.log("Token length:", token ? token.length : 0);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password) {
      setError("Please enter the new password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");

    console.log("Reset password attempt:", { token, password: password ? "present" : "missing" });

    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    try {
      const response = await axiosInstance.post("/reset-password", {
        token: token,
        password: password,
      });

      if (response.data && response.data.message) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
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
        {/* Mobile Layout */}
        <div className="w-full max-w-md mx-auto lg:hidden">
          <div className="bg-login-bg-img bg-cover bg-center rounded-lg p-6 mb-6 min-h-[200px] flex items-end">
            <div>
              <h4 className="text-2xl sm:text-3xl text-white font-semibold leading-tight">
                Create New <br /> Password
              </h4>
              <p className="text-sm text-white leading-5 mt-3">
                Enter your new password to complete the reset process.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg shadow-cyan-200/20">
            <form onSubmit={handleResetPassword}>
              <h4 className="text-xl font-semibold mb-6 text-center">Reset Password</h4>

              <PasswordInput
                value={password}
                onChange={({ target }) => {
                  setPassword(target.value);
                }}
                placeholder="New Password"
              />

              <PasswordInput
                value={confirmPassword}
                onChange={({ target }) => {
                  setConfirmPassword(target.value);
                }}
                placeholder="Confirm New Password"
              />

              {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
              {isSuccess && (
                <p className="text-green-500 text-xs pb-1">
                  Password reset successful! Redirecting to login...
                </p>
              )}

              <button type="submit" className="btn-primary" disabled={isSuccess}>
                {isSuccess ? "SUCCESS" : "RESET PASSWORD"}
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

        {/* Tablet and Desktop Layout */}
        <div className="hidden lg:flex w-full max-w-6xl mx-auto">
          <div className="w-1/2 xl:w-2/4 h-[75vh] xl:h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-l-lg lg:rounded-lg p-6 lg:p-10 z-50">
            <div>
              <h4 className="text-3xl xl:text-5xl text-white font-semibold leading-tight xl:leading-[58px]">
                Create New <br /> Password
              </h4>
              <p className="text-sm xl:text-[15px] text-white leading-6 pr-4 xl:pr-7 mt-4">
                Enter your new password to complete the reset process and regain access to your account.
              </p>
            </div>
          </div>

          <div className="w-1/2 xl:w-2/4 h-[75vh] bg-white rounded-r-lg relative p-8 xl:p-16 shadow-lg shadow-cyan-200/20 flex items-center">
            <form onSubmit={handleResetPassword} className="w-full">
              <h4 className="text-xl xl:text-2xl font-semibold mb-6 xl:mb-7">Reset Password</h4>

              <PasswordInput
                value={password}
                onChange={({ target }) => {
                  setPassword(target.value);
                }}
                placeholder="New Password"
              />

              <PasswordInput
                value={confirmPassword}
                onChange={({ target }) => {
                  setConfirmPassword(target.value);
                }}
                placeholder="Confirm New Password"
              />

              {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
              {isSuccess && (
                <p className="text-green-500 text-xs pb-1">
                  Password reset successful! Redirecting to login...
                </p>
              )}

              <button type="submit" className="btn-primary" disabled={isSuccess}>
                {isSuccess ? "SUCCESS" : "RESET PASSWORD"}
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

export default ResetPassword;