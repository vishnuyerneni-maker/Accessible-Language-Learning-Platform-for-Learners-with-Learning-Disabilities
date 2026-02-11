@echo off
echo ===================================
echo   Starting AccessLearn...
echo ===================================
echo.
cd react-app
echo Installing dependencies (if needed)...
call npm install
echo.
echo Launching Application...
npm run dev
pause
