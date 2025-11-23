@echo off
REM Android SDK Setup Script for Appium

echo ============================================
echo Android SDK Environment Variable Setup
echo ============================================
echo.

REM Check common Android SDK locations
set SDK_PATH=
if exist "%LOCALAPPDATA%\Android\Sdk" (
    set SDK_PATH=%LOCALAPPDATA%\Android\Sdk
    echo Found Android SDK at: %SDK_PATH%
) else if exist "%USERPROFILE%\AppData\Local\Android\Sdk" (
    set SDK_PATH=%USERPROFILE%\AppData\Local\Android\Sdk
    echo Found Android SDK at: %SDK_PATH%
) else if exist "C:\Android\Sdk" (
    set SDK_PATH=C:\Android\Sdk
    echo Found Android SDK at: %SDK_PATH%
) else if exist "C:\Program Files\Android\Sdk" (
    set SDK_PATH=C:\Program Files\Android\Sdk
    echo Found Android SDK at: %SDK_PATH%
) else (
    echo ERROR: Could not find Android SDK in common locations.
    echo.
    echo Please install Android SDK or manually specify the path:
    echo Common locations:
    echo   - %%LOCALAPPDATA%%\Android\Sdk
    echo   - C:\Android\Sdk
    echo   - C:\Program Files\Android\Sdk
    echo.
    echo If you have Android Studio installed, the SDK is usually in:
    echo   %LOCALAPPDATA%\Android\Sdk
    echo.
    pause
    exit /b 1
)

echo.
echo Setting environment variables...
echo ANDROID_HOME=%SDK_PATH%
echo ANDROID_SDK_ROOT=%SDK_PATH%
echo.

REM Set for current session
set ANDROID_HOME=%SDK_PATH%
set ANDROID_SDK_ROOT=%SDK_PATH%

REM Add platform-tools and tools to PATH for current session
set PATH=%SDK_PATH%\platform-tools;%SDK_PATH%\tools;%SDK_PATH%\tools\bin;%PATH%

echo ✓ Environment variables set for current session!
echo.
echo To make this permanent (requires admin):
echo 1. Press Windows + R
echo 2. Type: sysdm.cpl
echo 3. Go to "Advanced" tab -^> "Environment Variables"
echo 4. Under "User variables", click "New"
echo 5. Add:
echo    Variable name: ANDROID_HOME
echo    Variable value: %SDK_PATH%
echo 6. Add another:
echo    Variable name: ANDROID_SDK_ROOT
echo    Variable value: %SDK_PATH%
echo 7. Edit PATH variable and add:
echo    %SDK_PATH%\platform-tools
echo    %SDK_PATH%\tools
echo.
echo Alternatively, run these commands as Administrator:
echo.
echo setx ANDROID_HOME "%SDK_PATH%"
echo setx ANDROID_SDK_ROOT "%SDK_PATH%"
echo setx PATH "%%PATH%%;%SDK_PATH%\platform-tools;%SDK_PATH%\tools"
echo.
echo ============================================
echo Ready to run the script!
echo Environment is configured for this session.
echo ============================================
echo.
pause
