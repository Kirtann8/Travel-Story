#!/bin/bash

# Deployment script for Travel Story App
echo "Starting deployment..."

# Navigate to project directory
cd /home/ubuntu/045305_merntravelstoryapp16092024

# Pull latest changes
git pull origin main

# Update backend dependencies
echo "Updating backend..."
cd backend
npm install --production

# Restart backend with PM2
pm2 restart travelstory-backend

# Update and build frontend
echo "Building frontend..."
cd ../frontend/travel-story-app
npm install
npm run build

# Copy built files to nginx directory
sudo cp -r dist/* /var/www/html/

# Restart nginx
sudo systemctl restart nginx

echo "Deployment completed successfully!"