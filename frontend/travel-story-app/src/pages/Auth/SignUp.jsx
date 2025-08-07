import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
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

    //SignUp API Call
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
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
          <div className="bg-signup-bg-img bg-cover bg-center rounded-lg p-6 mb-6 min-h-[200px] flex items-end">
            <div>
              <h4 className="text-2xl sm:text-3xl text-white font-semibold leading-tight">
                Join the <br />
                Adventure
              </h4>
              <p className="text-sm text-white leading-5 mt-3">
                Create an account to start documenting your travels and preserving your memories.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg shadow-cyan-200/20">
            <form onSubmit={handleSignUp}>
              <h4 className="text-xl font-semibold mb-6 text-center">Sign Up</h4>

              <input
                type="text"
                placeholder="Full Name"
                className="input-box"
                value={name}
                onChange={({ target }) => {
                  setName(target.value);
                }}
              />

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
                placeholder="Password"
              />

              <PasswordInput
                value={confirmPassword}
                onChange={({ target }) => {
                  setConfirmPassword(target.value);
                }}
                placeholder="Confirm Password"
              />

              {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
              {isEmailSent && (
                <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
                  <p className="text-green-600 text-sm font-medium mb-2">
                    Registration successful!
                  </p>
                  <p className="text-green-600 text-xs">
                    Please check your email and click the verification link to activate your account.
                  </p>
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={isEmailSent}>
                {isEmailSent ? "EMAIL SENT" : "CREATE ACCOUNT"}
              </button>

              <p className="text-xs text-slate-500 text-center my-4">Or</p>

              <button
                type="button"
                className="btn-primary btn-light"
                onClick={() => {
                  navigate("/login");
                }}
              >
                LOGIN
              </button>
            </form>
          </div>
        </div>

        <div className="hidden lg:flex w-full max-w-6xl mx-auto">
          <div className="w-1/2 xl:w-2/4 h-[75vh] xl:h-[90vh] flex items-end bg-signup-bg-img bg-cover bg-center rounded-l-lg lg:rounded-lg p-6 lg:p-10 z-50">
            <div>
              <h4 className="text-3xl xl:text-5xl text-white font-semibold leading-tight xl:leading-[58px]">
                Join the <br />
                Adventure
              </h4>
              <p className="text-sm xl:text-[15px] text-white leading-6 pr-4 xl:pr-7 mt-4">
                Create an account to start documenting your travels and preserving
                your memories in your personal travel journal.
              </p>
            </div>
          </div>

          <div className="w-1/2 xl:w-2/4 h-[75vh] bg-white rounded-r-lg relative p-8 xl:p-16 shadow-lg shadow-cyan-200/20 flex items-center">
            <form onSubmit={handleSignUp} className="w-full">
              <h4 className="text-xl xl:text-2xl font-semibold mb-6 xl:mb-7">Sign Up</h4>

              <input
                type="text"
                placeholder="Full Name"
                className="input-box"
                value={name}
                onChange={({ target }) => {
                  setName(target.value);
                }}
              />

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
                placeholder="Password"
              />

              <PasswordInput
                value={confirmPassword}
                onChange={({ target }) => {
                  setConfirmPassword(target.value);
                }}
                placeholder="Confirm Password"
              />

              {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
              {isEmailSent && (
                <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
                  <p className="text-green-600 text-sm font-medium mb-2">
                    Registration successful!
                  </p>
                  <p className="text-green-600 text-xs">
                    Please check your email and click the verification link to activate your account.
                  </p>
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={isEmailSent}>
                {isEmailSent ? "EMAIL SENT" : "CREATE ACCOUNT"}
              </button>

              <p className="text-xs text-slate-500 text-center my-4">Or</p>

              <button
                type="button"
                className="btn-primary btn-light"
                onClick={() => {
                  navigate("/login");
                }}
              >
                LOGIN
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;