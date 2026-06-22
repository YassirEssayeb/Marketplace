@echo off
cd /d "%~dp0"

echo Demarrage de l'API backend...
start "Backend" cmd /c "cd /d backend && npm start"

echo Demarrage du frontend React...
start "Frontend" cmd /c "cd /d frontend && npm start"

echo Les deux serveurs demarrent...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
