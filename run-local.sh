#!/bin/bash

echo "Starting DevForge Core [Public Beta] locally..."
echo "Bringing up Docker Compose..."

docker compose up --build -d

echo ""
echo "DevForge Core is starting up!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000"
echo "Swagger Docs: http://localhost:5000/swagger"
echo ""
echo "To view logs, run: docker compose logs -f"
echo "To stop, run: docker compose down"
