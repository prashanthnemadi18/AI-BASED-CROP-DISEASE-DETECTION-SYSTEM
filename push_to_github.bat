@echo off
echo ========================================
echo Pushing Hey Agri + Model Files to GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo Step 1: Checking git status...
git status
echo.

echo Step 2: Pushing to GitHub (this may take a while for large files)...
git push origin clean-main
echo.

if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo ✅ SUCCESS! Push completed successfully!
    echo ========================================
    echo.
    echo Your repository now includes:
    echo ✅ Hey Agri Voice Assistant
    echo ✅ Kannada Chatbot
    echo ✅ ML Model Files ^(via Git LFS^)
    echo ✅ Complete Documentation
    echo.
) else (
    echo ========================================
    echo ❌ Push failed!
    echo ========================================
    echo.
    echo Possible reasons:
    echo - Authentication required
    echo - Network issues
    echo - Git LFS quota exceeded
    echo.
    echo Please try running: git push origin clean-main
    echo.
)

pause
