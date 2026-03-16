#!/bin/bash

# Create server .env file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "Creating server/.env file..."
    echo "MONGO_URI=mongodb://mongo:27017/agriconnect" > server/.env
    echo "JWT_SECRET=agriconnect_secret_key_2024" >> server/.env
    echo "PORT=5000" >> server/.env
    echo "NODE_ENV=development" >> server/.env
fi

# Clean up any existing containers and volumes
echo "Cleaning up existing containers and volumes..."
docker-compose down -v

# Build and start the containers
echo "Building and starting containers..."
docker-compose up --build 