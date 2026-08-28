# Use Node.js slim variant (smaller image, faster pull)
FROM node:18-slim

# Install curl (not included in slim) and clean up apt cache
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Download yt-dlp and place it in the tools directory
RUN mkdir -p ./tools && \
    curl -L -o ./tools/yt-dlp https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp && \
    chmod +x ./tools/yt-dlp

# Make other binaries executable if they exist
RUN chmod +x ./tools/ffmpeg ./tools/ffprobe || true

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
