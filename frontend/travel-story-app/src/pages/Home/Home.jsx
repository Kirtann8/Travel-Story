import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { MdAdd, MdDashboard, MdViewList, MdChat } from "react-icons/md";
import Modal from "react-modal";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import Dashboard from "./Dashboard";
import TravelAssistant from "../../components/TravelAssistant";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
import EmptyCard from "../../components/Cards/EmptyCard";

import { getEmptyCardImg, getEmptyCardMessage } from "../../utils/helper";

const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("dashboard"); // "dashboard" or "stories"

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  const [isTravelAssistantOpen, setIsTravelAssistantOpen] = useState(false);

  // Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        // Set user info if data exists
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        // Clear storage if unauthorized
        localStorage.clear();
        navigate("/login"); // Redirect to login
      }
    }
  };

  // Get all travel stories
  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  // Handle Edit Story Click
  const handleEdit = (data) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: data });
  };

  // Handle Travel Story Click
  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data });
  };

  // Handle Update Favourite
  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;

    try {
      const response = await axiosInstance.put(
        "/update-is-favourite/" + storyId,
        {
          isFavourite: !storyData.isFavourite,
        }
      );

      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");

        if (searchQuery) {
          onSearchStory(searchQuery);
        } else {
          getAllTravelStories();
        }
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  // Delete Story
  const deleteTravelStory = async (data) => {
    const storyId = data._id;

    try {
      const response = await axiosInstance.delete("/delete-story/" + storyId);

      if (response.data && !response.data.error) {
        toast.error("Story Deleted Successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllTravelStories();
      }
    } catch (error) {
      // Handle unexpected errors
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  //Search Story
  const onSearchStory = async (query) => {
    if (!query.trim()) {
      getAllTravelStories();
      return;
    }
    
    try {
      const response = await axiosInstance.get("/search", {
        params: { query },
      });

      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("Search failed. Please try again.");
    }
  };



  const handleClearSearch = () => {
    setSearchQuery("");
    getAllTravelStories();
  };

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />

      {/* View Toggle */}
      <div className="bg-white border-b px-4 py-3">
        <div className="container mx-auto flex space-x-4">
          <button
            onClick={() => setActiveView("dashboard")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === "dashboard"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <MdDashboard />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveView("stories")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === "stories"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <MdViewList />
            <span>Stories</span>
          </button>
          <button
            onClick={() => setIsTravelAssistantOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
          >
            <MdChat />
            <span>Travel Assistant</span>
          </button>

        </div>
      </div>

      {/* Content */}
      {activeView === "dashboard" ? (
        <Dashboard />
      ) : (
        <div className="container mx-auto px-4 py-6">
          {allStories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {allStories.map((item) => (
                <TravelStoryCard
                  key={item._id}
                  imgUrl={item.imageUrl}
                  title={item.title}
                  story={item.story}
                  date={item.visitedDate}
                  visitedLocation={item.visitedLocation}
                  isFavourite={item.isFavourite}
                  onClick={() => handleViewStory(item)}
                  onFavouriteClick={() => updateIsFavourite(item)}
                />
              ))}
            </div>
          ) : (
            <EmptyCard
              imgSrc={getEmptyCardImg("search")}
              message={getEmptyCardMessage("search")}
            />
          )}
        </div>
      )}

      {/* Add & Edit Travel Story Model */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      {/* View Travel Story Model */}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onClose={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
          }}
          onEditClick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
            handleEdit(openViewModal.data || null);
          }}
          onDeleteClick={() => {
            deleteTravelStory(openViewModal.data || null);
          }}
        />
      </Modal>

      {activeView === "stories" && (
        <>
          <button
            className="w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 fixed right-4 bottom-24 lg:right-10 lg:bottom-28 shadow-lg z-50"
            onClick={() => setIsTravelAssistantOpen(true)}
          >
            <MdChat className="text-[28px] lg:text-[32px] text-white" />
          </button>
          <button
            className="w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 fixed right-4 bottom-4 lg:right-10 lg:bottom-10 shadow-lg z-50"
            onClick={() => {
              setOpenAddEditModal({ isShown: true, type: "add", data: null });
            }}
          >
            <MdAdd className="text-[28px] lg:text-[32px] text-white" />
          </button>
        </>
      )}

      <TravelAssistant 
        isOpen={isTravelAssistantOpen}
        onClose={() => setIsTravelAssistantOpen(false)}
      />

      <ToastContainer />
    </>
  );
};

export default Home;
