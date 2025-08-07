import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const EmailVerification = () => {
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    let isMounted = true;
    
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link.");
        return;
      }

      try {
        const response = await axiosInstance.post("/verify-email", {
          token: token,
        });

        if (isMounted && response.data && response.data.message) {
          setStatus("success");
          setMessage(response.data.message);
          setTimeout(() => {
            if (isMounted) navigate("/login");
          }, 3000);
        }
      } catch (error) {
        if (isMounted) {
          setStatus("error");
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            setMessage(error.response.data.message);
          } else {
            setMessage("Email verification failed. Please try again.");
          }
        }
      }
    };

    verifyEmail();
    
    return () => {
      isMounted = false;
    };
  }, [token, navigate]);

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
                Email <br /> Verification
              </h4>
              <p className="text-sm text-white leading-5 mt-3">
                Verifying your email address to complete registration.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg shadow-cyan-200/20 text-center">
            <h4 className="text-xl font-semibold mb-6">Email Verification</h4>

            {status === "verifying" && (
              <div>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Verifying your email...</p>
              </div>
            )}

            {status === "success" && (
              <div>
                <div className="text-green-500 text-5xl mb-4">✓</div>
                <p className="text-green-600 mb-4">{message}</p>
                <p className="text-sm text-gray-500">Redirecting to login...</p>
              </div>
            )}

            {status === "error" && (
              <div>
                <div className="text-red-500 text-5xl mb-4">✗</div>
                <p className="text-red-600 mb-4">{message}</p>
                <button
                  className="btn-primary"
                  onClick={() => navigate("/login")}
                >
                  GO TO LOGIN
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tablet and Desktop Layout */}
        <div className="hidden lg:flex w-full max-w-6xl mx-auto">
          <div className="w-1/2 xl:w-2/4 h-[75vh] xl:h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-l-lg lg:rounded-lg p-6 lg:p-10 z-50">
            <div>
              <h4 className="text-3xl xl:text-5xl text-white font-semibold leading-tight xl:leading-[58px]">
                Email <br /> Verification
              </h4>
              <p className="text-sm xl:text-[15px] text-white leading-6 pr-4 xl:pr-7 mt-4">
                We're verifying your email address to complete your account setup.
              </p>
            </div>
          </div>

          <div className="w-1/2 xl:w-2/4 h-[75vh] bg-white rounded-r-lg relative p-8 xl:p-16 shadow-lg shadow-cyan-200/20 flex items-center">
            <div className="w-full text-center">
              <h4 className="text-xl xl:text-2xl font-semibold mb-6 xl:mb-7">Email Verification</h4>

              {status === "verifying" && (
                <div>
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-6"></div>
                  <p className="text-gray-600 text-lg">Verifying your email...</p>
                </div>
              )}

              {status === "success" && (
                <div>
                  <div className="text-green-500 text-6xl mb-6">✓</div>
                  <p className="text-green-600 mb-6 text-lg">{message}</p>
                  <p className="text-gray-500">Redirecting to login...</p>
                </div>
              )}

              {status === "error" && (
                <div>
                  <div className="text-red-500 text-6xl mb-6">✗</div>
                  <p className="text-red-600 mb-6 text-lg">{message}</p>
                  <button
                    className="btn-primary"
                    onClick={() => navigate("/login")}
                  >
                    GO TO LOGIN
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;