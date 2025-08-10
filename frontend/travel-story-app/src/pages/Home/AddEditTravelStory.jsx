import React, { useState } from "react";
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";
import ImageSelector from "../../components/Input/ImageSelector";
import TagInput from "../../components/Input/TagInput";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";
import uploadImage from "../../utils/uploadImage";
import { toast } from "react-toastify";
import { MdAutoAwesome, MdTitle } from "react-icons/md";

const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) => {
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
  const [story, setStory] = useState(storyInfo?.story || "");
  const [visitedLocation, setVisitedLocation] = useState(
    storyInfo?.visitedLocation || []
  );
  const [visitedDate, setVisitedDate] = useState(
    storyInfo?.visitedDate || null
  );
  const [spending, setSpending] = useState(storyInfo?.spending || 0);
  const [spendingCategory, setSpendingCategory] = useState(storyInfo?.spendingCategory || "Activities");
  const [tripDuration, setTripDuration] = useState(storyInfo?.tripDuration || 1);

  const [error, setError] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [titleSuggestions, setTitleSuggestions] = useState([]);
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);

  // Add New Travel Story
  const addNewTravelStory = async () => {
    try {
      let imageUrl = "";

      // Upload image if present
      if (storyImg) {
        const imgUploadRes = await uploadImage(storyImg);
        // Get image URL
        imageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post("/add-travel-story", {
        title,
        story,
        imageUrl: imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
        spending,
        spendingCategory,
        tripDuration
      });

      if (response.data && response.data.story) {
        toast.success("Story Added Successfully");
        // Refresh stories
        getAllTravelStories();
        // Trigger analytics refresh
        window.dispatchEvent(new Event('travelStoryUpdated'));
        // Close modal or form
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        // Handle unexpected errors
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Update Travel story
  const updateTravelStory = async () => {
    const storyId = storyInfo._id;

    try {
      let imageUrl = "";

      let postData = {
        title,
        story,
        imageUrl: storyInfo.imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
        spending,
        spendingCategory,
        tripDuration
      };

      if (typeof storyImg === "object") {
        // Upload New Image
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes?.imageUrl || "";

        postData = {
          ...postData,
          imageUrl: imageUrl,
        };
      }

      const response = await axiosInstance.put(
        "/edit-story/" + storyId,
        postData
      );

      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");
        // Refresh stories
        getAllTravelStories();
        // Trigger analytics refresh
        window.dispatchEvent(new Event('travelStoryUpdated'));
        // Close modal or form
        onClose();
      }
    } catch (error) {
      console.log(error);
      
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        // Handle unexpected errors
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleAddOrUpdateClick = () => {
    console.log("Input Data:", {
      title,
      storyImg,
      story,
      visitedLocation,
      visitedDate,
    });

    if (!title) {
      setError("Please enter the title");
      return;
    }

    if (!story) {
      setError("Please enter the story");
      return;
    }

    setError("");

    if (type === "edit") {
      updateTravelStory();
    } else {
      addNewTravelStory();
    }
  };

  // AI Enhancement Functions
  const handleEnhanceStory = async () => {
    if (!story.trim()) {
      toast.error('Please write a story first');
      return;
    }
    
    setIsEnhancing(true);
    try {
      const response = await axiosInstance.post('/enhance-story', { story });
      setStory(response.data.enhancedStory);
      toast.success('Story enhanced successfully!');
    } catch (error) {
      toast.error('Failed to enhance story');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateTitle = async () => {
    if (!story.trim()) {
      toast.error('Please write a story first');
      return;
    }
    
    setIsGeneratingTitle(true);
    try {
      const response = await axiosInstance.post('/generate-titles', { 
        story, 
        locations: visitedLocation 
      });
      setTitleSuggestions(response.data.titles);
      setShowTitleSuggestions(true);
    } catch (error) {
      toast.error('Failed to generate titles');
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const selectTitle = (selectedTitle) => {
    setTitle(selectedTitle);
    setShowTitleSuggestions(false);
    setTitleSuggestions([]);
  };

  // Delete story image and Update the story
  const handleDeleteStoryImg = async () => {
    // Deleting the Image
    const deleteImgRes = await axiosInstance.delete("/delete-image", {
      params: {
        imageUrl: storyInfo.imageUrl,
      },
    });

    if (deleteImgRes.data) {
      const storyId = storyInfo._id;

      const postData = {
        title,
        story,
        visitedLocation,
        visitedDate: moment().valueOf(),
        imageUrl: "",
      };

      // Updating story
      const response = await axiosInstance.put(
        "/edit-story/" + storyId,
        postData
      );
      setStoryImg(null);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Upadte Story"}
        </h5>

        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
            {type === "add" ? (
              <button className="btn-small" onClick={handleAddOrUpdateClick}>
                <MdAdd className="text-lg" /> ADD STORY
              </button>
            ) : (
              <>
                <button className="btn-small" onClick={handleAddOrUpdateClick}>
                  <MdUpdate className="text-lg" /> UPDATE STORY
                </button>
              </>
            )}

            <button className="" onClick={onClose}>
              <MdClose className="text-xl text-slate-400" />
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs pt-2 text-right">{error}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex-1 flex flex-col gap-2 pt-4">
          <div className="flex items-center justify-between">
            <label className="input-label">TITLE</label>
            <button
              type="button"
              onClick={handleGenerateTitle}
              disabled={isGeneratingTitle}
              className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50 text-sm"
            >
              <MdTitle className="text-sm" />
              {isGeneratingTitle ? 'Generating...' : 'Generate Title'}
            </button>
          </div>
          <input
            type="text"
            className="text-2xl text-slate-950 outline-none"
            placeholder="A Day at the Great Wall"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          
          {showTitleSuggestions && titleSuggestions.length > 0 && (
            <div className="mt-2 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-700 mb-2">Title Suggestions:</p>
              {titleSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => selectTitle(suggestion)}
                  className="block w-full text-left p-2 hover:bg-purple-100 rounded text-sm text-slate-700 mb-1"
                >
                  {suggestion}
                </button>
              ))}
              <button
                onClick={() => setShowTitleSuggestions(false)}
                className="text-xs text-purple-600 hover:text-purple-800 mt-1"
              >
                Close suggestions
              </button>
            </div>
          )}

          <div className="my-3">
            <DateSelector date={visitedDate} setDate={setVisitedDate} />
          </div>

          <ImageSelector
            image={storyImg}
            setImage={setStoryImg}
            handleDeleteImg={handleDeleteStoryImg}
          />

          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center justify-between">
              <label className="input-label">STORY</label>
              <button
                type="button"
                onClick={handleEnhanceStory}
                disabled={isEnhancing}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 text-sm"
              >
                <MdAutoAwesome className="text-sm" />
                {isEnhancing ? 'Enhancing...' : 'Enhance Story'}
              </button>
            </div>
            <textarea
              type="text"
              className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
              placeholder="Your Story"
              rows={10}
              value={story}
              onChange={({ target }) => setStory(target.value)}
            />
          </div>

          <div className="pt-3">
            <label className="input-label">VISITED LOCATIONS</label>
            <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
            <div>
              <label className="input-label">SPENDING ($)</label>
              <input
                type="number"
                className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded w-full"
                placeholder="0"
                value={spending}
                onChange={({ target }) => setSpending(Number(target.value))}
              />
            </div>
            <div>
              <label className="input-label">CATEGORY</label>
              <select
                className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded w-full"
                value={spendingCategory}
                onChange={({ target }) => setSpendingCategory(target.value)}
              >
                <option value="Activities">Activities</option>
                <option value="Accommodation">Accommodation</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
              </select>
            </div>
            <div>
              <label className="input-label">DURATION (days)</label>
              <input
                type="number"
                className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded w-full"
                placeholder="1"
                min="1"
                value={tripDuration}
                onChange={({ target }) => setTripDuration(Number(target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditTravelStory;
