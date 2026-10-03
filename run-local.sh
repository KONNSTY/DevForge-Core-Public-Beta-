#!/bin/bash

echo "Starting devForgeCore Powerd by Regler Productions - Polymath Productions locally..."
echo "Bringing up Docker Compose..."

docker compose up --build -d

echo ""
echo "DevForge Core is starting up!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000"
echo "OpenAPI JSON: http://localhost:5000/openapi/v1.json"
echo "Isolated Python/C# runner: http://localhost:2000"
echo ""
echo "To view logs, run: docker compose logs -f"
echo "To stop, run: docker compose down"
