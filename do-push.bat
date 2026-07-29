@echo off
cd /d C:\Users\kioko\skilara
git add -A
git commit -m "audit: no refunds policy, fix 75%% threshold, add AI job description generation"
git push
echo.
echo Exit code: %ERRORLEVEL%
timeout /t 5
