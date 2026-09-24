@echo off
rem ==============================================================================
rem DirectNest - Local Development Startup Script (Windows)
rem ==============================================================================

echo ==========================================
echo     Starting DirectNest Marketplace
echo ==========================================

start "DirectNest Backend" cmd /k "cd backend && mvnw.cmd spring-boot:run"
start "DirectNest Frontend" cmd /k "cd frontend && npm run dev"

echo DirectNest is starting in separate windows!
echo Backend:  http://localhost:8080
echo Swagger:  http://localhost:8080/swagger-ui/index.html
echo Frontend: http://localhost:5173
