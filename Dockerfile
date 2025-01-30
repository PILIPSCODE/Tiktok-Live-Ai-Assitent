# Use Node.js as the base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy project files to the container
COPY . .

# Download yt-dlp and place it in the tools directory
RUN mkdir -p ./tools && \
    curl -L -o ./tools/yt-dlp https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp && \
    curl -L -o ./tools/yt-dlp.exe https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe && \
    chmod +x ./tools/yt-dlp ./tools/yt-dlp.exe

# Make other binaries executable if they exist
RUN chmod +x ./tools/ffmpeg ./tools/ffprobe || true

# Install dependencies
RUN npm install

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
