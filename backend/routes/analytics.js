const express = require("express");
const { authenticateToken } = require("../utilities");
const TravelStory = require("../models/travelStory.model");
const router = express.Router();

// Get travel statistics
router.get("/stats", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    
    const stories = await TravelStory.find({ userId });
    
    // Basic stats
    const totalTrips = stories.length;
    const countries = [...new Set(stories.flatMap(s => s.visitedLocation))];
    const totalCountries = countries.length;
    
    // Favorite destinations (from favorite stories only)
    const locationCount = {};
    stories.filter(story => story.isFavourite).forEach(story => {
      story.visitedLocation.forEach(loc => {
        locationCount[loc] = (locationCount[loc] || 0) + 1;
      });
    });
    
    const favoriteDestinations = Object.entries(locationCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([location, count]) => ({ location, count }));
    
    // Monthly activity
    const monthlyActivity = {};
    stories.forEach(story => {
      const month = new Date(story.visitedDate).toISOString().slice(0, 7);
      monthlyActivity[month] = (monthlyActivity[month] || 0) + 1;
    });
    
    // Trip duration from real data
    const avgTripDuration = stories.length ? Math.round(stories.reduce((sum, s) => sum + (s.tripDuration || 1), 0) / stories.length) : 1
    
    // Most photographed locations (based on story count)
    const photographedLocations = favoriteDestinations.slice(0, 3);
    
    res.json({
      totalTrips,
      totalCountries,
      countries,
      favoriteDestinations,
      monthlyActivity,
      avgTripDuration,
      photographedLocations,
      recentTrips: stories.slice(-5).reverse()
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// Get spending data
router.get("/spending", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const stories = await TravelStory.find({ userId });
    
    const spendingData = stories.map(story => ({
      id: story._id,
      title: story.title,
      location: story.visitedLocation[0] || "Unknown",
      amount: story.spending || 0,
      date: story.visitedDate,
      category: story.spendingCategory || "Activities"
    }));
    
    const totalSpending = spendingData.reduce((sum, item) => sum + item.amount, 0);
    
    res.json({
      totalSpending,
      spendingData,
      avgPerTrip: stories.length ? Math.round(totalSpending / stories.length) : 0
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch spending data" });
  }
});

module.exports = router;