# Use Node.js as the base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy project files to the container
COPY . .

# Install dependencies
RUN npm install

# Download and set up FFmpeg and yt-dlp
RUN apt-get update && apt-get install -y wget && \
    wget https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz && \
    tar -xvf ffmpeg-release-amd64-static.tar.xz && \
    mv ffmpeg-*-static/ffmpeg ffmpeg-*-static/ffprobe /usr/local/bin/ && \
    chmod +x /usr/local/bin/ffmpeg /usr/local/bin/ffprobe && \
    wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp && \
    chmod +x yt-dlp && mv yt-dlp /usr/local/bin/

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
