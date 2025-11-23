# Snapchat Bulk Unfollow Automation

Automate unfollowing accounts on Snapchat using Appium and WebDriverIO. This script efficiently removes followers from your Following list with minimal delays.

## ✨ Features

- 🚀 **High Speed**: Processes accounts in ~0.3-0.4 seconds each
- 🎯 **Smart Navigation**: Avoids notifications by targeting the 4th row
- 🔄 **Unlimited**: Continues until your Following list is empty
- 🛡️ **Safe**: Uses official Appium framework
- 📊 **Progress Tracking**: Real-time console feedback
- 🐛 **Debug Mode**: Automatic page source dumps on errors

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v14 or higher)
- **Android SDK** (with platform-tools)
- **Appium** (installed globally)
- **Android Device** with USB debugging enabled
- **Snapchat** app installed and logged in

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/snapchat-unfollow-automation.git
cd snapchat-unfollow-automation
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Android SDK

#### Windows

1. Download [Android Studio](https://developer.android.com/studio)
2. Install Android SDK (default: `%LOCALAPPDATA%\Android\Sdk`)
3. Set environment variables:
   ```cmd
   setx ANDROID_HOME "C:\Users\YourName\AppData\Local\Android\Sdk"
   setx ANDROID_SDK_ROOT "C:\Users\YourName\AppData\Local\Android\Sdk"
   ```
4. Add to PATH:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`

**Or use the automated setup script:**
```bash
setup_android_env.bat
```

#### macOS/Linux

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools
```

### 4. Install Appium

```bash
npm install -g appium
npm install -g appium-doctor

# Verify installation
appium-doctor --android
```

### 5. Configure Device

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and add your device ID:

```env
DEVICE_ID=your-device-id-here
```

**To get your device ID:**
```bash
adb devices
```

## 🎮 Usage

### Basic Usage

1. **Start Appium Server:**
   ```bash
   appium --port 4723
   ```

2. **Connect your Android device:**
   - Enable USB debugging in Developer Options
   - Connect via USB or WiFi
   - Verify: `adb devices`

3. **Open Snapchat** and navigate to:
   - Your Profile → Following list

4. **Run the script:**
   ```bash
   node unfollow_script.js
   ```

### Expected Output

```
✓ Connected to device.

⚠️  IMPORTANT: Make sure you are on the "Following" screen in Snapchat!

━━━ Iteration 1/999999 ━━━
🔍 Looking for follower rows...
✓ Found row using: //androidx.recyclerview...
👆 Tapping on the X button area...
🔍 Looking for "Yes" button...
✓ Found element using: //android.widget...
👆 Clicking "Yes" to confirm...
✅ Unfollowed successfully! (1/999999)

━━━ Iteration 2/999999 ━━━
...

🏁 Finished! Unfollowed 150/999999 accounts.
```

## ⚙️ Configuration

### Customize Settings

Edit configuration in `unfollow_script.js`:

```javascript
const MAX_UNFOLLOWS = 999999;  // Maximum accounts to unfollow
const TARGET_ROW_INDEX = 4;     // Which row to click (avoid notifications)
```

### Adjust Speed

Modify delays in the script (in milliseconds):
- Initial pause: `500ms`
- After clicking X: `200ms`
- After clicking Yes: `0ms` (instant)

**Note:** Lower delays = faster but may cause errors if UI is slow

## 🐛 Troubleshooting

### "ANDROID_HOME not found"
Run `setup_android_env.bat` (Windows) or export the variables manually.

### "No follower rows found"
- Ensure you're on the Following screen
- Check the page source dump: `no_rows_dump.xml`
- Verify Snapchat is up to date

### "Device not found"
```bash
adb devices                    # Check connection
adb kill-server && adb start-server  # Restart ADB
```

### "Element not found" errors
- Increase delays in the script
- Run `node inspect_ui.js` to dump page source
- Update selectors based on XML structure

### Script runs but nothing happens
- Verify Appium server is running on port 4723
- Check device logs: `adb logcat`
- Ensure Snapchat has the Following screen open

## 📁 Project Structure

```
snapchat-unfollow-automation/
├── unfollow_script.js       # Main automation script
├── inspect_ui.js            # UI inspector helper
├── setup_android_env.bat    # Windows environment setup
├── package.json             # Node dependencies
├── .env.example             # Example configuration
├── .gitignore               # Git ignore file
├── LICENSE                  # MIT License
└── README.md                # This file
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## ⚠️ Disclaimer

This tool is for educational purposes only. Use at your own risk. The authors are not responsible for any consequences of using this automation tool. Always comply with Snapchat's Terms of Service.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Appium](http://appium.io/)
- Uses [WebDriverIO](https://webdriver.io/)
- Inspired by the need for efficient social media management

## 📧 Support

If you encounter issues:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [Issues](https://github.com/yourusername/snapchat-unfollow-automation/issues)
3. Create a new issue with:
   - Error message
   - Page source dump (if available)
   - Steps to reproduce

---

**⭐ If this helped you, please star the repository!**
