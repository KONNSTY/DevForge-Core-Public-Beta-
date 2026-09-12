Write-Host "Starting DevForge Core [Public Beta] locally..." -ForegroundColor Cyan
Write-Host "Bringing up Docker Compose..."

docker compose up --build -d

Write-Host ""
Write-Host "DevForge Core is starting up!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000"
Write-Host "Backend API: http://localhost:5000"
Write-Host "Swagger Docs: http://localhost:5000/swagger"
Write-Host ""
Write-Host "To view logs, run: docker compose logs -f"
Write-Host "To stop, run: docker compose down"
