@echo off
echo ========================================
echo   Starting AgroGuard AI Backend Server
echo ========================================
echo.

echo Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)
echo.

echo Starting Flask backend server...
echo Backend will run on: http://localhost:5000
echo.
echo ⚠️  IMPORTANT: Keep this window open while using the app!
echo Press CTRL+C to stop the server
echo.
echo ========================================

python app.py

pause
