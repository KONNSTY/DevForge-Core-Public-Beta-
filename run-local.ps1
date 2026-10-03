Write-Host "Starting devForgeCore Powerd by Regler Productions - Polymath Productions locally..." -ForegroundColor Cyan
Write-Host "Bringing up Docker Compose..."

docker compose up --build -d

Write-Host ""
Write-Host "DevForge Core is starting up!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000"
Write-Host "Backend API: http://localhost:5000"
Write-Host "OpenAPI JSON: http://localhost:5000/openapi/v1.json"
Write-Host "Isolated Python/C# runner: http://localhost:2000"
Write-Host ""
Write-Host "To view logs, run: docker compose logs -f"
Write-Host "To stop, run: docker compose down"
