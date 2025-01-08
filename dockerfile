# Use Node.js as the base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy project files to the container
COPY . .

# Make the binaries executable
RUN chmod +x ./tools/yt-dlp ./tools/ffmpeg ./tools/ffprobe

# Install dependencies
RUN npm install

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
