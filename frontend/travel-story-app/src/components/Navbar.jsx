import { useState } from "react";

import LOGO from "../assets/images/logo.svg";
import ProfileInfo from "./Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "./Input/SearchBar";
import { HiMenu, HiX } from "react-icons/hi";
import PropTypes from "prop-types";

const Navbar = ({ userInfo, searchQuery, setSearchQuery, onSearchNote, handleClearSearch }) => {
  const isToken = localStorage.getItem("token");
  const navigate = useNavigate();
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
          <div className="hidden md:block">
            <SearchBar
              value={searchQuery}
              onChange={({ target }) => {
                setSearchQuery(target.value);
              }}
              handleSearch={handleSearch}
              onClearSearch={onClearSearch}
            />
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
