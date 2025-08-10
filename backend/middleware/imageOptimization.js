const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Middleware for image optimization
const optimizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const { filename, path: filePath } = req.file;
    const outputPath = path.join(path.dirname(filePath), `optimized_${filename}`);
    
    // Optimize image with Sharp
    await sharp(filePath)
      .resize(1200, 800, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    // Replace original file with optimized version
    fs.unlinkSync(filePath);
    fs.renameSync(outputPath, filePath);

    next();
  } catch (error) {
    console.error('Image optimization failed:', error);
    next(); // Continue without optimization if it fails
  }
};

// Generate WebP version
const generateWebP = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const { filename, path: filePath } = req.file;
    const webpPath = filePath.replace(/\.[^/.]+$/, '.webp');
    
    await sharp(filePath)
      .webp({ quality: 80 })
      .toFile(webpPath);

    // Add WebP path to request for reference
    req.webpPath = webpPath;
    
    next();
  } catch (error) {
    console.error('WebP generation failed:', error);
    next();
  }
};

module.exports = { optimizeImage, generateWebP };