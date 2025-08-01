# Use the official Node.js image as the base image
FROM node:20-slim

# Container name
LABEL name="bet-analyzer"

# Set the working directory
WORKDIR /usr/src/app

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# # Install Google Chrome Stable and fonts
# # Note: this installs the necessary libs to make the browser work with Puppeteer.
# RUN apt-get update && apt-get install gnupg wget -y && \
#     wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
#     sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
#     apt-get update && \
#     apt-get install google-chrome-stable -y --no-install-recommends && \
#     rm -rf /var/lib/apt/lists/*

# # Verify that Chrome is installed at the expected location
# RUN ls -alh /usr/bin/google-chrome-stable && \
#     /usr/bin/google-chrome-stable --version

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies including Puppeteer
RUN npm install

# Bundle app source code
COPY . .

# Install Playwright browsers
RUN npx playwright install --with-deps

# Build the application
RUN npm run build

# Expose the port on which your app will run
EXPOSE 8080

# Start the application
CMD ["npm", "run", "start:prod"]