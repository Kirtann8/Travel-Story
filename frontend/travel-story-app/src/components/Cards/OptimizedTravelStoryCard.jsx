import React, { useState, useRef, useEffect } from "react";
import { MdFavorite, MdFavoriteBorder, MdLocationOn, MdCalendarToday } from "react-icons/md";
import moment from "moment";

const OptimizedTravelStoryCard = ({
  imgUrl,
  title,
  story,
  date,
  visitedLocation,
  isFavourite,
  onClick,
  onFavouriteClick,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const cardRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Convert image to WebP if supported
  const getOptimizedImageUrl = (url) => {
    if (!url) return '';
    
    // Check if browser supports WebP
    const supportsWebP = document.createElement('canvas')
      .toDataURL('image/webp')
      .indexOf('data:image/webp') === 0;
    
    if (supportsWebP && !url.includes('.webp')) {
      // In a real implementation, you'd have WebP versions on your server
      return url; // For now, return original
    }
    
    return url;
  };

  return (
    <div
      ref={cardRef}
      className="border rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-56 bg-gray-200">
        {inView && (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              </div>
            )}
            <img
              src={getOptimizedImageUrl(imgUrl)}
              alt={title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          </>
        )}

        <button
          className="w-12 h-12 flex items-center justify-center bg-white/70 hover:bg-white rounded-lg border border-white/30 absolute top-4 right-4"
          onClick={(e) => {
            e.stopPropagation();
            onFavouriteClick();
          }}
        >
          {isFavourite ? (
            <MdFavorite className="text-red-500" />
          ) : (
            <MdFavoriteBorder className="text-white" />
          )}
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h6 className="text-sm font-medium">{title}</h6>
            <span className="text-xs text-slate-500">
              {story ? story.slice(0, 60) + "..." : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <MdLocationOn className="text-sm text-cyan-600" />
            <span className="text-xs text-slate-500">
              {visitedLocation.map((item) => item).join(", ")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MdCalendarToday className="text-sm text-cyan-600" />
            <span className="text-xs text-slate-500">
              {moment(date).format("Do MMM YYYY")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedTravelStoryCard;