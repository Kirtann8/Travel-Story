import { useState } from "react";

import LOGO from "../assets/images/logo.svg";
import ProfileInfo from "./Cards/ProfileInfo";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "./Input/SearchBar";
import { HiMenu, HiX } from "react-icons/hi";
import { MdDashboard, MdHome } from "react-icons/md";
import PropTypes from "prop-types";

const Navbar = ({ userInfo, searchQuery, setSearchQuery, onSearchNote, handleClearSearch }) => {
  const isToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    handleClearSearch();
    setSearchQuery("");
  };

  return (
    <div className="bg-white flex items-center justify-between px-4 lg:px-6 py-3 drop-shadow sticky top-0 z-50">
      <img src={LOGO} alt="travel story" className="h-8 lg:h-9" />

      {isToken && (
        <>
          <div className="hidden md:flex items-center space-x-4">
            <SearchBar
              value={searchQuery}
              onChange={({ target }) => {
                setSearchQuery(target.value);
              }}
              handleSearch={handleSearch}
              onClearSearch={onClearSearch}
            />
            <div className="flex space-x-2">
              <button
                onClick={() => navigate('/dashboard')}
                className={`p-2 rounded-lg transition-colors ${
                  location.pathname === '/dashboard' 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Stories"
              >
                <MdHome className="text-xl" />
              </button>
              <button
                onClick={() => navigate('/analytics')}
                className={`p-2 rounded-lg transition-colors ${
                  location.pathname === '/analytics' 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Analytics"
              >
                <MdDashboard className="text-xl" />
              </button>
            </div>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <HiX className="text-xl text-gray-600" />
            ) : (
              <HiMenu className="text-xl text-gray-600" />
            )}
          </button>

          <div className="hidden md:block">
            <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
          </div>

          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden">
              <div className="p-4 space-y-4">
                <SearchBar
                  value={searchQuery}
                  onChange={({ target }) => {
                    setSearchQuery(target.value);
                  }}
                  handleSearch={handleSearch}
                  onClearSearch={onClearSearch}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className={`flex-1 p-3 rounded-lg transition-colors ${
                      location.pathname === '/dashboard' 
                        ? 'bg-primary text-white' 
                        : 'text-gray-600 bg-gray-100'
                    }`}
                  >
                    <MdHome className="text-xl mx-auto" />
                    <span className="text-sm block mt-1">Stories</span>
                  </button>
                  <button
                    onClick={() => navigate('/analytics')}
                    className={`flex-1 p-3 rounded-lg transition-colors ${
                      location.pathname === '/analytics' 
                        ? 'bg-primary text-white' 
                        : 'text-gray-600 bg-gray-100'
                    }`}
                  >
                    <MdDashboard className="text-xl mx-auto" />
                    <span className="text-sm block mt-1">Analytics</span>
                  </button>
                </div>
                <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
Navbar.propTypes = {
  userInfo: PropTypes.object,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  onSearchNote: PropTypes.func.isRequired,
  handleClearSearch: PropTypes.func.isRequired,
};

export default Navbar;
