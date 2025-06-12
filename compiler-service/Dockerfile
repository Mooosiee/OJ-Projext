# Step 1: Choose a Base Image
# We'll use an official Node.js image based on Alpine Linux.
# Alpine is small. node:18-alpine includes Node.js and npm.
FROM node:18-alpine

# Step 2: Set the Working Directory
# This is where our application code will live inside the container.
WORKDIR /compiler-service-backend

# Step 3: Install System Dependencies (Compilers & Runtimes)
# 'apk' is Alpine's package manager.
# --no-cache: reduces image size by not keeping the package index locally.
# build-base: Provides common tools needed for compiling (like make).
# g++: The C++ compiler.
# python3: Python 3 runtime.
# openjdk17-jdk-headless: Java Development Kit (includes javac for compiling and java for running).
#                         'headless' means no GUI components, good for servers.
# nodejs & npm are already in the base image.
RUN apk update && \
    apk add --no-cache \
    build-base \
    g++ \
    python3 \
    openjdk17
    # 'time' utility can be added later if you implement resource measurement
    # For Alpine, 'time' might be in 'util-linux' or 'busybox' (often pre-installed)

#doing this before npm install because to run nom install we need package.json and package.lock.json
COPY . .
# Step 5: Install Node.js Dependencies for Your Compiler Service Application
# This installs libraries like Express, node-cron, etc., listed in your package.json.
# --production: (Optional) If you only want to install production dependencies.
#               Remove --production if you have devDependencies needed at runtime (unlikely for this service).
RUN npm install
# Or: yarn install
# Or: pnpm install

# Step 6: Copy Application Code
# Copies all files and folders from your compiler-service project directory
# (the directory where this Dockerfile is) into the /app directory inside the container.


# Step 7: Create Temporary Directories (Optional but good practice)
# These are the folders where user code, inputs, and outputs will be temporarily stored.
# Your application scripts (generateFile.js, etc.) should also be robust enough
# to create these if they don't exist, but creating them here ensures they're present.
# RUN mkdir -p /app/codes /app/inputs /app/outputs /app/stats

# Step 8: Expose Port
# Informs Docker that the application inside the container will listen on this port.
# This does NOT automatically make it accessible from your host machine;
# that's done with the '-p' flag in 'docker run'.
EXPOSE 8000 
# Change 8000 if your compiler service listens on a different port

# Step 9: Define the Command to Run Your Application
# This command is executed when the container starts.
# It tells Node.js to run your server.js file.
CMD ["node", "server.js"]
# Alternatively, if you have a "start" script in your package.json (e.g., "start": "node server.js"):
# CMD ["npm", "start"]