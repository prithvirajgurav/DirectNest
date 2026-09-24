#!/bin/bash
# ==============================================================================
# DirectNest - Local Development Startup Script
# ==============================================================================

echo "=========================================="
echo "    Starting DirectNest Marketplace       "
echo "=========================================="

# Check MySQL
echo "Checking environment..."

# Start Backend
echo "Starting Spring Boot Backend on http://localhost:8080 ..."
cd backend
./mvnw spring-boot:run &
BACKEND_PID=$!
cd ..

# Start Frontend
echo "Starting React Vite Frontend on http://localhost:5173 ..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "DirectNest is starting up!"
echo "Backend:  http://localhost:8080"
echo "Swagger:  http://localhost:8080/swagger-ui/index.html"
echo "Frontend: http://localhost:5173"
echo "Press Ctrl+C to stop all services."

trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
